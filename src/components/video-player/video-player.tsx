import { SubtitleProvider } from './providers/subtitle.provider';
import { VideoProvider } from './providers/video.provider';
import Video from './video';

type VideoPlayerProps = {
  videoSrc: string;
  subtitles?: Subtitle[];
  videoRef?: React.RefObject<HTMLVideoElement>;
  onCurrentSubtitleChange?: (currentSubtitle: Subtitle | null) => void;
};

export type Subtitle = {
  sequence: number;
  start: number;
  end: number;
  text: string;
};

function VideoPlayer({
  videoSrc,
  subtitles,
  videoRef,
  onCurrentSubtitleChange
}: VideoPlayerProps) {
  return (
    <VideoProvider videoRef={videoRef}>
      <SubtitleProvider subtitles={subtitles}>
        <Video
          videoSrc={videoSrc}
          onCurrentSubtitleChange={onCurrentSubtitleChange}
        />
      </SubtitleProvider>
    </VideoProvider>
  );
}

export default VideoPlayer;
