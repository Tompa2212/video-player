import { create, useStore } from 'zustand';
import { Subtitle } from '../video-player';
import { createContext, useContext, useEffect, useRef } from 'react';

export const subtitleBgColors = ['black', 'white'] as const;
export const subtitleBgTransparencies = [0, 0.25, 0.5, 0.75, 1] as const;
export const subtitleFontScales = [0.5, 0.75, 1, 1.25, 1.5, 1.75] as const;

export type SubtitleBgColor = (typeof subtitleBgColors)[number];
export type SubtitleBgTransparency = (typeof subtitleBgTransparencies)[number];
export type SubtitleFontScale = (typeof subtitleFontScales)[number];

type State = {
  showSubtitles: boolean;
  subtitles: Subtitle[];
  currentSubtitle: Subtitle | null;
  config: {
    fontScale: number;
    fontColor: string;
    backgroundColor: SubtitleBgColor;
    backgroundTransparency: SubtitleBgTransparency;
  };
};

type Action = {
  updateSubtitles: (subtitles: State['subtitles']) => void;
  updateCurrentSubtitle: (subtitle: State['currentSubtitle']) => void;
  toggleShowSubtitles: () => void;
  updateBackgroundColor: (color: SubtitleBgColor) => void;
  updateBackgroundTransparency: (transparency: SubtitleBgTransparency) => void;
  updateFontScale: (fontScale: SubtitleFontScale) => void;
};

type SubtitleState = State & Action;

function createSubtitleStore({ subtitles = [] }: { subtitles?: Subtitle[] }) {
  const showSubtitles = subtitles.length > 0;

  return create<SubtitleState>((set) => ({
    showSubtitles,
    subtitles,
    currentSubtitle: null,
    config: {
      fontScale: 1,
      fontColor: '#fff',
      backgroundColor: 'black',
      backgroundTransparency: 0.75
    },
    updateSubtitles: (subtitles: Subtitle[]) => set({ subtitles }),
    updateCurrentSubtitle: (currentSubtitle: Subtitle | null) =>
      set({ currentSubtitle }),
    toggleShowSubtitles: () =>
      set((state) => ({ showSubtitles: !state.showSubtitles })),
    updateBackgroundColor: (backgroundColor: SubtitleBgColor) =>
      set((state) => ({ config: { ...state.config, backgroundColor } })),
    updateBackgroundTransparency: (
      backgroundTransparency: SubtitleBgTransparency
    ) =>
      set((state) => ({ config: { ...state.config, backgroundTransparency } })),
    updateFontScale: (fontScale: SubtitleFontScale) =>
      set((state) => ({ config: { ...state.config, fontScale } }))
  }));
}

export type SubtitleStore = ReturnType<typeof createSubtitleStore>;

const subtitleContext = createContext<SubtitleStore | undefined>(undefined);

export function SubtitleProvider({
  children,
  subtitles
}: {
  children: React.ReactNode;
  subtitles?: Subtitle[];
}) {
  const storeRef = useRef<SubtitleStore>();

  if (!storeRef.current) {
    storeRef.current = createSubtitleStore({ subtitles });
  }

  useEffect(() => {
    storeRef.current?.setState({
      subtitles,
      currentSubtitle: null,
      showSubtitles: !!subtitles?.length
    });
  }, [subtitles]);

  return (
    <subtitleContext.Provider value={storeRef.current}>
      {children}
    </subtitleContext.Provider>
  );
}

export function useSubtitleContext<T>(
  selector: (state: SubtitleState) => T
): T {
  const store = useContext(subtitleContext);

  if (!store) {
    throw new Error('Missing SubtitleContext.Provider in the tree');
  }

  return useStore(store, selector);
}
