import { Injectable, NotFoundException } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {}
  uploadFile(file: Express.Multer.File) {
    return file;
  }

  async deleteItem(key: string): Promise<void> {
    const bucket = this.configService.get('AWS_S3_BUCKET');

    const exists = await this.objectExists(bucket, key);
    if (!exists) {
      throw new NotFoundException(
        `The object with key "${key}" does not exist.`,
      );
    }

    const s3 = new S3({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });

    await s3.deleteObject({
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: key,
    });
  }

  private async objectExists(bucket: string, key: string): Promise<boolean> {
    const s3 = new S3({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });

    try {
      await s3.headObject({
        Bucket: bucket,
        Key: key,
      });
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }
}
