import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './like.schema';
import { Model } from 'mongoose';

@Injectable()
export class LikesService {
  constructor(@InjectModel(Like.name) private likeModel: Model<LikeDocument>) {}

  async toggleLike(
    clerkId: string,
    recipeId: string,
  ): Promise<{ liked: boolean }> {
    const existing = await this.likeModel.findOne({
      clerkId,
      recipe: recipeId,
    });

    if (existing) {
      await this.likeModel.deleteOne({ _id: existing._id });
      return { liked: false };
    }

    await this.likeModel.create({ clerkId, recipe: recipeId });
    return { liked: true };
  }

  async countLikes(recipeId: string): Promise<number> {
    return this.likeModel.countDocuments({ recipe: recipeId });
  }

  async hasUserLiked(userId: string, recipeId: string): Promise<boolean> {
    return !!(await this.likeModel.exists({
      clerkId: userId,
      recipe: recipeId,
    }));
  }
}
