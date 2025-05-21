import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

// Like.schema.ts
@Schema({ timestamps: true })
export class Like {
  @Prop({ required: true })
  clerkId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true })
  recipe: Types.ObjectId;
}

export type LikeDocument = Like & Document;
export const LikeSchema = SchemaFactory.createForClass(Like);
