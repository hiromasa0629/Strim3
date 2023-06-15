import { useHuddle01 } from "@huddle01/react";
import { useLobby } from "@huddle01/react/dist/declarations/src/hooks";
import React, { useEffect, useState } from "react";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { useAccount } from "wagmi";
// import { Button, Col, Container, Row } from "react-bootstrap";
import { Button, Card, Col, Form, Input, Row, Space, message } from "antd";
import { useRouter } from "next/router";
import { useGetRoomDetail } from "../hooks/useGetRoomDetail";
import { Video } from "@huddle01/react/components";
import { useNFTStorage } from "../providers/NFTStorageProvider";

const index = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [messageApi, contextHolder] = message.useMessage();
  const { roomId, createRoom, createRoomIsLoading, createRoomIsSuccess } =
    useCreateRoom(address!, messageApi);

  const [joinRoomId, setJoinRoomId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  useEffect(() => {
    if (createRoomIsSuccess) {
      router.push(`/${roomId}`);
    }
  }, [createRoomIsSuccess]);

  const handleJoin = () => router.push(`/${joinRoomId}`);
  const handleCreate = () => {
    if (title === "") messageApi.error("Title is required");
    else if (desc === "") messageApi.error("Description is required");
    else createRoom({ address: address!, title, desc });
  };

  return (
    <>
      {contextHolder}
      <Row gutter={16}>
        <Col xs={12}>
          <Card>
            <Space direction="vertical" className="w-100">
              <Card
                title="Create room"
                extra={
                  <Button
                    // TODO: Pass description and title
                    onClick={() => handleCreate()}
                    disabled={createRoomIsLoading}
                  >
                    Create
                  </Button>
                }
              >
                <Form layout="vertical">
                  <Form.Item name="title" label="Title">
                    <Input onChange={(e) => setTitle(e.target.value)} />
                  </Form.Item>
                  <Form.Item name="description" label="Description">
                    <Input onChange={(e) => setDesc(e.target.value)} />
                  </Form.Item>
                </Form>
              </Card>
              <Card
                title="Join room"
                bordered
                extra={<Button onClick={() => handleJoin()}>Join</Button>}
              >
                <Space
                  align="center"
                  direction="vertical"
                  className="w-100 justify-content-center"
                >
                  <Form layout="vertical">
                    <Form.Item name="roomId" label="Room ID:">
                      <Input onChange={(e) => setJoinRoomId(e.target.value)} />
                    </Form.Item>
                  </Form>
                </Space>
              </Card>
            </Space>
          </Card>
        </Col>
        <Col xs={12}>
          <Card title="Temp"></Card>
        </Col>
      </Row>
    </>
  );
};

export default index;
