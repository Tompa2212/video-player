import { useSubtitleContext } from './providers/subtitle.provider';

export default function VideoSubtitles() {
  const currentSubtitle = useSubtitleContext((state) => state.currentSubtitle);
  const showSubtitles = useSubtitleContext((state) => state.showSubtitles);

  const shouldShowSubtitles = showSubtitles && currentSubtitle;

  return (
    <div className="font-semibold text-white absolute left-[50%] bottom-[10%] -translate-x-[50%] z-1 bg-black/60 rounded-sm">
      {shouldShowSubtitles ? (
        <span className="inline-block px-4 py-2">{currentSubtitle.text}</span>
      ) : null}
    </div>
  );
}
