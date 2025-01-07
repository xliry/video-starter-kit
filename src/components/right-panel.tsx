"use client";

import { useProjectUpdater } from "@/data/mutations";
import { useProject, useProjectJobs } from "@/data/queries";
import { PROJECT_PLACEHOLDER } from "@/data/schema";
import { useProjectId, useVideoProjectStore } from "@/data/store";
import {
  ChevronDown,
  FilmIcon,
  FolderOpenIcon,
  GalleryVerticalIcon,
  ImageIcon,
  ImagePlusIcon,
  ListPlusIcon,
  MicIcon,
  MusicIcon,
} from "lucide-react";
import { JobsPanel } from "./jobs-panel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";

export default function RightPanel() {
  const projectId = useProjectId();
  // const [projectTitle, setProjectTitle] = useState("");
  const { data: project = PROJECT_PLACEHOLDER } = useProject(projectId);
  const projectUpdate = useProjectUpdater(projectId);
  const [mediaType, setMediaType] = useState("all");

  const { data: jobs = [], isLoading } = useProjectJobs(projectId);
  const setProjectDialogOpen = useVideoProjectStore(
    (s) => s.setProjectDialogOpen,
  );
  const openGenerateDialog = useVideoProjectStore((s) => s.openGenerateDialog);

  const handleOpenGenerateDialog = () => {
    openGenerateDialog();
  };
  return (
    <div className="flex flex-col border-l border-border w-96">
      <div className="p-4 flex flex-col gap-4 border-b border-border">
        <div className="flex flex-row items-start">
          <h2 className="text-sm text-muted-foreground font-semibold flex-1">
            Project Settings
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setProjectDialogOpen(true)}
          >
            <FolderOpenIcon className="w-4 h-4 opacity-50" />
            Open...
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <Input
            id="projectName"
            name="name"
            placeholder="untitled"
            value={project.title}
            onChange={(e) => projectUpdate.mutate({ title: e.target.value })}
            onBlur={(e) =>
              projectUpdate.mutate({ title: e.target.value.trim() })
            }
          />

          <Textarea
            id="projectDescription"
            name="description"
            placeholder="Describe your video"
            className="resize-none"
            value={project.description}
            rows={6}
            onChange={(e) =>
              projectUpdate.mutate({ description: e.target.value })
            }
            onBlur={(e) =>
              projectUpdate.mutate({ description: e.target.value.trim() })
            }
          />
        </div>
      </div>
      <div className="flex-1 py-4 flex flex-col gap-4 border-b border-border h-full overflow-hidden relative">
        <div className="flex flex-row items-center gap-2 px-4">
          <h2 className="text-sm text-muted-foreground font-semibold flex-1">
            Media Gallery
          </h2>
          {jobs.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenGenerateDialog}
            >
              <ImagePlusIcon className="w-4 h-4 opacity-50" />
              Generate...
            </Button>
          )}
        </div>
        {!isLoading && jobs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-4 px-4">
            <p className="text-sm text-center">
              Create your image, audio and voiceover collection to compose your
              videos
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenGenerateDialog}
            >
              <ImagePlusIcon className="w-4 h-4 opacity-50" />
              Generate...
            </Button>
          </div>
        )}
        <div className="flex justify-end pt-4 w-full px-4 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <ListPlusIcon className="w-4 h-4 opacity-50" />
                <span className="capitalize">{mediaType}</span>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start">
              <DropdownMenuItem
                className="text-sm"
                onClick={() => setMediaType("all")}
              >
                <GalleryVerticalIcon className="w-4 h-4 opacity-50" />
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-sm"
                onClick={() => setMediaType("image")}
              >
                <ImageIcon className="w-4 h-4 opacity-50" />
                Image
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-sm"
                onClick={() => setMediaType("music")}
              >
                <MusicIcon className="w-4 h-4 opacity-50" />
                Music
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-sm"
                onClick={() => setMediaType("voiceover")}
              >
                <MicIcon className="w-4 h-4 opacity-50" />
                Voiceover
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-sm"
                onClick={() => setMediaType("video")}
              >
                <FilmIcon className="w-4 h-4 opacity-50" />
                Video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {jobs.length > 0 && (
          <JobsPanel
            jobs={jobs}
            mediaType={mediaType}
            className="overflow-y-auto"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent via-background via-60% h-8 pointer-events-none" />
      </div>
    </div>
  );
}
