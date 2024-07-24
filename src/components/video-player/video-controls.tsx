import {
  Captions,
  CaptionsOff,
  Maximize,
  Pause,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { secondsToFormatedTime } from '../utils';
import { useVideoContext } from './providers/video.provider';
import { cn } from '@/lib/utils';
import VideoTimeline from './video-timeline';
import { useSubtitleContext } from './providers/subtitle.provider';

export default function VideoControls() {
  const [
    currentTime,
    videoRef,
    paused,
    duration,
    muted,
    volume,
    togglePlay,
    toggleMuted,
    toggleFullscreen
  ] = useVideoContext((state) => [
    state.currentTime,
    state.videoRef,
    state.paused,
    state.duration,
    state.muted,
    state.volume,
    state.togglePlay,
    state.toggleMuted,
    state.toggleFullscreen
  ]);

  const showSubtitles = useSubtitleContext((state) => state.showSubtitles);
  const toggleShowSubtitles = useSubtitleContext(
    (state) => state.toggleShowSubtitles
  );

  const noSound = muted || volume === 0;
  const videoElem = videoRef.current;

  return (
    <div
      className={cn(
        'z-2 absolute bottom-0 left-0 right-0 text-white transition-opacity opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto bg-black/40',
        paused && 'opacity-100 pointer-events-auto'
      )}
    >
      <VideoTimeline />
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={togglePlay}>
            {paused ? <Play /> : <Pause />}
          </Button>
          <div className="flex items-center gap-1 group/volume">
            <Button
              size="icon"
              variant="ghost"
              className="flex-shrink-0"
              onClick={toggleMuted}
            >
              {noSound ? <VolumeX /> : <Volume2 />}
            </Button>
            <Slider
              className="flex-grow w-0 overflow-hidden transition-all cursor-pointer group-hover/volume:w-16 group-hover/volume:overflow-visible"
              rangeClassName="bg-zinc-200"
              trackClassName="bg-zinc-200/20"
              value={[muted ? 0 : volume]}
              max={1}
              step={0.01}
              min={0}
              onValueChange={(value) => {
                if (!videoElem) {
                  return;
                }

                videoElem.volume = value[0];
              }}
            />
          </div>
          <div className="text-sm">
            <span>{secondsToFormatedTime(currentTime)}</span>
            <span> / </span>
            <span>{secondsToFormatedTime(duration)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={toggleShowSubtitles}>
            {showSubtitles ? <Captions /> : <CaptionsOff />}
          </Button>
          <Button size="icon" variant="ghost" onClick={toggleFullscreen}>
            <Maximize />
          </Button>
        </div>
      </div>
    </div>
  );
}
