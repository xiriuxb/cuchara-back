import { Controller, Get, Request, Body, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateBioDto } from './dto/update-bio.dto';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get('profile')
  async getUserProfile(@Request() req) {
    return await this._userService.getUserProfile(req.userId!);
  }

  @Patch('bio')
  async updateBio(@Request() req, @Body() updateBioDto: UpdateBioDto) {
    return await this._userService.updateBio(req.userId!, updateBioDto.bio);
  }

  @Get(':username')
  async getUserData(@Param('username') username: string) {
    return await this._userService.getUserData(username);
  }
}
