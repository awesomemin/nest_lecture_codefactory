import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PaginateCommentsDto } from './dto/paginate-comments.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: PaginateCommentsDto,
  ) {
    return this.commentsService.paginateComments(postId, query);
  }

  @Get(':commentId')
  getComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentsService.getCommentById(postId, commentId);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  postComment(
    @User('id') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(dto, postId, userId);
  }

  @Patch(':commentId')
  @UseGuards(AccessTokenGuard)
  patchComment(
    @User('id') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(userId, postId, commentId, dto);
  }

  @Delete(':commentId')
  @UseGuards(AccessTokenGuard)
  deleteComment(
    @User('id') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentsService.deleteComment(userId, postId, commentId);
  }
}
