import { Test, TestingModule } from '@nestjs/testing';
import { MemoService } from './memo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MemoEntity } from './memo.entity';
import { NotFoundException } from '@nestjs/common';

describe('MemoService', () => {
  let memoService: MemoService;

  const mockMemoRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  // sample data
  const existingId = 1;
  const nonExistingId = 999;
  const sampleMemo: MemoEntity = {
    id: 1,
    memo: 'first memo',
    createdAt: new Date('2024-03-23T00:00:00Z'),
    updatedAt: new Date('2024-03-23T12:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemoService,
        {
          provide: getRepositoryToken(MemoEntity),
          useValue: mockMemoRepository,
        },
      ],
    }).compile();

    memoService = module.get<MemoService>(MemoService);
  });
  it('Should_BeDefined', () => {
    expect(memoService).toBeDefined();
  });

  it('Should_ReturnAllMemos_When_FindAllIsCalled', async () => {
    // arragne
    const memos: MemoEntity[] = [sampleMemo, sampleMemo];

    jest.spyOn(mockMemoRepository, 'find').mockReturnValue(memos);
    // act
    const result = await memoService.findAll();
    // assert
    expect(mockMemoRepository.find).toHaveBeenCalled();
    expect(result).toEqual(memos);
  });
  it('Should_ReturnMemo_When_FindMemoByIdIsCalledWithExistingId', async () => {
    //arrange
    const id = existingId;
    jest.spyOn(mockMemoRepository, 'findOne').mockResolvedValue(sampleMemo);

    //act
    const result = await memoService.findOne(id);

    //assert
    expect(mockMemoRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(result).toBe(sampleMemo);
  });

  it('Should_ThrowNotFoundException_When_MemoIsNotFoundById', async () => {
    //arrange
    const id = nonExistingId;
    jest.spyOn(mockMemoRepository, 'findOne').mockResolvedValue(undefined);

    // act & assert
    await expect(memoService.findOne(id)).rejects.toThrow(NotFoundException);
    expect(mockMemoRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  });

  it('Should_ReturnMemo_When_FindOneIsCalledWithExistingId', async () => {
    //arrange
    const id = existingId;
    jest.spyOn(mockMemoRepository, 'findOne').mockResolvedValue(sampleMemo);

    //act
    const result = await memoService.findOne(id);

    //assert
    expect(mockMemoRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(result).toBe(sampleMemo);
  });
  it('Should_CreateMemo_When_CreateIsCalledWithMemo', async () => {
    //arragne
    jest.spyOn(mockMemoRepository, 'save').mockReturnValue(sampleMemo);
    //act
    const result = await memoService.create(sampleMemo);
    //assert
    expect(mockMemoRepository.save).toHaveBeenCalled();
    expect(result).toEqual(sampleMemo);
  });
  it('Should_UpdateMemo_When_UpdateIsCalledWithExistingIdAndUpdatedInfo', async () => {
    // Arrange
    const id = existingId;
    const updatedMemo: Partial<MemoEntity> = {
      memo: 'updated memo',
    };

    jest.spyOn(mockMemoRepository, 'findOne').mockResolvedValue(sampleMemo);
    jest.spyOn(mockMemoRepository, 'update').mockResolvedValue(undefined);

    // Act
    await memoService.update(id, updatedMemo);

    // Assert
    expect(mockMemoRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockMemoRepository.update).toHaveBeenCalledWith(id, updatedMemo);
  });

  it('Should_DeleteMemo_When_DeleteIsCalledWithExistingId', async () => {
    // Arrange
    const id = existingId;
    jest.spyOn(mockMemoRepository, 'findOne').mockResolvedValue(sampleMemo);
    jest.spyOn(mockMemoRepository, 'delete').mockResolvedValue(undefined);

    // Act
    await memoService.delete(id);

    // Assert
    expect(mockMemoRepository.findOne).toHaveBeenCalledWith({
      where: { id },
    });
    expect(mockMemoRepository.delete).toHaveBeenCalledWith(id);
  });
});
