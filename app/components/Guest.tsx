import { useEventListener } from "@huddle01/react";
import { Audio, Video } from "@huddle01/react/components";
import {
  useLobby,
  usePeers,
  useRecording,
  useRoom,
  useVideo,
} from "@huddle01/react/hooks";
import { useDisplayName, useRecorder } from "@huddle01/react/app-utils";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useRoomEvents from "../hooks/useRoomEvents";
import {
  Row,
  Button,
  Space,
  message,
  Card,
  Form,
  Input,
  Col,
  Typography,
  List,
} from "antd";
import useMediaRecording from "../hooks/useMedaiRecording";
import { ProCard } from "@ant-design/pro-components";
import { RoomDetial } from "../api/roomsService";
import Chat from "./Chat";
import Peers from "./Peers";
import { useRouter } from "next/router";

interface GuestProps {
  roomId: string;
  roomDetail: RoomDetial;
}

const Guest = (props: GuestProps) => {
  const { roomId, roomDetail } = props;
  const { peers } = usePeers();
  const {
    joinLobby,
    isLoading: joinLobbyIsLoading,
    isLobbyJoined,
  } = useLobby();
  const {
    joinRoom,
    leaveRoom,
    isLoading: joinRoomIsLoading,
    isRoomJoined,
  } = useRoom();
  const { setDisplayName } = useDisplayName();
  const [input, setInput] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const { Paragraph, Text } = Typography;
  const router = useRouter();

  useEffect(() => {
    joinLobby(roomId);
  }, []);

  useEventListener("lobby:joined", () => messageApi.success("Joined lobby"));
  useEventListener("lobby:failed", () => messageApi.error("Lobby join failed"));
  useEventListener("room:joined", () => messageApi.success("Joined room"));
  useEventListener("room:failed", () => messageApi.error("Join room failed"));

  const handleJoinRoom = () => {
    setDisplayName(input);
    joinRoom();
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    router.push("/");
  };

  const {
    startRecord,
    stopRecord,
    isRecording,
    downloadVideo,
    isReadyToDownload,
    blobUrl,
  } = useMediaRecording(messageApi);

  return (
    <>
      {contextHolder}
      {isLobbyJoined && (
        <Card title={`Joining ${roomDetail.title}`}>
          <Card bordered>
            <Space
              className="w-100 justify-content-center"
              direction="vertical"
            >
              <Paragraph>{roomDetail.description}</Paragraph>
              <Form layout="inline">
                <Form.Item name="displayName" label="Display Name">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </Form.Item>
                <Form.Item>
                  <Button onClick={() => handleJoinRoom()}>Join</Button>
                </Form.Item>
              </Form>
            </Space>
          </Card>
        </Card>
      )}
      {isRoomJoined && (
        <Row gutter={16}>
          <Col xs={15}>
            {Object.values(peers)
              .filter((peer) => peer.cam && peer.mic)
              .map((peer) => {
                if (peer.role === "host") {
                  return (
                    <Card title={roomDetail.title}>
                      <Card bordered>
                        <Space direction="vertical" className="w-100">
                          <div>
                            <Video
                              peerId={peer.peerId}
                              track={peer.cam}
                              key={peer.peerId}
                              width={"100%"}
                            />
                            <Audio
                              peerId={peer.peerId}
                              track={peer.mic}
                              key={peer.peerId + `audio`}
                            />
                          </div>
                          <Paragraph>{roomDetail.description}</Paragraph>
                        </Space>
                      </Card>
                    </Card>
                  );
                }
              })}
          </Col>
          <Col xs={9}>
            <ProCard
              title="Chat"
              extra={
                <Button onClick={() => handleLeaveRoom()} danger>
                  Leave
                </Button>
              }
            >
              <ProCard bordered tabs={{ type: "card" }}>
                <ProCard.TabPane key="chat" tab="Chat">
                  <Chat />
                </ProCard.TabPane>
                <ProCard.TabPane key="peers" tab="Peers">
                  <Peers />
                </ProCard.TabPane>
                <ProCard.TabPane key="record" tab="Clip">
                  <Space
                    className="w-100 justify-content-center"
                    align="center"
                  >
                    <Button
                      danger={isRecording}
                      onClick={
                        isRecording ? () => stopRecord() : () => startRecord()
                      }
                      disabled={isReadyToDownload}
                    >
                      {!isRecording ? (
                        <i className="bi bi-record-fill"></i>
                      ) : (
                        <i className="bi bi-stop-fill"></i>
                      )}
                    </Button>
                  </Space>
                </ProCard.TabPane>
                <ProCard.TabPane key="mint" tab="Mint">
                  <Space
                    direction="vertical"
                    className="w-100 justify-content-center"
                    align="center"
                  >
                    <video src={blobUrl} controls />
                    <Button
                      onClick={() => downloadVideo()}
                      disabled={!isReadyToDownload}
                    >
                      Mint
                    </Button>
                  </Space>
                </ProCard.TabPane>
              </ProCard>
            </ProCard>
          </Col>
        </Row>
      )}
      {(joinLobbyIsLoading || joinRoomIsLoading) && <>Loading...</>}
    </>
  );
};

export default Guest;
