import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RecipeIngredient } from 'src/recipe-ingredient/recipe-ingredient.schema';

export type RecipeDocument = Recipe & Document;

@Schema({ timestamps: true })
export class Recipe {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  portions: number;

  @Prop({ required: true })
  minutes: number;

  @Prop({ required: true })
  dificulty: number;

  @Prop({ required: true })
  process: string;

  @Prop()
  url: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: RecipeIngredient.name }] })
  ingredients: Types.ObjectId[];
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
