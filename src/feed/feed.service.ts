import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Recipe, RecipeDocument } from '../recipe/recipe.schema';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async getFeed(limit = 10, cursorId?: string) {
    const pipeline: any[] = [];

    if (cursorId) {
      pipeline.push({
        $match: {
          _id: { $lt: new Types.ObjectId(cursorId) },
        },
      });
    }

    pipeline.push({ $sort: { _id: -1 } });

    pipeline.push({ $limit: limit });

    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: 'clerkId',
        as: 'userData',
      },
    });

    pipeline.push({
      $addFields: {
        username: { $arrayElemAt: ['$userData.username', 0] },
      },
    });

    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        createdAt: 1,
        url: 1,
        username: { $arrayElemAt: ['$userData.username', 0] },
      },
    });

    const recipes = await this.recipeModel.aggregate(pipeline).exec();

    return {
      data: recipes,
      nextCursor: recipes.length > 0 ? recipes[recipes.length - 1]._id : null,
    };
  }
}
