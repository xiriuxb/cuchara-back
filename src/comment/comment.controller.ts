import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':recipeId')
  async commentOnRecipe(
    @Param('recipeId') recipeId: string,
    @Body('content') content: string,
    @Req() req: any,
  ) {
    return this.commentService.createComment(recipeId, req.userId, content);
  }

  @Get(':recipeId')
  async getRecipeComments(@Param('recipeId') recipeId: string) {
    return this.commentService.getCommentsForRecipe(recipeId);
  }
}
