import { forwardRef, Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { Car, carSchema } from '../schemas/car.schema';
import { MarkModule } from 'src/mark/mark.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => MarkModule),
    MongooseModule.forFeature([{ name: Car.name, schema: carSchema }]),
  ],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}
