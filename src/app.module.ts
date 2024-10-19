import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarModule } from './car/car.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MarkModule } from './mark/mark.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CarModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST, // Use the environment variable
            port: +process.env.REDIS_PORT, // Convert port to number
          },
        }),
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MarkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
