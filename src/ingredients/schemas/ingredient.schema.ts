import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IngredientStatus = 'pending' | 'approved' | 'rejected';

@Schema({ timestamps: true })
export class Ingredient extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ trim: true })
  imageUrl: string;

  @Prop({ type: String, required: false })
  owner?: string;

  @Prop({ type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: IngredientStatus;

  @Prop()
  reviewComment?: string;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient); 