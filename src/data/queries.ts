import {
  keepPreviousData,
  type QueryClient,
  useQuery,
} from "@tanstack/react-query";
import { db } from "./db";
import {
  GenerationJob,
  PROJECT_PLACEHOLDER,
  VideoKeyFrame,
  VideoTrack,
} from "./schema";

export const queryKeys = {
  projects: ["projects"],
  project: (projectId: string) => ["project", projectId],
  projectJobs: (projectId: string) => ["jobs", projectId],
  projectJob: (projectId: string, jobId: string) => ["job", projectId, jobId],
  projectTracks: (projectId: string) => ["tracks", projectId],
  projectPreview: (projectId: string) => ["preview", projectId],
};

export const refreshVideoCache = async (
  queryClient: QueryClient,
  projectId: string,
) =>
  Promise.all([
    queryClient.invalidateQueries({
      queryKey: queryKeys.projectTracks(projectId),
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.projectPreview(projectId),
    }),
    queryClient.invalidateQueries({
      queryKey: ["frames"],
    }),
  ]);

export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: queryKeys.project(projectId),
    queryFn: async () =>
      (await db.projects.find(projectId)) ?? PROJECT_PLACEHOLDER,
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: db.projects.list,
  });
};

export const useProjectJobs = (projectId: string) => {
  return useQuery({
    queryKey: queryKeys.projectJobs(projectId),
    queryFn: () => db.jobs.jobsByProject(projectId),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });
};

export type VideoCompositionData = {
  tracks: VideoTrack[];
  frames: Record<string, VideoKeyFrame[]>;
  jobs: Record<string, GenerationJob>;
};

export const EMPTY_VIDEO_COMPOSITION: VideoCompositionData = {
  tracks: [],
  frames: {},
  jobs: {},
};

export const useVideoComposition = (projectId: string) =>
  useQuery({
    queryKey: queryKeys.projectPreview(projectId),
    queryFn: async () => {
      const tracks = await db.tracks.tracksByProject(projectId);
      const frames = (
        await Promise.all(
          tracks.map((track) => db.keyFrames.keyFramesByTrack(track.id)),
        )
      ).flatMap((f) => f);
      const jobs = await db.jobs.jobsByProject(projectId);
      return {
        tracks,
        frames: Object.fromEntries(
          tracks.map((track) => [
            track.id,
            frames.filter((f) => f.trackId === track.id),
          ]),
        ),
        jobs: Object.fromEntries(jobs.map((job) => [job.id, job])),
      } satisfies VideoCompositionData;
    },
  });
