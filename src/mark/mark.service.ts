import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CarService } from 'src/car/car.service';
import { MarkUpdateInterface } from 'src/interfaces/mark.interface';
import { Mark } from 'src/schemas/mark.schema';

@Injectable()
export class MarkService {
  constructor(
    @InjectModel(Mark.name) private mark: Model<Mark>,
    @Inject(forwardRef(() => CarService)) private readonly car: CarService,
  ) {}

  async newMark(data: any): Promise<void> {
    console.log(data);
    const mark = await this.mark.create({
      title: data.title,
      originId: data.originId,
    });

    await mark.save();
  }

  async getAll() {
    return this.mark.find().exec();
  }

  async delete(originId: number) {
    await this.mark.findOneAndDelete({ originId });
  }

  async update(dto: MarkUpdateInterface) {
    await this.mark.findOneAndUpdate(
      { originId: dto.originId },
      { title: dto.title },
    );
  }

  async getById(id: number) {
    const mark = await this.mark.findOne({ _id: id }).populate('cars');

    if (!mark) throw new NotFoundException('Mark is not defined');
    return mark;
  }

  async getById2(id: number) {
    const mark = await this.mark.findOne({ originId: id }).populate('cars');

    if (!mark) throw new NotFoundException('Mark is not defined');
    return mark;
  }

  async pushToCars(originId: number, carId: string) {
    const car = await this.car.getById(carId);
    const mark = await this.getById2(originId);

    mark.cars.push(car.id);
    await mark.save();
  }
  async unPush(id: number, carId: string) {
    const mark = await this.getById(id);
    const thisCar = await this.car.getById(carId);

    const carIndex = mark.cars.findIndex((car) => car.title === thisCar.title);

    if (carIndex === -1) {
      throw new NotFoundException('Car not associated with this mark');
    }

    mark.cars.splice(carIndex, 1);
    await mark.save();
  }
}
