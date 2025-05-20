import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

import { Comment, CommentSchema } from './comment.schema';
import { User, UserSchema } from '../users/user.schema';
import { Recipe, RecipeSchema } from 'src/recipe/recipe.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Recipe.name, schema: RecipeSchema },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
