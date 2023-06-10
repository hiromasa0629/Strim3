import { useEventListener } from "@huddle01/react";
import {
  useLobby,
  useMeetingMachine,
  usePeers,
  useRoom,
  useVideo,
} from "@huddle01/react/hooks";
import { Video } from "@huddle01/react/components";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Row, Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import VideoJS from "../components/VideoJS";
import useRoomEvents from "../hooks/useRoomEvents";
import { useGetRoomDetail } from "../hooks/useGetRoomDetail";
import Guest from "../components/Guest";
import { useMeetingMachineContext } from "../providers/MeetingMachineProvider";
import Host from "../components/Host";

const RoomId = () => {
  const router = useRouter();
  const { roomId } = router.query;

  const { getRoomDetail, getRoomDetailIsLoading, isHost, isGuest } =
    useGetRoomDetail();

  useEffect(() => {
    if (router.isReady) {
      getRoomDetail(roomId as string);
    }
  }, [router.isReady]);

  if (getRoomDetailIsLoading) return <>Loading...</>;

  return (
    <>
      {isHost && <Host roomId={roomId as string} />}
      {isGuest && <Guest roomId={roomId as string} />}
    </>
  );
};

export default RoomId;
