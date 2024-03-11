import { Module } from '@nestjs/common';
import { MemoService } from './memo.service';
import { MemoController } from './memo.controller';
import { MemoEntity } from './memo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MemoEntity])],
  controllers: [MemoController],
  providers: [MemoService],
})
export class MemoModule {}
