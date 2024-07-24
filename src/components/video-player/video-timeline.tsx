import { useRef, useState } from 'react';
import { Slider } from '../ui/slider';
import { useVideoContext } from './providers/video.provider';

function VideoTimeline() {
  const currentTime = useVideoContext((state) => state.currentTime);
  const duration = useVideoContext((state) => state.duration);
  const videoElem = useVideoContext((state) => state.videoRef.current);
  const paused = useVideoContext((state) => state.paused);
  const updatePaused = useVideoContext((state) => state.updatePaused);

  const isScrubbing = useRef(false);
  const wasPaused = useRef(paused);

  const [value, setValue] = useState([currentTime]);
  const sliderValue = isScrubbing.current ? value : [currentTime];

  return (
    <Slider
      className="cursor-pointer group/time-slider"
      rangeClassName="bg-red-600"
      trackClassName="bg-zinc-200/20 h-1"
      thumbClassName="opacity-0 group-hover/time-slider:opacity-100 transition-opacity w-3 h-3"
      max={duration}
      min={0}
      step={0.1}
      value={sliderValue}
      onPointerDown={() => {
        isScrubbing.current = true;
        wasPaused.current = paused;
        updatePaused(true);
      }}
      onPointerUp={() => {
        isScrubbing.current = false;
        if (!wasPaused.current) {
          updatePaused(false);
        }
      }}
      onValueChange={(value) => {
        if (!videoElem) {
          return;
        }

        videoElem.currentTime = value[0];
        setValue(value);
      }}
    />
  );
}

export default VideoTimeline;
