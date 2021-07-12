import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './dtos/createPost.dto';
import { UpdatePostDTO } from './dtos/updatePost.dto';
import { Post } from './entities/post.entity';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  getAllPosts() {
    return this.postsRepository.find();
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne(id);
    if (post) {
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createPost(post: CreatePostDTO) {
    const result = await this.postsRepository.save(post);

    return result;
  }

  async updatePost(id: number, post: UpdatePostDTO) {
    await this.postsRepository.update(id, post);

    const updatedPost = await this.postsRepository.findOne(id);
    if (updatedPost) {
      return updatedPost;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async deletePost(id: number) {
    const postFound = await this.getPostById(id);
    if (postFound) {
      const deleteResponse = await this.postsRepository
        .createQueryBuilder()
        .delete()
        .from(Post)
        .where('id = :id', { id })
        .returning('id')
        .execute();

      return deleteResponse.raw.id;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }
}
