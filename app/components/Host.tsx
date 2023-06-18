import React, { useEffect, useRef, useState } from "react";
// import { Button, Col, Row, Stack } from "react-bootstrap";
import { Button, Card, Col, List, Row, Space, Typography, message } from "antd";
import {
  useAudio,
  useLobby,
  usePeers,
  useRoom,
  useVideo,
} from "@huddle01/react/hooks";
import { useEventListener } from "@huddle01/react";
import { useRouter } from "next/router";
import useRoomEvents from "../hooks/useRoomEvents";
import {
  MeetingMachineStatus,
  useMeetingMachineContext,
} from "../providers/MeetingMachineProvider";
import { ProCard } from "@ant-design/pro-components";
import { RoomDetial } from "../api/roomsService";
import Chat from "./Chat";
import Peers from "./Peers";
import useMediaRecording from "../hooks/useMedaiRecording";

interface HostProps {
  roomId: string;
  roomDetail: RoomDetial;
}

const Host = (props: HostProps) => {
  const { roomId, roomDetail } = props;
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [camOn, setCamOn] = useState<boolean>(false);
  const [micOn, setMicOn] = useState<boolean>(false);
  const { joinLobby, isLoading: joinLobbyIsLoading, leaveLobby } = useLobby();
  const { startRecord, stopRecord, isReadyToDownload, downloadVideo, blobUrl } =
    useMediaRecording(messageApi);
  const { joinRoom, leaveRoom } = useRoom();
  const {
    fetchVideoStream,
    stopVideoStream,
    produceVideo,
    stopProducingVideo,
    stream: camStream,
    isProducing: isCamProducing,
  } = useVideo();
  const {
    fetchAudioStream,
    stopAudioStream,
    produceAudio,
    stopProducingAudio,
    stream: micStream,
    isProducing: isMicProducing,
  } = useAudio();
  const { status } = useMeetingMachineContext();
  const { Text, Paragraph } = Typography;

  useEffect(() => {
    if (router.isReady) {
      joinLobby(roomId as string);
    }
  }, [router.isReady]);

  useEventListener("lobby:joined", () => messageApi.success("Joined lobby"));
  useEventListener("lobby:failed", () => messageApi.error("Lobby join failed"));
  // TODO: Add mic
  useEventListener("lobby:mic-on", () => setMicOn(true));
  useEventListener("lobby:mic-off", () => setMicOn(false));
  useEventListener("lobby:cam-on", () => {
    setCamOn(true);
    if (videoRef.current) videoRef.current.srcObject = camStream;
  });
  useEventListener("lobby:cam-off", () => {
    setCamOn(false);
    if (videoRef.current) videoRef.current.srcObject = null;
  });
  useRoomEvents(messageApi);

  const toggleCam = () => {
    if (camOn) stopVideoStream();
    else fetchVideoStream();
  };

  const toggleMic = () => {
    if (micOn) stopAudioStream();
    else fetchAudioStream();
  };

  const startProduce = () => {
    produceVideo(camStream);
    produceAudio(micStream);
    startRecord(true, camStream, micStream);
  };

  const finishStream = () => {
    stopProducingAudio();
    stopProducingVideo();
    stopRecord();
  };

  const handleJoinRoom = () => joinRoom.isCallable && joinRoom();
  const handleLeaveRoom = () => {
    leaveRoom();
    router.push("/");
  };

  if (joinLobbyIsLoading) return <>Loading...</>;

  return (
    <>
      {contextHolder}

      <Row gutter={16}>
        <Col xs={16}>
          <Card title={roomDetail.title}>
            <Space direction="vertical" className="w-100">
              <Card bordered>
                <Space className="w-100" direction="vertical">
                  <video
                    ref={videoRef}
                    autoPlay
                    poster="https://placehold.co/600x400"
                    width={"100%"}
                  />
                  <Paragraph>{roomDetail.description}</Paragraph>
                </Space>
              </Card>
              <Space
                direction="horizontal"
                className="w-100 justify-content-center"
              >
                <Button
                  danger={camOn}
                  onClick={toggleCam}
                  disabled={
                    (!fetchVideoStream.isCallable &&
                      !stopVideoStream.isCallable) ||
                    status !== MeetingMachineStatus.JoinedLobby
                  }
                >
                  {!camOn ? (
                    <i className="bi bi-camera-video-fill"></i>
                  ) : (
                    <i className="bi bi-camera-video-off-fill"></i>
                  )}
                </Button>
                <Button
                  danger={micOn}
                  onClick={toggleMic}
                  disabled={
                    (!fetchAudioStream.isCallable &&
                      !stopAudioStream.isCallable) ||
                    status !== MeetingMachineStatus.JoinedLobby
                  }
                >
                  {!micOn ? (
                    <i className="bi bi-mic-fill"></i>
                  ) : (
                    <i className="bi bi-mic-mute-fill"></i>
                  )}
                </Button>
                <Button
                  onClick={() => startProduce()}
                  disabled={
                    !camOn ||
                    status !== MeetingMachineStatus.JoinedRoom ||
                    (isCamProducing && isMicProducing)
                  }
                >
                  Start
                </Button>
                <Button
                  onClick={() => finishStream()}
                  disabled={status !== MeetingMachineStatus.JoinedRoom}
                  danger
                >
                  Finish
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={8}>
          {
            <ProCard title="Action">
              <ProCard bordered tabs={{ type: "card" }}>
                {status === MeetingMachineStatus.JoinedLobby ? (
                  <ProCard.TabPane key="start" tab="Start">
                    <Space
                      className="w-100 justify-content-center"
                      direction="vertical"
                      align="center"
                    >
                      <Button onClick={() => handleJoinRoom()}>JoinRoom</Button>
                    </Space>
                  </ProCard.TabPane>
                ) : (
                  <>
                    <ProCard.TabPane key="chat" tab="Chat">
                      <Chat />
                    </ProCard.TabPane>
                    <ProCard.TabPane key="peers" tab="Peers">
                      <Peers />
                    </ProCard.TabPane>
                    <ProCard.TabPane key="Mint" tab="Mint">
                      <Space
                        direction="vertical"
                        className="w-100 justify-content-center"
                        align="center"
                      >
                        <video src={blobUrl} controls className="w-100" />
                        <Button
                          onClick={() => downloadVideo()}
                          disabled={!isReadyToDownload}
                        >
                          Mint
                        </Button>
                      </Space>
                    </ProCard.TabPane>
                  </>
                )}
              </ProCard>
            </ProCard>
          }
        </Col>
      </Row>
    </>
  );
};

export default Host;
