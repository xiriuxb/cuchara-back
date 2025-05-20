import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { Recipe, RecipeSchema } from './recipe.schema';
import {
  RecipeIngredient,
  RecipeIngredientSchema,
} from '../recipe-ingredient/recipe-ingredient.schema';
import {
  Ingredient,
  IngredientSchema,
} from '../ingredients/ingredients.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { IngredientsModule } from 'src/ingredients/ingredients.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recipe.name, schema: RecipeSchema },
      { name: RecipeIngredient.name, schema: RecipeIngredientSchema },
      { name: Ingredient.name, schema: IngredientSchema },
    ]),
    CloudinaryModule,
    IngredientsModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
