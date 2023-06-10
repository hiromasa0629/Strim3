import { useHuddle01 } from "@huddle01/react";
import { useLobby } from "@huddle01/react/dist/declarations/src/hooks";
import React, { useEffect, useState } from "react";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { useAccount } from "wagmi";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { useGetRoomDetail } from "../hooks/useGetRoomDetail";
import { Video } from "@huddle01/react/components";

const index = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { roomId, createRoom, createRoomIsLoading, createRoomIsSuccess } =
    useCreateRoom(address!);

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
    <Row>
      <Col>
        <Button onClick={() => createRoom(address!)}>
          {createRoomIsLoading ? "Creating..." : "Create room"}
        </Button>
        <div>
          <input
            onChange={(e) => handleOnChange(e.target.value)}
            value={input}
          />
        </div>
        <Button onClick={() => handleOnClick()}>JoinRoom</Button>
      </Col>
    </Row>
  );
};

export default index;
