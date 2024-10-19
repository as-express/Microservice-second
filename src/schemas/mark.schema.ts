import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Car } from './car.schema';

export type MarkDocument = Mark & Document;

@Schema()
export class Mark {
  @Prop()
  originId: number;

  @Prop()
  title: string;

  @Prop({ default: 0 })
  markRating: number;

  @Prop({ default: 0 })
  usersRating: number[];

  @Prop({ default: 0 })
  carsCount: number;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }])
  cars: Car[];
}

export const markSchema = SchemaFactory.createForClass(Mark);
