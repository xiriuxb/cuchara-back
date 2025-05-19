import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UploadService } from '../cloudinary/upload.service';
import { IngredientsService } from 'src/ingredients/ingredients.service';

import { ParsedCreateRecipeDto } from './dto/recipe-create.dto';
import { Recipe, RecipeDocument } from './recipe.schema';
import { RecipeIngredient, RecipeIngredientDocument } from 'src/recipe-ingredient/recipe-ingredient.schema';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    @InjectModel(RecipeIngredient.name) private recipeIngredientModel: Model<RecipeIngredientDocument>,
    private ingredientsService: IngredientsService,
    private uploadService: UploadService,
  ) {}

  async createRecipe(data: ParsedCreateRecipeDto, userId: string): Promise<RecipeDocument> {
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
        ingredient = await this.ingredientsService.selectExistingIngredient(ing.id);
      } else if (ing.name) {
        ingredient = await this.ingredientsService.createCustomOrReturnExistent({name: ing.name}, userId)
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
    return this.recipeModel.findById(id).exec();
  }

  async update(id: string, updateRecipeDto: any) {
    return this.recipeModel.findByIdAndUpdate(id, updateRecipeDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.recipeModel.findByIdAndDelete(id).exec();
  }
}
