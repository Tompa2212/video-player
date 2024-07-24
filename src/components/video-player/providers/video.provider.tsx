import { createContext, createRef, useContext, useRef } from 'react';

import { create, useStore } from 'zustand';

type State = {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoContainerRef: React.RefObject<HTMLDivElement>;
  currentTime: number;
  paused: boolean;
  volume: number;
  playbackSpeed: number;
  fullscreen: boolean;
  duration: number;
  muted: boolean;
};

type Action = {
  updateCurrentTime: (time: State['currentTime']) => void;
  updateVolume: (volume: State['volume']) => void;
  updatePaused: (paused: State['paused']) => void;

  initializeVideoStore: (data: Partial<State>) => void;
  handleVolumeChange: () => void;

  togglePlay: () => void;
  toggleMuted: () => void;
  toggleFullscreen: () => void;
};

type VideoState = State & Action;

function createVideoStore({
  videoRef
}: {
  videoRef?: React.RefObject<HTMLVideoElement>;
}) {
  if (!videoRef) {
    videoRef = createRef<HTMLVideoElement>();
  }
  const videoContainerRef = createRef<HTMLDivElement>();

  return create<State & Action>((set, get) => ({
    videoRef,
    videoContainerRef,
    playbackSpeed: 1,
    currentTime: 0,
    paused: true,
    volume: 1,
    fullscreen: false,
    duration: 0,
    muted: false,

    togglePlay: () => {
      if (!videoRef.current) {
        return;
      }

      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }

      set(() => ({ paused: !!videoRef.current?.paused }));
    },
    toggleMuted: () => {
      if (!videoRef.current) {
        return;
      }

      videoRef.current.muted = !videoRef.current.muted;
    },
    toggleFullscreen: async () => {
      const currFullscreen = get().fullscreen;
      if (!videoContainerRef.current) {
        return;
      }

      if (!currFullscreen) {
        await videoContainerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }

      set({ fullscreen: !currFullscreen });
    },

    updateCurrentTime: (currentTime) => set({ currentTime }),
    updateVolume: (volume) => set({ volume }),
    updatePaused: (paused) => {
      const video = get().videoRef.current;
      if (!video) {
        return;
      }

      if (paused) {
        video.pause();
      } else {
        video.play();
      }

      set({ paused });
    },

    initializeVideoStore: (data) => set({ ...data }),
    handleVolumeChange: () => {
      set((state) => {
        if (!state.videoRef.current) {
          return state;
        }
        const video = state.videoRef.current;

        let newMuted = video.muted;
        let newVolume = video.volume;

        const isMuteToggle = newMuted !== state.muted;

        if (isMuteToggle && newVolume === 0) {
          newVolume = 0.5;
          newMuted = false;
        }

        if (!isMuteToggle && newVolume !== 0) {
          newMuted = newVolume === 0;
        }

        video.volume = newVolume;
        video.muted = newMuted;

        return { muted: newMuted, volume: newVolume };
      });
    }
  }));
}

const videoContext = createContext<
  ReturnType<typeof createVideoStore> | undefined
>(undefined);

export const VideoProvider = ({
  children,
  videoRef
}: {
  children: React.ReactNode;
  videoRef?: React.RefObject<HTMLVideoElement>;
}) => {
  const storeRef = useRef<ReturnType<typeof createVideoStore>>();

  if (!storeRef.current) {
    storeRef.current = createVideoStore({ videoRef });
  }

  return (
    <videoContext.Provider value={storeRef.current}>
      {children}
    </videoContext.Provider>
  );
};

export function useVideoContext<T>(selector: (state: VideoState) => T): T {
  const store = useContext(videoContext);

  if (!store) {
    throw new Error('Missing VideoContext.Provider in the tree');
  }

  return useStore(store, selector);
}
