import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Settings } from 'lucide-react';
import {
  SubtitleBgColor,
  useSubtitleContext
} from './providers/subtitle.provider';

function VideoSettingsControl() {
  const backgroundColor = useSubtitleContext(
    (state) => state.config.backgroundColor
  );
  const updateBackgroundColor = useSubtitleContext(
    (state) => state.updateBackgroundColor
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="text-white w-60 bg-black-rgba border-black-rgba"
        side="top"
      >
        <div className="grid gap-4">
          <div className="space-y-3">
            <h4 className="font-medium leading-none">Configure Subtitles</h4>

            <div className="space-y-1">
              <label className="block text-sm">Background color</label>
              <select
                value={backgroundColor}
                className="w-full bg-zinc-800"
                onChange={(e) => {
                  updateBackgroundColor(e.target.value as SubtitleBgColor);
                }}
              >
                <option value="black">Black</option>
                <option value="white">White</option>
              </select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default VideoSettingsControl;
