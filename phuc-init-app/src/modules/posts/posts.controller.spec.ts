import { Test, TestingModule } from '@nestjs/testing';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            getAllPosts: () => {
              return [Post];
            },
            getPostById: () => {
              return Post;
            },
            createPost: ({}) => {
              return Post;
            },
            updatePost: ({}) => {
              return Post;
            },
            deletePost: ({}) => {
              return '1';
            },
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllPost - should return an array of posts', () => {
    const result = controller.getAllPost();

    expect(result).toEqual([Post]);
  });

  it('getPostById - should return a post', () => {
    const id = '1';
    const result = controller.getPostById(id);

    expect(result).toEqual(Post);
  });

  it('createPost - should return a post', () => {
    const createPostDto = {
      content: 'post content',
      title: 'post title',
    };

    const result = controller.createPost(createPostDto);

    expect(result).toEqual(Post);
  });

  it('updatePost - should return a post', () => {
    const id = '1';
    const updatePostDto = {
      content: 'post content',
      title: 'post title',
    };
    const result = controller.updatePost(id, updatePostDto);

    expect(result).toEqual(Post);
  });

  it('deletePost - should return httpCode 200', () => {
    const id = '1';
    const result = controller.deletePost(id);

    expect(result).toEqual('1');
  });
});
