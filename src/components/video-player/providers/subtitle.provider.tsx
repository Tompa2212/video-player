import { create, useStore } from 'zustand';
import { Subtitle } from '../video-player';
import { createContext, useContext, useEffect, useRef } from 'react';

type State = {
  showSubtitles: boolean;
  subtitles: Subtitle[];
  currentSubtitle: Subtitle | null;
};

type Action = {
  updateSubtitles: (subtitles: State['subtitles']) => void;
  updateCurrentSubtitle: (subtitle: State['currentSubtitle']) => void;
  toggleShowSubtitles: () => void;
};

type SubtitleState = State & Action;

function createSubtitleStore() {
  return create<SubtitleState>((set) => ({
    showSubtitles: false,
    subtitles: [],
    currentSubtitle: null,
    config: {
      fontSize: 16,
      fontColor: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    updateSubtitles: (subtitles: Subtitle[]) => set({ subtitles }),
    updateCurrentSubtitle: (currentSubtitle: Subtitle | null) =>
      set({ currentSubtitle }),
    toggleShowSubtitles: () =>
      set((state) => ({ showSubtitles: !state.showSubtitles }))
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
    storeRef.current = createSubtitleStore();
  }

  useEffect(() => {
    storeRef.current?.setState({ subtitles, currentSubtitle: null });
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
