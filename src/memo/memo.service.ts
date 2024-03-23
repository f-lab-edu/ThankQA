import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemoEntity } from './memo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MemoService {
  constructor(
    @InjectRepository(MemoEntity)
    private memoRepository: Repository<MemoEntity>,
  ) {}

  async findAll(): Promise<MemoEntity[]> {
    return await this.memoRepository.find();
  }

  private async findMemoById(id: number): Promise<MemoEntity> {
    const foundMemo = await this.memoRepository.findOne({
      where: { id },
    });

    if (!foundMemo) {
      throw new NotFoundException(`Memo with ID ${id} not found`);
    }

    return foundMemo;
  }

  async findOne(id: number): Promise<MemoEntity> {
    return await this.findMemoById(id);
  }

  async create(memo: MemoEntity): Promise<MemoEntity> {
    return await this.memoRepository.save(memo);
  }

  async update(id: number, memo: Partial<MemoEntity>): Promise<void> {
    await this.findMemoById(id);
    await this.memoRepository.update(id, memo);
  }

  async delete(id: number): Promise<void> {
    await this.findMemoById(id);
    await this.memoRepository.delete(id);
  }
}
