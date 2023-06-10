import React from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
  // posterSrc: string;
  src: MediaStream;
  options?: Player["options"];
}

export const VideoJS: React.FC<VideoPlayerProps> = (props) => {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<Player | null>(null);
  const { options, src } = props;

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      playerRef.current = videojs(videoElement, {
        controls: true,
        fluid: true,
        autoplay: true,
        liveui: true,
        bigPlayButton: false,
        controlBar: {
          seekToLive: true,
        },
        ...options,
      });

      (playerRef.current.tech().el() as HTMLVideoElement).srcObject = src;
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
