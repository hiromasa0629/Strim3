import { usePeers } from "@huddle01/react/hooks";
import { MessageInstance } from "antd/es/message/interface";
import { useEffect, useState } from "react";

const useMediaRecording = (
  messageApi: MessageInstance,
  recordedRef: HTMLVideoElement | null
) => {
  const { peers } = usePeers();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [recordedBlobs, setRecordedBlobs] = useState<BlobPart[]>([]);
  const [isReadyToDownload, setIsReadyToDownload] = useState<boolean>(false);

  useEffect(() => {
    console.log(recordedRef);
    if (recordedBlobs.length > 0 && recordedRef) {
      const videoBlob = new Blob(recordedBlobs, { type: "video/webm" });
      const blobUrl = URL.createObjectURL(videoBlob);
      console.log(blobUrl);
      recordedRef.src = blobUrl;
    }
  }, [recordedBlobs, recordedRef]);

  const startRecord = () => {
    const tmp = Object.values(peers).find((peer) => peer.role === "host");
    if (!tmp) return;
    const mediaStream = new MediaStream();
    mediaStream.addTrack(tmp.cam);

    const mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedBlobs([event.data]);
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
    if (recordedBlobs.length === 0) return;

    const completeBlob = new Blob(recordedBlobs, { type: "video/webm" });
    const blobUrl = URL.createObjectURL(completeBlob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "myRecording.webm";
    link.click();
    URL.revokeObjectURL(blobUrl);
    setRecordedBlobs([]);
    setIsReadyToDownload(false);
    if (recordedRef) recordedRef.src = "";
  };

  return {
    startRecord,
    stopRecord,
    isRecording,
    downloadVideo,
    isReadyToDownload,
  };
};

export default useMediaRecording;
