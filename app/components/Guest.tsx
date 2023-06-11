import { useEventListener } from "@huddle01/react";
import { Video } from "@huddle01/react/components";
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
// import { Button, Row, Stack } from "react-bootstrap";
import { Row, Button, Space, message, Card, Form, Input, Col } from "antd";
import useMediaRecording from "../hooks/useMedaiRecording";
import { ProCard } from "@ant-design/pro-components";

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
  const {
    joinLobby,
    isLoading: joinLobbyIsLoading,
    isLobbyJoined,
  } = useLobby();
  const { joinRoom, isLoading: joinRoomIsLoading, isRoomJoined } = useRoom();
  const { setDisplayName } = useDisplayName();
  const [input, setInput] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const recordedRef = useRef<HTMLVideoElement>(null);

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

  const {
    startRecord,
    stopRecord,
    isRecording,
    downloadVideo,
    isReadyToDownload,
  } = useMediaRecording(messageApi, recordedRef.current);

  return (
    <>
      {contextHolder}
      {isLobbyJoined && (
        <Card title={`Joining ${roomId}`}>
          <Card bordered>
            <Space className="w-100 justify-content-center">
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
          <Col xs={16}>
            {Object.values(peers)
              .filter((peer) => peer.cam)
              .map((peer) => {
                if (peer.role === "host") {
                  return (
                    <Card title={`${peer.peerId} ${peer.displayName}`}>
                      <Card bordered>
                        <Video
                          peerId={peer.peerId}
                          track={peer.cam}
                          key={peer.peerId}
                          width={"100%"}
                        />
                      </Card>
                    </Card>
                  );
                }
              })}
          </Col>
          <Col xs={8}>
            <ProCard title="Chat">
              <ProCard bordered tabs={{ type: "card" }}>
                <ProCard.TabPane key="record" tab="Record">
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
                    <video ref={recordedRef} controls />
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
