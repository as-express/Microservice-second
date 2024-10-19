import { Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { CarService } from './car.service';
import { CarInterface, CarUpdateInterface } from 'src/interfaces/car.interface';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('car')
export class CarController {
  constructor(
    private readonly carService: CarService,
    private httpService: HttpService,
  ) {}

  @CacheKey('cars')
  @CacheTTL(60000)
  @Get()
  async getAll() {
    return this.carService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.carService.getById(id);
  }

  @Post(':id/like')
  async likeCar(@Param('id') id: string) {
    const car = await this.carService.like(id);
    const originId = car.originId;

    await this.httpService
      .post(`http://localhost:8000/api/car/${originId}/like`, null)
      .toPromise();

    return car;
  }

  @EventPattern('create_car')
  async newCar(car: CarInterface) {
    return this.carService.new(car);
  }

  @EventPattern('update_car')
  async updateCar(id: number, car: CarUpdateInterface) {
    return this.carService.update(id, car);
  }

  @EventPattern('delete_car')
  async deleteCar(id: number) {
    return this.carService.delete(id);
  }
}
