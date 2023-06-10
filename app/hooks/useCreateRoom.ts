import { useMutation, useQuery } from "react-query";
import { roomsService } from "../api/roomsService";
import { useState } from "react";
import { toast } from "react-toastify";

export const useCreateRoom = (address: `0x${string}`) => {
  const [roomId, setRoomId] = useState<string>();

  const {
    mutate: createRoom,
    isLoading: createRoomIsLoading,
    isSuccess: createRoomIsSuccess,
  } = useMutation({
    mutationKey: ["createRoom"],
    mutationFn: (address: `0x${string}`) => roomsService.createRoom(address),
    onSuccess: (res) => {
      setRoomId(res.roomId);
      toast.success("Created room");
    },
    onError: (error) => {
      toast.error("Create room failed");
    },
  });

  return {
    roomId,
    createRoom,
    createRoomIsLoading,
    createRoomIsSuccess,
  };
};
