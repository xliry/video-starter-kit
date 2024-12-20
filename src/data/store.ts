"use client";

import type { PlayerRef } from "@remotion/player";
import { createContext, useContext } from "react";
import { createStore } from "zustand";
import { useStore } from "zustand/react";

export const LAST_PROJECT_ID_KEY = "__aivs_lastProjectId";

export type MediaType = "image" | "video" | "voiceover" | "music";

interface VideoProjectProps {
  projectId: string;
  projectDialogOpen: boolean;
  player: PlayerRef | null;
  playerCurrentTimestamp: number;
  playerState: "playing" | "paused";
  generateDialogOpen: boolean;
  generateMediaType: MediaType;
  selectedMediaId: string | null;
}

interface VideoProjectState extends VideoProjectProps {
  setProjectId: (projectId: string) => void;
  setProjectDialogOpen: (open: boolean) => void;
  setPlayer: (player: PlayerRef) => void;
  setPlayerCurrentTimestamp: (timestamp: number) => void;
  setPlayerState: (state: "playing" | "paused") => void;
  setGenerateMediaType: (mediaType: MediaType) => void;
  openGenerateDialog: (mediaType?: MediaType) => void;
  closeGenerateDialog: () => void;
  setSelectedMediaId: (mediaId: string | null) => void;
}

const DEFAULT_PROPS: VideoProjectProps = {
  projectId: "",
  projectDialogOpen: false,
  player: null,
  playerCurrentTimestamp: 0,
  playerState: "paused",
  generateDialogOpen: false,
  generateMediaType: "image",
  selectedMediaId: null,
};

type VideoProjectStore = ReturnType<typeof createVideoProjectStore>;

export const createVideoProjectStore = (
  initProps?: Partial<VideoProjectProps>,
) => {
  return createStore<VideoProjectState>()((set, state) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    projectDialogOpen: initProps?.projectId ? false : true,
    setProjectId: (projectId: string) => set({ projectId }),
    setProjectDialogOpen: (projectDialogOpen: boolean) =>
      set({ projectDialogOpen }),
    setPlayer: (player: PlayerRef) => set({ player }),
    setPlayerCurrentTimestamp: (playerCurrentTimestamp: number) =>
      set({ playerCurrentTimestamp }),
    setPlayerState: (playerState: "playing" | "paused") => set({ playerState }),
    setGenerateMediaType: (generateMediaType: MediaType) =>
      set({ generateMediaType }),
    openGenerateDialog: (mediaType) =>
      set({
        generateDialogOpen: true,
        generateMediaType: mediaType ?? state().generateMediaType,
      }),
    closeGenerateDialog: () => set({ generateDialogOpen: false }),
    setSelectedMediaId: (selectedMediaId: string | null) =>
      set({ selectedMediaId }),
  }));
};

export const VideoProjectStoreContext = createContext<VideoProjectStore>(
  createVideoProjectStore(),
);

export function useVideoProjectStore<T>(
  selector: (state: VideoProjectState) => T,
): T {
  const store = useContext(VideoProjectStoreContext);
  return useStore(store, selector);
}

export function useProjectId() {
  return useVideoProjectStore((s) => s.projectId);
}
