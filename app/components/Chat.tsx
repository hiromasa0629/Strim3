import { Button, Input, List, Space, Typography } from "antd";
import React from "react";

const Chat = () => {
  const { Text } = Typography;
  return (
    <>
      <List bordered style={{ overflowY: "scroll", height: 500 }}>
        {Array.from({ length: 10 }).map((value, index) => (
          <List.Item key={index} className="border-0">
            <Space direction="vertical">
              <Text strong>Peer {index}</Text>
              <Text type="secondary">Hello world</Text>
            </Space>
          </List.Item>
        ))}
      </List>
      <Space.Compact className="w-100 pt-3">
        <Input />
        <Button>Send</Button>
      </Space.Compact>
    </>
  );
};

export default Chat;
