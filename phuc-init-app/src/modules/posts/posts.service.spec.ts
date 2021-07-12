import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { CreatePostDTO } from './dtos/createPost.dto';
import { UpdatePostDTO } from './dtos/updatePost.dto';
import { UpdateResult } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;

  const mockedExecute = {
    execute: jest.fn(),
  };
  const mockedDelete = jest.fn(() => ({
    from: jest.fn(() => ({
      where: jest.fn(() => ({
        returning: jest.fn(() => ({
          execute: mockedExecute.execute,
        })),
      })),
    })),
  }));
  const createQueryBuilder = jest
    .fn()
    .mockReturnValue({ delete: mockedDelete });

  const mockedPostRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    createQueryBuilder,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockedPostRepository,
          // useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAllPost - should return an array of Posts', async () => {
    mockedPostRepository.find.mockReturnValue(Promise.resolve([Post]));
    const result = await service.getAllPosts();

    expect(result).toEqual([Post]);
  });

  it('getPostById - should return a Post', async () => {
    mockedPostRepository.findOne.mockReturnValue(Promise.resolve(Post));
    const id = 1;
    const result = await service.getPostById(id);

    expect(result).toEqual(Post);
  });

  it('getPostById - should throw error', async () => {
    mockedPostRepository.findOne.mockReturnValue(undefined);
    const id = 1;

    await expect(service.getPostById(id)).rejects.toThrow();
  });

  it('createPost - should return a Post', async () => {
    const createPostDto: CreatePostDTO = {
      title: 'post 1',
      content: 'hello world',
    };
    mockedPostRepository.create.mockImplementation(
      (createPostDto) => createPostDto,
    );
    mockedPostRepository.save.mockImplementation((createPostDto) =>
      Promise.resolve({ id: Date.now(), ...createPostDto }),
    );
    const result = await service.createPost(createPostDto);

    expect(result).toEqual({
      id: expect.any(Number),
      ...createPostDto,
    });
  });

  it('updatePost - should return a Post', async () => {
    const id = Date.now();
    const updatePostDto: UpdatePostDTO = {
      title: 'post 1',
      content: 'hello world',
    };
    mockedPostRepository.update.mockImplementation(() => UpdateResult);
    mockedPostRepository.findOne.mockReturnValue(
      Promise.resolve({ id, ...updatePostDto }),
    );

    const result = await service.updatePost(id, updatePostDto);

    expect(result).toEqual({ id: expect.any(Number), ...updatePostDto });
  });

  it('updatePost - should throw error', async () => {
    const id = Date.now();
    const updatePostDto: UpdatePostDTO = {
      title: 'post 1',
      content: 'hello world',
    };
    mockedPostRepository.update.mockImplementation(() => UpdateResult);
    mockedPostRepository.findOne.mockReturnValue(undefined);

    await expect(service.updatePost(id, updatePostDto)).rejects.toThrow();
  });

  it('deletePost - should return a postId', async () => {
    const id = Date.now();
    mockedPostRepository.findOne.mockReturnValue(Promise.resolve(Post));
    mockedExecute.execute.mockReturnValue({ raw: { id } });

    const result = await service.deletePost(id);

    expect(result).toEqual(id);
  });

  it('deletePost - should throw error', async () => {
    const id = Date.now();
    jest.spyOn(service, 'getPostById').mockReturnValue(undefined);

    const errorExpected = new HttpException(
      'Post not found',
      HttpStatus.NOT_FOUND,
    );
    await expect(service.deletePost(id)).rejects.toThrowError(errorExpected);
  });
});
