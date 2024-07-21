import { useEffect, useRef, useState } from 'react';
import VideoTranscript from '../video-transcript/video-transcript';
import { useSubtitles } from './use-subtitles';
import './video-player.css';

type VideoPlayerProps = {
  videoSrc: string;
  subtitlesUrl?: string;
  onProgress?: ({ currentTime }: { currentTime: number }) => void;
};

export type Subtitle = {
  sequence: number;
  start: number;
  end: number;
  text: string;
};

function VideoPlayer({ videoSrc, subtitlesUrl, onProgress }: VideoPlayerProps) {
  const subtitles = useSubtitles(subtitlesUrl);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  const [videoHeight, setVideoHeight] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoSrc]);

  useEffect(() => {
    const onResize = () => {
      if (videoRef.current) {
        setVideoHeight(videoRef.current.getBoundingClientRect().height);
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  function handleTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>) {
    const currentTime = e.currentTarget.currentTime;
    const currentSubtitle = subtitles.find(
      (s) => s.start <= currentTime && s.end >= currentTime
    );

    setCurrentSubtitle(currentSubtitle || null);

    if (onProgress) {
      onProgress({ currentTime });
    }
  }

  return (
    <div className="video-player">
      <div className="video">
        <video
          ref={videoRef}
          preload="metadata"
          controls
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => {
            setVideoHeight(e.currentTarget.getBoundingClientRect().height);
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="video__subtitle">
          {currentSubtitle ? <span>{currentSubtitle.text}</span> : null}
        </div>
      </div>
      <VideoTranscript
        subtitles={subtitles}
        currentSubtitle={currentSubtitle}
        onSubtitleClick={(subtitle) => {
          if (videoRef.current) {
            videoRef.current.currentTime = subtitle.start + 0.01;
          }
        }}
        style={{ maxHeight: videoHeight }}
      />
    </div>
  );
}

export default VideoPlayer;
