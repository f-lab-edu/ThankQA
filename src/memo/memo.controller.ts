import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MemoService } from './memo.service';
import { MemoEntity } from './memo.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @Get('/')
  async findAll(): Promise<MemoEntity[]> {
    return this.memoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MemoEntity> {
    return this.memoService.findOne(id);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() memo: MemoEntity): Promise<MemoEntity> {
    return this.memoService.create(memo);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() memo: MemoEntity,
  ): Promise<void> {
    await this.memoService.update(id, memo);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.memoService.delete(id);
  }
}
