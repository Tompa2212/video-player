import { cn } from '@/lib/utils';
import { useSubtitleContext } from './providers/subtitle.provider';

export default function VideoSubtitles() {
  const currentSubtitle = useSubtitleContext((state) => state.currentSubtitle);
  const showSubtitles = useSubtitleContext((state) => state.showSubtitles);
  const backgroundColor = useSubtitleContext(
    (state) => state.config.backgroundColor
  );

  const shouldShowSubtitles = showSubtitles && currentSubtitle;

  return (
    <div
      className={cn(
        'font-semibold text-white absolute left-[50%] bottom-[10%] -translate-x-[50%] z-1 bg-black/60 rounded-sm',
        {
          'bg-black/60 text-white': backgroundColor === 'black',
          'bg-white/60 text-black': backgroundColor === 'white'
        }
      )}
    >
      {shouldShowSubtitles ? (
        <span className="inline-block px-4 py-2">{currentSubtitle.text}</span>
      ) : null}
    </div>
  );
}
