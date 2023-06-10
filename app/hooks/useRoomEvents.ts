import { useEventListener } from "@huddle01/react";
import { toast } from "react-toastify";

interface UseRoomEventsHook {
  produceVideo: {
    (stream: any, targetPeerIds?: any): void;
    isCallable: any;
  };
  camStream: MediaStream;
}

const useRoomEvents = () => {
  useEventListener("room:joined", () => {
    toast.success("Room joined");
  });

  useEventListener("room:failed", () => {
    toast.success("Room joined");
  });
};

export default useRoomEvents;
