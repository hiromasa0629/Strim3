import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Row, Stack } from "react-bootstrap";
import { useLobby, useRoom, useVideo } from "@huddle01/react/hooks";
import { useEventListener } from "@huddle01/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import useRoomEvents from "../hooks/useRoomEvents";

interface HostProps {
  roomId: string;
}

const Host = (props: HostProps) => {
  const { roomId } = props;
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [camOn, setCamOn] = useState<boolean>(false);
  const [micOn, setMicOn] = useState<boolean>(false);
  const { joinLobby, isLoading: joinLobbyIsLoading } = useLobby();
  const { joinRoom, leaveRoom } = useRoom();
  const {
    fetchVideoStream,
    stopVideoStream,
    produceVideo,
    stopProducingVideo,
    stream: camStream,
  } = useVideo();

  useEffect(() => {
    if (router.isReady) {
      joinLobby(roomId as string);
    }
  }, [router.isReady]);

  useEventListener("lobby:joined", () => toast.success("Joined lobby"));
  useEventListener("lobby:failed", () => toast.error("Lobby join failed"));
  // TODO: Add mic
  useEventListener("lobby:mic-on", () => {});
  useEventListener("lobby:mic-off", () => {});
  useEventListener("lobby:cam-on", () => {
    setCamOn(true);
    if (videoRef.current) videoRef.current.srcObject = camStream;
  });
  useEventListener("lobby:cam-off", () => {
    setCamOn(false);
    if (videoRef.current) videoRef.current.srcObject = null;
  });
  useRoomEvents();

  const toggleCam = () => {
    if (camOn) stopVideoStream();
    else fetchVideoStream();
  };

  const handleJoinRoom = () => joinRoom.isCallable && joinRoom();
  const handleLeaveRoom = () => {
    if (leaveRoom.isCallable) {
      leaveRoom();
      router.push("/");
    }
  };
  const handleProduceVideo = () =>
    produceVideo.isCallable && produceVideo(camStream);
  const handleStopProduceVideo = () =>
    stopProducingVideo.isCallable && stopProducingVideo();

  if (joinLobbyIsLoading) return <>Loading...</>;

  return (
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
  );
};

export default Host;
