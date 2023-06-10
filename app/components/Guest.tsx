import { useEventListener } from "@huddle01/react";
import { Video } from "@huddle01/react/components";
import { useLobby, usePeers, useRoom, useVideo } from "@huddle01/react/hooks";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useRoomEvents from "../hooks/useRoomEvents";

interface GuestProps {
  roomId: string;
}

interface HostProps {
  peerId: string;
  role: "host" | "moderator" | "speaker" | "listener" | "peer";
  mic: MediaStreamTrack;
  cam: MediaStreamTrack;
  displayName: string;
}

const Guest = (props: GuestProps) => {
  const { roomId } = props;
  const { peers } = usePeers();
  const { joinLobby, isLoading: joinLobbyIsLoading } = useLobby();
  const { joinRoom, isLoading: joinRoomIsLoading } = useRoom();
  const [host, setHost] = useState<HostProps>();

  useEffect(() => {
    joinLobby(roomId);
  }, []);

  useEventListener("lobby:joined", () => {
    toast.success("Joined lobby");
    joinRoom();
  });
  useEventListener("lobby:failed", () => toast.error("Lobby join failed"));
  useEventListener("room:joined", () => {
    toast.success("Joined room");
    const tmp = Object.values(peers).find((peer) => peer.role === "host");
    if (tmp) setHost(tmp);
  });
  useEventListener("room:failed", () => toast.error("Join room failed"));

  if (joinLobbyIsLoading || joinLobbyIsLoading) return <>Loading...</>;

  return (
    <>
      {host && (
        <Video peerId={host.peerId} track={host.cam} key={host.peerId} debug />
      )}
    </>
  );
};

export default Guest;
