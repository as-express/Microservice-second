import { forwardRef, Module } from '@nestjs/common';
import { MarkService } from './mark.service';
import { MarkController } from './mark.controller';
import { CarModule } from 'src/car/car.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Mark, markSchema } from 'src/schemas/mark.schema';

@Module({
  imports: [
    forwardRef(() => CarModule),
    MongooseModule.forFeature([{ name: Mark.name, schema: markSchema }]),
  ],
  controllers: [MarkController],
  providers: [MarkService],
  exports: [MarkService],
})
export class MarkModule {}
