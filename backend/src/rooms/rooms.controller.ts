import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, JoinRoomDto, LeaveRoomDto } from './rooms.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get(':roomId')
  async get(@Param('roomId') roomId: string) {
    const data = await this.roomsService.getRoomDetail(roomId);
    return data;
  }

  @Post()
  async create(@Body() body: CreateRoomDto) {
    const data = await this.roomsService.create(body);
    return data;
  }

  @Post('join')
  async join(@Body() body: JoinRoomDto) {
    const data = await this.roomsService.join(body);
    return data;
  }

  @Post('leave')
  async leave(@Body() body: LeaveRoomDto) {
    const data = await this.roomsService.leave(body);
    return data;
  }
}
