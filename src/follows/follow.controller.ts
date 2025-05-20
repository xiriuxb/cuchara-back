import { Controller, Post, Body, Get, Param, Request } from '@nestjs/common';
import { FollowService } from './follow.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  async createFollow(
    @Request() req,
    @Body() body: { followerId: string; followingId: string },
  ) {
    return this.followService.toggleFollow(req.userId!, body.followingId);
  }

  @Get('followers/:userId')
  async getFollowers(@Param('userId') userId: string) {
    return this.followService.findFollowers(userId);
  }

  @Get('following/:userId')
  async getFollowing(@Param('userId') userId: string) {
    return this.followService.findFollowing(userId);
  }

  @Get('is-following/:targetId')
  @ApiOperation({ summary: 'Verificar si sigues a un usuario' })
  async isFollowing(@Request() req, @Param('targetId') targetId: string) {
    return await this.followService.isFollowing(req.userId, targetId);
  }
}
