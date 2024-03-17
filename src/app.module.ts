import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemoModule } from './memo/memo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from 'config/TypeORM.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), MemoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
