import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car } from '../schemas/car.schema';
import { Model } from 'mongoose';
import { CarInterface, CarUpdateInterface } from 'src/interfaces/car.interface';
import { MarkService } from 'src/mark/mark.service';

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car.name) private car: Model<Car>,
    @Inject(forwardRef(() => MarkService))
    private readonly mark: MarkService,
  ) {}

  async getAll() {
    return this.car.find().exec();
  }

  async getById(id: string) {
    return this.car.findById(id);
  }

  async like(id: string) {
    const car = await this.getById(id);

    car.likes += 1;
    await car.save();

    return car;
  }

  async new(car: CarInterface) {
    // Ensure car.mark is a number
    const mark = await this.mark.getById2(car.mark); // Ensure this is a number

    const newCar = await this.car.create({
      originId: car.originId, // Ensure this is a number
      title: car.title,
      image: car.image,
      likes: car.likes,
      description: car.description,
      mark: mark._id,
    });

    // Use mark.originId instead of car.originId
    await this.mark.pushToCars(mark.originId, newCar.id);

    await newCar.save();
    return newCar;
  }
  async update(originId: number, car: CarUpdateInterface) {
    const updatedCar = await this.car.findOneAndUpdate({ originId }, car);

    await updatedCar.save();
    return updatedCar;
  }

  async delete(originId: number) {
    const car = await this.car.findOne({ originId });
    await this.mark.unPush(car.originId, car.id);

    await this.car.findOneAndDelete({ originId });
  }
}
