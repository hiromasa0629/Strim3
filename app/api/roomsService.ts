import apiClient from "./apiClient";

export interface CreateRoomDto {
  address: `0x${string}`;
  title: string;
  desc: string;
}

export interface RoomDetial {
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

const createRoom = async (data: CreateRoomDto) => {
  const res = await apiClient.post<{ roomId: string }>("rooms", data);
  return res.data;
};

const getRoomDetail = async (roomId: string): Promise<RoomDetial> => {
  const res = await apiClient.get(`rooms/${roomId}`);
  return res.data;
};

export const roomsService = {
  createRoom,
  getRoomDetail,
};
