import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from './follow.schema';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { User, UserSchema } from 'src/users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [FollowService],
  controllers: [FollowController],
  exports: [FollowService],
})
export class FollowModule {}
