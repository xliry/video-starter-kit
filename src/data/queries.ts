import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { db } from "./db";
import { PROJECT_PLACEHOLDER } from "./schema";

export const queryKeys = {
  projects: ["projects"],
  project: (projectId: string) => ["project", projectId],
  projectJobs: (projectId: string) => ["jobs", projectId],
  projectJob: (projectId: string, jobId: string) => ["job", projectId, jobId],
};

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
