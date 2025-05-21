import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UploadService } from '../cloudinary/upload.service';
import { IngredientsService } from 'src/ingredients/ingredients.service';

import { ParsedCreateRecipeDto } from './dto/recipe-create.dto';
import { Recipe, RecipeDocument } from './recipe.schema';
import {
  RecipeIngredient,
  RecipeIngredientDocument,
} from 'src/recipe-ingredient/recipe-ingredient.schema';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    @InjectModel(RecipeIngredient.name)
    private recipeIngredientModel: Model<RecipeIngredientDocument>,
    private ingredientsService: IngredientsService,
    private uploadService: UploadService,
  ) {}

  async createRecipe(
    data: ParsedCreateRecipeDto,
    userId: string,
  ): Promise<RecipeDocument> {
    let imageUrl = '';
    if (data.image) {
      const uploadResult = await this.uploadService.uploadFile(data.image);
      imageUrl = uploadResult.secure_url;
    }

    const recipe = new this.recipeModel({
      name: data.name,
      description: data.description,
      portions: data.portions,
      minutes: data.minutes,
      dificulty: data.dificulty,
      process: data.process,
      url: imageUrl,
      createdBy: userId,
    });

    await recipe.save();

    const recipeIngredientIds: Types.ObjectId[] = [];

    for (const ing of data.ingredients) {
      let ingredient;
      if (ing.id) {
        ingredient = await this.ingredientsService.selectExistingIngredient(
          ing.id,
        );
      } else if (ing.name) {
        ingredient = await this.ingredientsService.createCustomOrReturnExistent(
          { name: ing.name },
          userId,
        );
      } else {
        throw new Error('Ingrediente inválido: debe tener id o name');
      }

      const recipeIngredient = await new this.recipeIngredientModel({
        recipeId: recipe._id,
        ingredientId: ingredient._id,
        quantity: ing.quantity,
        unit: ing.unit,
      }).save();

      recipeIngredientIds.push(recipeIngredient._id as Types.ObjectId);
    }

    recipe.ingredients = recipeIngredientIds;
    await recipe.save();

    return recipe;
  }

  async findAll() {
    return this.recipeModel.find().exec();
  }

  async findOne(id: string) {
    const pipeline = [
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: 'clerkId',
          as: 'userData',
        },
      },
      {
        $lookup: {
          from: 'recipeingredients',
          localField: '_id',
          foreignField: 'recipeId',
          as: 'recipeIngredients',
        },
      },
      {
        $lookup: {
          from: 'ingredients',
          localField: 'recipeIngredients.ingredientId',
          foreignField: '_id',
          as: 'ingredientsData',
        },
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'recipe',
          as: 'likes',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          portions: 1,
          minutes: 1,
          dificulty: 1,
          process: 1,
          url: 1,
          createdAt: 1,
          updatedAt: 1,
          username: { $arrayElemAt: ['$userData.username', 0] },
          likesCount: { $size: '$likes' },
          ingredients: {
            $map: {
              input: '$recipeIngredients',
              as: 'ri',
              in: {
                $mergeObjects: [
                  '$$ri',
                  {
                    ingredient: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$ingredientsData',
                            as: 'ing',
                            cond: { $eq: ['$$ing._id', '$$ri.ingredientId'] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ];

    const [recipe] = await this.recipeModel.aggregate(pipeline).exec();
    return recipe;
  }

  async update(id: string, updateRecipeDto: any) {
    return this.recipeModel
      .findByIdAndUpdate(id, updateRecipeDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.recipeModel.findByIdAndDelete(id).exec();
  }

  private getPaginationPipeline(limit: number, cursorId?: string) {
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

    return pipeline;
  }

  private getBasicProjection() {
    return [
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'recipe',
          as: 'likes',
        },
      },
      {
        $addFields: {
          likesCount: { $size: '$likes' },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          url: 1,
          likesCount: 1,
        },
      },
    ];
  }

  async getRecipesByUser(clerkId: string, limit = 10, cursorId?: string) {
    const pipeline: any[] = [
      {
        $match: {
          createdBy: clerkId,
        },
      },
      ...this.getPaginationPipeline(limit, cursorId),
      ...this.getBasicProjection(),
    ];

    const recipes = await this.recipeModel.aggregate(pipeline).exec();

    return {
      data: recipes,
      nextCursor: recipes.length > 0 ? recipes[recipes.length - 1]._id : null,
    };
  }

  async getRecipesByUsername(username: string, limit = 10, cursorId?: string) {
    const pipeline: any[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: 'clerkId',
          as: 'userData',
        },
      },
      {
        $match: {
          'userData.username': username,
        },
      },
      ...this.getPaginationPipeline(limit, cursorId),
      ...this.getBasicProjection(),
    ];

    const recipes = await this.recipeModel.aggregate(pipeline).exec();

    return {
      data: recipes,
      nextCursor: recipes.length > 0 ? recipes[recipes.length - 1]._id : null,
    };
  }
}
