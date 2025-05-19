import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IngredientDocument = Ingredient & Document;

@Schema({ timestamps: true })
export class Ingredient {
  @Prop({ required: true, trim: true, lowercase: true })
  name: string;

  @Prop({ type: String, default: null })
  createdByUserId: string | null;

  @Prop({ default: false })
  isVerified: boolean;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
