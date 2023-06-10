import { useEventListener } from "@huddle01/react";
import { useLobby, useRoom } from "@huddle01/react/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetRoomDetail } from "./useGetRoomDetail";

const useLobbyEvents = (
  videoRef: React.RefObject<HTMLVideoElement>,
  camStream: MediaStream
) => {
  const [camOn, setCamOn] = useState<boolean>(false);
  const [micOn, setMicOn] = useState<boolean>(false);
  const { joinRoom } = useRoom();
  const { joinLobby, isLoading: joinLobbyIsLoading } = useLobby();
  const { isHost, isGuest, getRoomDetail, getRoomDetailIsLoading } =
    useGetRoomDetail();
  const router = useRouter();
  const { roomId } = router.query;

  useEffect(() => {
    if (router.isReady) {
      joinLobby(roomId as string);
      getRoomDetail(roomId as string);
    }
  }, [router.isReady]);

  useEventListener("lobby:joined", () => {
    toast.success("Joined lobby");
    if (isGuest) joinRoom();
  });

  useEventListener("lobby:failed", () => {
    toast.error("Lobby join failed");
  });

  useEventListener("lobby:cam-on", () => {
    setCamOn(true);
    if (videoRef.current) videoRef.current.srcObject = camStream;
  });

  useEventListener("lobby:cam-off", () => {
    setCamOn(false);
    if (videoRef.current) videoRef.current.srcObject = null;
  });

  // TODO: Add mic

  useEventListener("lobby:mic-on", () => {});
  useEventListener("lobby:mic-off", () => {});

  return {
    camOn,
    micOn,
    isHost,
    isGuest,
    joinLobbyIsLoading,
    getRoomDetailIsLoading,
  };
};

export default useLobbyEvents;
