import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Mark } from './mark.schema';

export type CarDocument = Car & Document;

@Schema()
export class Car {
  @Prop()
  originId: number;

  @Prop()
  title: string;

  @Prop()
  image: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Mark', required: true })
  mark: Mark;
}

export const carSchema = SchemaFactory.createForClass(Car);
