import { useEventListener } from "@huddle01/react";
import { MessageInstance } from "antd/es/message/interface";
import { toast } from "react-toastify";

interface UseRoomEventsHook {
  produceVideo: {
    (stream: any, targetPeerIds?: any): void;
    isCallable: any;
  };
  camStream: MediaStream;
}

const useRoomEvents = (messageApi: MessageInstance) => {
  useEventListener("room:joined", () => {
    messageApi.success("Room joined");
  });

  useEventListener("room:failed", () => {
    messageApi.success("Room joined");
  });
};

export default useRoomEvents;
