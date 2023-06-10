import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateRoomDto, JoinRoomDto, LeaveRoomDto } from './rooms.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface RoomDetial {
  roomId: string;
  title: string;
  description: string;
  meetingLink: string;
  startTime: string;
  expiryTime: string;
  videoOnEntry: boolean;
  muteOnEntry: boolean;
  roomLocked: boolean;
  hostWalletAddress: string[];
}

@Injectable()
export class RoomsService {
  private rooms = new Map<string, RoomDetial>();
  private readonly logger = new Logger(RoomsService.name);
  constructor(private readonly http: HttpService) {}

  async getRoomDetail(roomId: string): Promise<any> {
    if (!this.rooms.has(roomId))
      throw new HttpException('RoomId Not Found', HttpStatus.NOT_FOUND);
    return this.rooms.get(roomId);
  }

  async create(body: CreateRoomDto): Promise<any> {
    const { data } = await firstValueFrom(
      this.http.post('create-room', {
        title: 'Huddle01-Test',
        hostWallets: [body.address],
      }),
    ).catch((error: AxiosError) => {
      throw new HttpException(error.response.data, error.response.status);
    });

    const { roomId } = data.data;

    const { data: detail } = await firstValueFrom(
      this.http.get(`meeting-details/${roomId}`),
    ).catch((error: AxiosError) => {
      throw new HttpException(error.response.data, error.response.status);
    });

    this.rooms.set(roomId, detail);

    return detail;
  }

  async join(body: JoinRoomDto): Promise<any> {
    if (!this.rooms.has(body.roomId))
      throw new HttpException('RoomId Not NotFoundError', HttpStatus.NOT_FOUND);
    const hosts = this.rooms.get(body.roomId).hostWalletAddress;

    const { data } = await firstValueFrom(
      this.http.post('join-room-token', {
        roomId: body.roomId,
        userType: hosts.indexOf(body.address) === -1 ? 'guest' : 'host',
        displayName: body.displayName,
      }),
    );

    return data;
  }

  async leave(body: LeaveRoomDto): Promise<any> {
    if (!this.rooms.has(body.roomId))
      throw new HttpException('RoomId Not NotFoundError', HttpStatus.NOT_FOUND);
    const hosts = this.rooms.get(body.roomId).hostWalletAddress;

    if (hosts.indexOf(body.address)) this.rooms.delete(body.roomId);
    return true;
  }
}
