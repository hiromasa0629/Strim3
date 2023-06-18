import { usePeers } from "@huddle01/react/hooks";
import { MessageInstance } from "antd/es/message/interface";
import { useEffect, useState } from "react";
import { useNFTStorage } from "../providers/NFTStorageProvider";

const useMediaRecording = (messageApi: MessageInstance) => {
  const { peers } = usePeers();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [isReadyToDownload, setIsReadyToDownload] = useState<boolean>(false);
  const [blobUrl, setBlobUrl] = useState<string>("");
  const client = useNFTStorage();

  const startRecord = (
    isHost: boolean = false,
    camStream?: MediaStream,
    micStream?: MediaStream
  ) => {
    const mediaStream = new MediaStream();

    if (isHost) {
      camStream
        ?.getVideoTracks()
        .forEach((track) => mediaStream.addTrack(track));
      micStream
        ?.getAudioTracks()
        .forEach((track) => mediaStream.addTrack(track));
    } else {
      const tmp = Object.values(peers).find((peer) => peer.role === "host");
      if (!tmp) return;
      mediaStream.addTrack(tmp.cam);
      mediaStream.addTrack(tmp.mic);
    }

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

  const downloadVideo = async () => {
    if (blobUrl === "") return;
    const blob = await fetch(blobUrl).then((r) => r.blob());
    console.log(blob);
    // const cid = await client.storeBlob(blob);
    // console.log(cid);
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
