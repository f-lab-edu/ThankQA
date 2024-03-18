import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';
import { MulterModule } from '@nestjs/platform-express';
import * as mime from 'mime-types';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const s3 = new S3({
          region: configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get('AWS_S3_ACCESS_KEY'),
            secretAccessKey: configService.get('AWS_S3_SECRET_ACCESS_KEY'),
          },
        });

        console.log(configService.get('AWS_S3_BUCKET'));
        return {
          storage: multerS3({
            s3,
            bucket: configService.get('AWS_S3_BUCKET'),
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req, file, cb) {
              cb(
                null,
                `${new Date().getTime()}.${mime.extension(file.mimetype)}`,
              );
            },
          }),
          limits: {
            fileSize: 1024 * 1024 * 5, // 5 MB
            files: 1,
          },
          fileFilter(req, file, callback) {
            callback(null, true);
          },
        };
      },
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
