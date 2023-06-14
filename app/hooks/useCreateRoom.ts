import { useMutation, useQuery } from "react-query";
import { CreateRoomDto, roomsService } from "../api/roomsService";
import { useState } from "react";
import { toast } from "react-toastify";
import { MessageInstance } from "antd/es/message/interface";

export const useCreateRoom = (
  address: `0x${string}`,
  messageApi: MessageInstance
) => {
  const [roomId, setRoomId] = useState<string>();

  const {
    mutate: createRoom,
    isLoading: createRoomIsLoading,
    isSuccess: createRoomIsSuccess,
  } = useMutation({
    mutationKey: ["createRoom"],
    mutationFn: (data: CreateRoomDto) => roomsService.createRoom(data),
    onSuccess: (res) => {
      setRoomId(res.roomId);
      messageApi.success("Created room");
    },
    onError: (error) => {
      messageApi.error("Create room failed");
    },
  });

  return {
    roomId,
    createRoom,
    createRoomIsLoading,
    createRoomIsSuccess,
  };
};
