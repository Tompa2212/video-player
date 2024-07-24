import { useEffect } from 'react';
// import VideoTranscript from '../video-transcript/video-transcript';
import './video-player.css';
import { useVideoContext } from './providers/video.provider';
import VideoSubtitles from './video-subtitles';
import { cn } from '@/lib/utils';
import VideoControls from './video-controls';
import { useShallow } from 'zustand/react/shallow';
import { useSubtitleContext } from './providers/subtitle.provider';
import { Subtitle } from './video-player';

type VideoProps = {
  videoSrc: string;
  onCurrentSubtitleChange?: (currentSubtitle: Subtitle | null) => void;
};

function Video({ videoSrc, onCurrentSubtitleChange }: VideoProps) {
  const subtitles = useSubtitleContext((state) => state.subtitles);
  const updateCurrentSubtitle = useSubtitleContext(
    (state) => state.updateCurrentSubtitle
  );

  const {
    fullscreen,
    videoRef,
    videoContainerRef,
    updateCurrentTime,
    initialiteVideoStore,
    handleVolumeChange,
    togglePlay
  } = useVideoContext(
    useShallow((state) => ({
      fullscreen: state.fullscreen,
      muted: state.muted,
      videoRef: state.videoRef,
      videoContainerRef: state.videoContainerRef,
      updateCurrentTime: state.updateCurrentTime,
      initialiteVideoStore: state.initializeVideoStore,
      handleVolumeChange: state.handleVolumeChange,
      togglePlay: state.togglePlay
    }))
  );

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoRef, videoSrc]);

  function handleTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>) {
    const currentTime = e.currentTarget.currentTime;
    const currentSubtitle =
      subtitles.find((s) => s.start <= currentTime && s.end >= currentTime) ||
      null;

    updateCurrentTime(currentTime);
    updateCurrentSubtitle(currentSubtitle);

    if (onCurrentSubtitleChange) {
      onCurrentSubtitleChange(currentSubtitle);
    }
  }

  return (
    <div ref={videoContainerRef} className="video group">
      <video
        ref={videoRef}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        onVolumeChange={handleVolumeChange}
        onLoadedMetadata={(e) => {
          const duration = e.currentTarget.duration;
          const volume = e.currentTarget.volume;
          const muted = e.currentTarget.muted;
          const paused = e.currentTarget.paused;

          initialiteVideoStore({ duration, volume, muted, paused });
        }}
        className={cn(fullscreen && 'w-full h-full')}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <VideoSubtitles />
      <VideoControls />
    </div>
  );
}

export default Video;
