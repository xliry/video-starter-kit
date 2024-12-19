import {
  keepPreviousData,
  type QueryClient,
  useQuery,
} from "@tanstack/react-query";
import { db } from "./db";
import { PROJECT_PLACEHOLDER } from "./schema";

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
