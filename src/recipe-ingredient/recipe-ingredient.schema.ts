import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RecipeIngredientDocument = RecipeIngredient & Document;

@Schema()
export class RecipeIngredient {
  @Prop({ type: Types.ObjectId, ref: 'Recipe', required: true })
  recipeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Ingredient', required: true })
  ingredientId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unit: number;
}

export const RecipeIngredientSchema = SchemaFactory.createForClass(RecipeIngredient);
