import React from "react";
// import { Row, Col } from 'react-bootstrap';
import { Row, Col, Button, Typography } from "antd";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import {
  MeetingMachineStatus,
  useMeetingMachineContext,
} from "../providers/MeetingMachineProvider";
import { useAudio, useLobby, useRoom, useVideo } from "@huddle01/react/hooks";

const Header = () => {
  const { Title } = Typography;
  const { status, info } = useMeetingMachineContext();
  const { leaveLobby } = useLobby();
  const { leaveRoom } = useRoom();
  const { stopVideoStream } = useVideo();
  const { stopAudioStream } = useAudio();
  const router = useRouter();

  const handleHome = () => {
    stopAudioStream();
    stopVideoStream();
    switch (status) {
      case MeetingMachineStatus.JoinedLobby:
        leaveLobby();
      case MeetingMachineStatus.JoinedRoom:
        leaveRoom();
      default:
    }
    router.push("/");
  };

  return (
    <Row className="justify-content-between">
      <Col>
        <Title style={{ cursor: "pointer" }} onClick={() => handleHome()}>
          Strim3
        </Title>
      </Col>
      <Col>
        <ConnectButton
          accountStatus={"full"}
          chainStatus={"icon"}
          showBalance={true}
        />
      </Col>
    </Row>
  );
};

export default Header;
