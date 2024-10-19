import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { MarkService } from './mark.service';
import { MessagePattern } from '@nestjs/microservices';
import { MarkUpdateInterface } from 'src/interfaces/mark.interface';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('mark')
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  @CacheKey('cars')
  @CacheTTL(60000)
  @Get()
  async getAll() {
    return this.markService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.markService.getById(id);
  }

  @MessagePattern('create_mark')
  async newMark(data: any) {
    console.log(data);
    return this.markService.newMark(data);
  }

  @MessagePattern('update_mark')
  async updateMark(data: MarkUpdateInterface) {
    return this.markService.update(data);
  }

  @MessagePattern('delete_mark')
  async deleteMark(id: number) {
    return this.markService.delete(id);
  }
}
