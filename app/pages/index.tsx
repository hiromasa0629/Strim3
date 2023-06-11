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

const index = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [messageApi, contextHolder] = message.useMessage();
  const { roomId, createRoom, createRoomIsLoading, createRoomIsSuccess } =
    useCreateRoom(address!, messageApi);

  const [input, setInput] = useState<string>("");

  useEffect(() => {
    if (createRoomIsSuccess) {
      router.push(`/${roomId}`);
    }
  }, [createRoomIsSuccess]);

  const handleOnChange = (input: string) => {
    setInput(input);
  };

  const handleOnClick = () => {
    router.push(`/${input}`);
  };

  return (
    <>
      {contextHolder}
      <Row gutter={16}>
        <Col xs={12}>
          <Card
            title="Room"
            extra={
              <Button
                onClick={() => createRoom(address!)}
                disabled={createRoomIsLoading}
              >
                Create
              </Button>
            }
          >
            <Card bordered>
              <Space
                align="center"
                direction="vertical"
                className="w-100 justify-content-center"
              >
                <Form layout="vertical">
                  <Form.Item name="roomId" label="Room ID:">
                    <Input onChange={(e) => handleOnChange(e.target.value)} />
                  </Form.Item>
                  <Form.Item>
                    <Button onClick={() => handleOnClick()}>Join</Button>
                  </Form.Item>
                </Form>
              </Space>
            </Card>
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
