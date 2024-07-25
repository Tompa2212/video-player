import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Settings } from 'lucide-react';
import {
  SubtitleBgColor,
  subtitleBgColors,
  subtitleBgTransparencies,
  SubtitleBgTransparency,
  SubtitleFontScale,
  subtitleFontScales,
  useSubtitleContext
} from './providers/subtitle.provider';
import { useVideoContext } from './providers/video.provider';

function VideoSettingsControl() {
  const { backgroundColor, backgroundTransparency, fontScale } =
    useSubtitleContext((state) => state.config);
  const updateBackgroundColor = useSubtitleContext(
    (state) => state.updateBackgroundColor
  );
  const updateBackgroundTransparency = useSubtitleContext(
    (state) => state.updateBackgroundTransparency
  );
  const updateFontScale = useSubtitleContext((state) => state.updateFontScale);

  const videoContainerRef = useVideoContext((state) => state.videoContainerRef);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        portalContainer={videoContainerRef.current || undefined}
        className="mx-10 text-white w-60 bg-black-rgba border-black-rgba"
        side="top"
      >
        <div className="grid gap-4">
          <div className="space-y-3">
            <h4 className="font-medium leading-none">Configure Subtitles</h4>

            <div className="space-y-1">
              <label className="block text-sm" htmlFor="select-bg-color">
                Background Color
              </label>
              <select
                id="select-bg-color"
                value={backgroundColor}
                className="w-full px-2 py-1 capitalize rounded-sm bg-zinc-900"
                onChange={(e) => {
                  updateBackgroundColor(e.target.value as SubtitleBgColor);
                }}
              >
                {subtitleBgColors.map((color) => (
                  <option value={color} key={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm" htmlFor="select-bg-color">
                Background Transparency
              </label>
              <select
                value={backgroundTransparency}
                className="w-full px-2 py-1 rounded-sm bg-zinc-900"
                onChange={(e) => {
                  updateBackgroundTransparency(
                    Number(e.target.value) as SubtitleBgTransparency
                  );
                }}
              >
                {subtitleBgTransparencies.map((transparency) => (
                  <option value={transparency} key={transparency}>
                    {transparency}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm" htmlFor="select-bg-color">
                Font Size
              </label>
              <select
                value={fontScale}
                className="w-full px-2 py-1 rounded-sm bg-zinc-900"
                onChange={(e) => {
                  updateFontScale(Number(e.target.value) as SubtitleFontScale);
                }}
              >
                {subtitleFontScales.map((scale) => (
                  <option value={scale} key={scale}>
                    {scale * 100}%
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default VideoSettingsControl;
