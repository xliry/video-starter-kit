"use client";

import BottomBar from "@/components/bottom-bar";
import Header from "@/components/header";
import RightPanel from "@/components/right-panel";
import VideoPreview from "@/components/video-preview";
import {
  VideoProjectStoreContext,
  createVideoProjectStore,
} from "@/data/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";
import { useStore } from "zustand";
import { GenerateDialog } from "./generate-dialog";
import { ProjectDialog } from "./project-dialog";

type AppProps = {
  projectId: string;
};

const queryClient = new QueryClient();

export function App({ projectId }: AppProps) {
  const projectStore = useRef(
    createVideoProjectStore({
      projectId,
    }),
  ).current;
  const projectDialogOpen = useStore(projectStore, (s) => s.projectDialogOpen);
  const generateDialogOpen = useStore(
    projectStore,
    (s) => s.generateDialogOpen,
  );
  return (
    <QueryClientProvider client={queryClient}>
      <VideoProjectStoreContext.Provider value={projectStore}>
        <div className="flex flex-col h-screen bg-background">
          <Header />
          <main className="flex overflow-hidden h-full">
            <div className="flex flex-col flex-1">
              <VideoPreview />
              <BottomBar />
            </div>
            <RightPanel />
          </main>
        </div>
        <ProjectDialog open={projectDialogOpen} />
        <GenerateDialog open={generateDialogOpen} />
      </VideoProjectStoreContext.Provider>
    </QueryClientProvider>
  );
}
