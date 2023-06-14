import { usePeers } from "@huddle01/react/hooks";
import { MessageInstance } from "antd/es/message/interface";
import { useEffect, useState } from "react";

const useMediaRecording = (messageApi: MessageInstance) => {
  const { peers } = usePeers();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [isReadyToDownload, setIsReadyToDownload] = useState<boolean>(false);
  const [blobUrl, setBlobUrl] = useState<string>("");

  const startRecord = () => {
    const tmp = Object.values(peers).find((peer) => peer.role === "host");
    if (!tmp) return;
    const mediaStream = new MediaStream();
    mediaStream.addTrack(tmp.cam);
    mediaStream.addTrack(tmp.mic);

    const mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        const blob = new Blob([event.data], { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setIsReadyToDownload(true);
      }
    };

    mediaRecorder.onstart = (event) => messageApi.success("Recording started");
    mediaRecorder.onstop = (event) => messageApi.success("Recording stop");

    mediaRecorder.start();
    setRecorder(mediaRecorder);
    setIsRecording(true);
  };

  const stopRecord = () => {
    if (!recorder) return;
    recorder.stop();
    setIsRecording(false);
  };

  const downloadVideo = () => {
    if (blobUrl === "") return;

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "myRecording.webm";
    link.click();
    URL.revokeObjectURL(blobUrl);
    setIsReadyToDownload(false);
  };

  return {
    startRecord,
    stopRecord,
    isRecording,
    downloadVideo,
    isReadyToDownload,
    blobUrl,
  };
};

export default useMediaRecording;
