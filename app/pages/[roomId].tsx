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
import useLobbyEvents from "../hooks/useLobbyEvents";
import useRoomEvents from "../hooks/useRoomEvents";
import { useGetRoomDetail } from "../hooks/useGetRoomDetail";
import Guest from "../components/Guest";
import { useMeetingMachineContext } from "../providers/MeetingMachineProvider";

const RoomId = () => {
  const router = useRouter();
  const { state } = useMeetingMachine();
  const { joinRoom, leaveRoom, isRoomJoined } = useRoom();
  const {
    fetchVideoStream,
    stopVideoStream,
    isLoading: fetchVideoIsLoading,
    produceVideo,
    stopProducingVideo,
    stream: camStream,
  } = useVideo();
  const { peers } = usePeers();
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    camOn,
    micOn,
    isHost,
    isGuest,
    getRoomDetailIsLoading,
    joinLobbyIsLoading,
  } = useLobbyEvents(videoRef, camStream);

  useRoomEvents({ produceVideo, camStream });

  const toggleCam = () => {
    if (camOn) {
      stopVideoStream();
    } else {
      fetchVideoStream();
    }
  };

  const handleJoinRoom = () => {
    joinRoom();
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    router.push("/");
  };

  const handleProduceVideo = () => {
    produceVideo(camStream);
  };

  const handleStopProduceVideo = () => {
    stopProducingVideo();
  };

  if (joinLobbyIsLoading || getRoomDetailIsLoading) return <>Loading...</>;

  return (
    <>
      {isHost && (
        <Row>
          <Col xs="8">
            <div>
              <video
                ref={videoRef}
                autoPlay
                poster="https://placehold.co/600x400"
                width={"100%"}
              />
            </div>
            <Row className="justify-content-center">
              <Col xs="auto">
                <Button
                  variant={!camOn ? "outline-primary" : "outline-danger"}
                  onClick={toggleCam}
                  disabled={
                    !fetchVideoStream.isCallable && !stopVideoStream.isCallable
                  }
                >
                  {!camOn ? (
                    <i className="bi bi-camera-video-fill"></i>
                  ) : (
                    <i className="bi bi-camera-video-off-fill"></i>
                  )}
                </Button>
              </Col>
              <Col xs="auto">
                <Button variant={!micOn ? "outline-primary" : "outline-danger"}>
                  {!micOn ? (
                    <i className="bi bi-mic-fill"></i>
                  ) : (
                    <i className="bi bi-mic-mute-fill"></i>
                  )}
                </Button>
              </Col>
            </Row>
          </Col>
          <Col xs="4">
            <Stack gap={2} className="mx-auto">
              <Button onClick={() => handleJoinRoom()}>JoinRoom</Button>
              <Button onClick={() => handleLeaveRoom()}>LeaveRoom</Button>
              <Button onClick={() => handleProduceVideo()}>ProduceVideo</Button>
              <Button onClick={() => handleStopProduceVideo()}>
                StopProduceVideo
              </Button>
            </Stack>
          </Col>
        </Row>
      )}
      {isGuest && isRoomJoined && (
        <>
          <Guest />
        </>
      )}
    </>
  );
};

export default RoomId;
