import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Follow {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  follower: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  following: Types.ObjectId;

  @Prop()
  clerkId: string;
}

export type FollowDocument = Follow & Document;
export const FollowSchema = SchemaFactory.createForClass(Follow);
