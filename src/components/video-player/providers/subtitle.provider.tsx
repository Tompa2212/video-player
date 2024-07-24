import { create, useStore } from 'zustand';
import { Subtitle } from '../video-player';
import { createContext, useContext, useEffect, useRef } from 'react';

export type SubtitleBgColor = 'black' | 'white' | 'transparent';

type State = {
  showSubtitles: boolean;
  subtitles: Subtitle[];
  currentSubtitle: Subtitle | null;
  config: {
    fontSize: number;
    fontColor: string;
    backgroundColor: SubtitleBgColor;
    transparency: number;
  };
};

type Action = {
  updateSubtitles: (subtitles: State['subtitles']) => void;
  updateCurrentSubtitle: (subtitle: State['currentSubtitle']) => void;
  toggleShowSubtitles: () => void;
  updateBackgroundColor: (color: SubtitleBgColor) => void;
};

type SubtitleState = State & Action;

function createSubtitleStore({ subtitles = [] }: { subtitles?: Subtitle[] }) {
  const showSubtitles = subtitles.length > 0;

  return create<SubtitleState>((set) => ({
    showSubtitles,
    subtitles,
    currentSubtitle: null,
    config: {
      fontSize: 16,
      fontColor: '#fff',
      backgroundColor: 'black',
      transparency: 0.6
    },
    updateSubtitles: (subtitles: Subtitle[]) => set({ subtitles }),
    updateCurrentSubtitle: (currentSubtitle: Subtitle | null) =>
      set({ currentSubtitle }),
    toggleShowSubtitles: () =>
      set((state) => ({ showSubtitles: !state.showSubtitles })),
    updateBackgroundColor: (backgroundColor: SubtitleBgColor) =>
      set((state) => ({ config: { ...state.config, backgroundColor } }))
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
