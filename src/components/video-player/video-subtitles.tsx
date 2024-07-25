import { cn } from '@/lib/utils';
import { useSubtitleContext } from './providers/subtitle.provider';

export default function VideoSubtitles() {
  const currentSubtitle = useSubtitleContext((state) => state.currentSubtitle);
  const showSubtitles = useSubtitleContext((state) => state.showSubtitles);
  const { backgroundColor, backgroundTransparency, fontScale } =
    useSubtitleContext((state) => state.config);

  const shouldShowSubtitles = showSubtitles && currentSubtitle;

  const bgBase = backgroundColor === 'black' ? '0, 0, 0' : '255, 255, 255';
  const bgStyle = `rgba(${bgBase}, ${backgroundTransparency})`;

  return (
    <div
      className={cn(
        'text-[calc(var(--font-base)_*_var(--font-scale))] font-semibold text-white absolute left-[50%] bottom-[10%] -translate-x-[50%] z-1 rounded-sm',
        {
          'text-black': backgroundColor === 'white',
          'text-white': backgroundColor === 'black'
        }
      )}
      style={
        {
          '--font-scale': fontScale,
          backgroundColor: bgStyle
        } as React.CSSProperties
      }
    >
      {shouldShowSubtitles ? (
        <span className="inline-block px-4 py-2">{currentSubtitle.text}</span>
      ) : null}
    </div>
  );
}
