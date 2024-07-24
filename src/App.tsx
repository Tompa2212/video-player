import { useEffect, useRef, useState } from 'react';
import './App.css';
import video1 from './assets/video_1/clip.mp4';
import video1Subtitles from './assets/video_1/captions.srt';
import video2 from './assets/video_2/clip.mp4';
import video2Subtitles from './assets/video_2/captions.srt';

import VideoPlayer, { Subtitle } from './components/video-player/video-player';
import VideoTranscript from './components/video-transcript/video-transcript';
import { formatSrt } from './components/utils';

async function fetchSubtitles(subtitlesUrl?: string) {
  if (!subtitlesUrl) {
    return [];
  }

  try {
    const response = await fetch(subtitlesUrl);

    if (!response.ok) {
      return [];
    }

    const data = await response.text();

    return formatSrt(data);
  } catch (error) {
    return [];
  }
}

const clips = [
  {
    src: video1,
    subtitlesSrc: video1Subtitles
  },
  {
    src: video2,
    subtitlesSrc: video2Subtitles
  }
];

function App() {
  const [currentClip, setCurrentClip] = useState(clips[0]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);

  useEffect(() => {
    fetchSubtitles(currentClip.subtitlesSrc).then((subtitles) =>
      setSubtitles(subtitles)
    );
  }, [currentClip]);

  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="grid grid-cols-[2fr_1fr] gap-2">
      <div>
        <VideoPlayer
          videoRef={videoRef}
          subtitles={subtitles}
          videoSrc={currentClip.src}
          onCurrentSubtitleChange={setCurrentSubtitle}
        />
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          {clips.map((clip, index) => (
            <button
              className="clip-btn"
              key={index}
              onClick={() => setCurrentClip(clip)}
            >
              Clip {index + 1}
            </button>
          ))}
        </div>
      </div>

      <VideoTranscript
        subtitles={subtitles}
        currentSubtitle={currentSubtitle}
        onSubtitleClick={(subtitle) => {
          console.log(videoRef.current);
          if (videoRef.current) {
            videoRef.current.currentTime = subtitle.start + 0.01;
          }
        }}
        style={{ maxHeight: 400 }}
      />
    </div>
  );
}

export default App;
