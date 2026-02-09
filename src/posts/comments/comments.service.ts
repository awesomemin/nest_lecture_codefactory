import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginateCommentsDto } from './dto/paginate-comments.dto';
import { CommonService } from 'src/common/common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsModel } from './entity/comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly commentsRepository: Repository<CommentsModel>,
    private readonly commonService: CommonService,
  ) {}

  async paginateComments(postId: number, dto: PaginateCommentsDto) {
    return this.commonService.paginate(
      dto,
      this.commentsRepository,
      {
        where: {
          post: { id: postId },
        },
        relations: {
          author: true,
        },
      },
      `posts/${postId}/comments`,
    );
  }

  async getCommentById(postId: number, commentId: number) {
    const comment = this.commentsRepository.find({
      where: {
        id: commentId,
        post: {
          id: postId,
        },
      },
      relations: {
        author: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    return comment;
  }

  async createComment(dto: CreateCommentDto, postId: number, authorId: number) {
    return this.commentsRepository.save({
      author: {
        id: authorId,
      },
      post: {
        id: postId,
      },
      comment: dto.comment,
    });
  }

  async updateComment(
    userId: number,
    postId: number,
    commentId: number,
    dto: UpdateCommentDto,
  ) {
    const comment = await this.commentsRepository.findOne({
      where: {
        id: commentId,
        post: {
          id: postId,
        },
        author: {
          id: userId,
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    comment.comment = dto.comment;

    await this.commentsRepository.save(comment);

    return commentId;
  }

  async deleteComment(userId: number, postId: number, commentId: number) {
    const targetComment = await this.commentsRepository.findOne({
      where: {
        id: commentId,
        post: {
          id: postId,
        },
        author: {
          id: userId,
        },
      },
    });

    if (!targetComment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    await this.commentsRepository.delete(commentId);

    return targetComment.id;
  }
}
