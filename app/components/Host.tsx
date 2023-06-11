import React, { useEffect, useRef, useState } from "react";
// import { Button, Col, Row, Stack } from "react-bootstrap";
import { Button, Card, Col, List, Row, Space, Typography, message } from "antd";
import { useLobby, usePeers, useRoom, useVideo } from "@huddle01/react/hooks";
import { useEventListener } from "@huddle01/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import useRoomEvents from "../hooks/useRoomEvents";
import {
  MeetingMachineStatus,
  useMeetingMachineContext,
} from "../providers/MeetingMachineProvider";
import { ProCard } from "@ant-design/pro-components";

interface HostProps {
  roomId: string;
}

const Host = (props: HostProps) => {
  const { roomId } = props;
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [camOn, setCamOn] = useState<boolean>(false);
  const [micOn, setMicOn] = useState<boolean>(false);
  const { joinLobby, isLoading: joinLobbyIsLoading, leaveLobby } = useLobby();
  const { joinRoom, leaveRoom } = useRoom();
  const {
    fetchVideoStream,
    stopVideoStream,
    produceVideo,
    stopProducingVideo,
    stream: camStream,
    isProducing,
  } = useVideo();
  const { status } = useMeetingMachineContext();
  const { peers } = usePeers();
  const { Text } = Typography;

  useEffect(() => {
    if (router.isReady) {
      joinLobby(roomId as string);
    }
  }, [router.isReady]);

  useEventListener("lobby:joined", () => messageApi.success("Joined lobby"));
  useEventListener("lobby:failed", () => messageApi.error("Lobby join failed"));
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
  useRoomEvents(messageApi);

  const toggleCam = () => {
    if (camOn) stopVideoStream();
    else fetchVideoStream();
  };

  const toggleProduceVideo = () => {
    if (isProducing) stopProducingVideo();
    else produceVideo(camStream);
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
          <Card title="Video">
            <Space direction="vertical" className="w-100">
              <Card bordered>
                <video
                  ref={videoRef}
                  autoPlay
                  poster="https://placehold.co/600x400"
                  width={"100%"}
                />
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
                <Button danger={micOn}>
                  {!micOn ? (
                    <i className="bi bi-mic-fill"></i>
                  ) : (
                    <i className="bi bi-mic-mute-fill"></i>
                  )}
                </Button>
                <Button
                  onClick={() => toggleProduceVideo()}
                  disabled={
                    !camOn || status !== MeetingMachineStatus.JoinedRoom
                  }
                  danger={isProducing}
                >
                  {!isProducing ? (
                    <i className="bi bi-play-fill"></i>
                  ) : (
                    <i className="bi bi-stop-fill"></i>
                  )}
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
                      <Space
                        className="w-100 justify-content-center"
                        direction="vertical"
                        align="center"
                      >
                        Hello world
                      </Space>
                    </ProCard.TabPane>
                    <ProCard.TabPane key="peers" tab="Peers">
                      <Space
                        className="w-100 justify-content-center"
                        direction="vertical"
                        align="center"
                      >
                        <List
                          bordered
                          dataSource={Object.values(peers)}
                          className="w-100"
                          renderItem={(peer) => (
                            <List.Item>
                              <Row className="justify-content-between">
                                <Col xs={12}>
                                  <Text ellipsis>{peer.peerId}</Text>
                                </Col>
                                <Col>
                                  <Text>{peer.displayName}</Text>
                                </Col>
                              </Row>
                            </List.Item>
                          )}
                        />
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
