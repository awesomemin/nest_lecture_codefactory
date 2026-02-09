import { PickType } from '@nestjs/mapped-types';
import { CommentsModel } from '../entity/comments.entity';

export class UpdateCommentDto extends PickType(CommentsModel, ['comment']) {}
