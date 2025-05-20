import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Follow, FollowDocument } from './follow.schema';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async toggleFollow(currentClerkId: string, targetMongoId: string) {
    const currentUser = await this.userModel.findOne({
      clerkId: currentClerkId,
    });
    if (!currentUser) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const currentUserId = new Types.ObjectId(currentUser._id.toString());
    const targetUserId = new Types.ObjectId(targetMongoId);

    if (currentUserId.equals(targetUserId)) {
      throw new BadRequestException('No puedes seguirte a ti mismo');
    }

    const existing = await this.followModel.findOne({
      follower: currentUserId,
      following: targetUserId,
    });

    if (existing) {
      await this.followModel.deleteOne({ _id: existing._id });
      return { followed: false };
    }

    await this.followModel.create({
      follower: currentUserId,
      following: targetUserId,
      clerkId: currentClerkId,
    });

    return { followed: true };
  }

  async findFollowers(userId: string): Promise<Follow[]> {
    return this.followModel
      .find({ following: userId })
      .populate('follower')
      .exec();
  }

  async findFollowing(userId: string): Promise<Follow[]> {
    return this.followModel
      .find({ follower: userId })
      .populate('following')
      .exec();
  }

  async isFollowing(
    currentClerkId: string,
    targetMongoId: string,
  ): Promise<{ followed: boolean }> {
    const follow = await this.followModel.findOne({
      clerkId: currentClerkId,
      following: new Types.ObjectId(targetMongoId),
    });

    return { followed: !!follow };
  }
}
