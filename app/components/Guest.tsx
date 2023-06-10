import { Video } from "@huddle01/react/components";
import { usePeers, useVideo } from "@huddle01/react/hooks";
import React, { useEffect, useRef, useState } from "react";

const Guest = ({}) => {
  const { peers } = usePeers();

  const host = Object.values(peers).find((peer) => peer.role === "host");

  return (
    <>
      {host && (
        <Video peerId={host.peerId} track={host.cam} key={host.peerId} debug />
      )}
    </>
  );
};

export default Guest;
