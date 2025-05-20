import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Recipe, RecipeDocument } from 'src/recipe/recipe.schema';
import { User, UserDocument } from 'src/users/user.schema';
import { Comment, CommentDocument } from './comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async createComment(recipeId: string, clerkId: string, content: string) {
    const user = await this.userModel.findOne({ clerkId });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return await this.commentModel.create({
      recipe: new Types.ObjectId(recipeId),
      author: new Types.ObjectId(user._id.toString()),
      clerkId,
      content,
    });
  }

  async getCommentsForRecipe(recipeId: string) {
    return await this.commentModel
      .find({ recipe: new Types.ObjectId(recipeId) })
      .select('-clerkId')
      .populate('author', 'username imageUrl')
      .sort({ createdAt: -1 });
  }
}
