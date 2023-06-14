import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  address: `0x${string}`;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  desc: string;
}

export class JoinRoomDto {
  @IsNotEmpty()
  roomId: string;

  @IsNotEmpty()
  displayName: string;

  @IsNotEmpty()
  address: `0x${string}`;
}

export class LeaveRoomDto {
  @IsNotEmpty()
  address: `0x${string}`;

  @IsNotEmpty()
  roomId: string;
}
