import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: 'https://api.huddle01.com/api/v1/',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': configService.get('HUDDLE01_API_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}
