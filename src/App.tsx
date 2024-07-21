import { useState } from 'react';
import './App.css';
import video1 from './assets/video_1/clip.mp4';
import video1Subtitles from './assets/video_1/captions.srt';
import video2 from './assets/video_2/clip.mp4';
import video2Subtitles from './assets/video_2/captions.srt';

import VideoPlayer from './components/video-player/video-player';

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

  return (
    <div>
      <VideoPlayer
        subtitlesUrl={currentClip.subtitlesSrc}
        videoSrc={currentClip.src}
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
  );
}

export default App;
