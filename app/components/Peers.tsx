import { usePeers } from "@huddle01/react/hooks";
import { Col, List, Row, Typography } from "antd";
import React from "react";

const Peers = () => {
  const { peers } = usePeers();
  const { Text } = Typography;

  return (
    <List
      dataSource={Object.values(peers)}
      className="w-100"
      renderItem={(peer) => (
        <List.Item>
          <Row className="justify-content-between w-100">
            <Col xs={12}>
              <Text ellipsis>{peer.displayName}</Text>
            </Col>
            <Col className="text-end">
              <Text>{peer.role}</Text>
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

export default Peers;
