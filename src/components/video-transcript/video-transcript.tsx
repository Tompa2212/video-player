import { useEffect } from 'react';
import './video-transcript.css';
import { Subtitle } from '../video-player/video-player';

type VideoTranscriptProps = {
  currentSubtitle: Subtitle | null;
  subtitles: Subtitle[];
  onSubtitleClick: (subtitle: Subtitle) => void;
} & React.HTMLAttributes<HTMLDivElement>;

function VideoTranscript({
  subtitles,
  currentSubtitle,
  onSubtitleClick,
  ...props
}: VideoTranscriptProps) {
  useEffect(() => {
    if (!currentSubtitle) {
      return;
    }

    const currentSubtitleElem = document.querySelector(
      '.transcript__subtitle--current'
    );

    if (!currentSubtitleElem) {
      return;
    }

    currentSubtitleElem.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, [currentSubtitle]);

  return (
    <div className="transcript" {...props}>
      <h3 className="transcript__title">Transkript</h3>
      <div className="transcript__subtitles">
        {subtitles.map((subtitle) => {
          const isCurrent = subtitle.sequence === currentSubtitle?.sequence;

          return (
            <button
              className={`transcript__subtitle ${
                isCurrent ? 'transcript__subtitle--current' : null
              } `}
              key={subtitle.sequence}
              onClick={() => {
                onSubtitleClick(subtitle);
              }}
            >
              <span>
                {new Date(subtitle.start * 1000).toTimeString().slice(3, 9)}
              </span>
              <span>{subtitle.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VideoTranscript;
