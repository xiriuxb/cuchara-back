import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { LikesService } from './like.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':recipeId')
  async toggle(@Param('recipeId') recipeId: string, @Req() req: any) {
    return this.likesService.toggleLike(req.userId, recipeId);
  }

  @Get(':recipeId/count')
  async count(@Param('recipeId') recipeId: string) {
    const count = await this.likesService.countLikes(recipeId);
    return { count };
  }

  @Get(':recipeId/status')
  async status(@Param('recipeId') recipeId: string, @Req() req: any) {
    const liked = await this.likesService.hasUserLiked(req.userId, recipeId);
    return { liked };
  }
}
