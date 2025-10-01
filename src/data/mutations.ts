import { fal } from "@/lib/fal";
import { comfyUIService } from "@/lib/comfyui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "./db";
import { queryKeys } from "./queries";
import type { VideoProject } from "./schema";

export const useProjectUpdater = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: Partial<VideoProject>) =>
      db.projects.update(projectId, project),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
};

export const useProjectCreator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: Omit<VideoProject, "id">) =>
      db.projects.create(project),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

type JobCreatorParams = {
  projectId: string;
  endpointId: string;
  mediaType: "video" | "image" | "voiceover" | "music";
  input: Record<string, any>;
};

export const useJobCreator = ({
  projectId,
  endpointId,
  mediaType,
  input,
}: JobCreatorParams) => {
  const queryClient = useQueryClient();

  // Check if this is a ComfyUI endpoint
  const isComfyUI = endpointId.startsWith('comfyui/');

  return useMutation({
    mutationFn: async () => {
      if (isComfyUI) {
        // For ComfyUI, create pending media first, then generate
        const requestId = `comfyui-${Date.now()}`;

        // Create pending media immediately for UI feedback
        await db.media.create({
          projectId,
          createdAt: Date.now(),
          mediaType,
          kind: "generated",
          endpointId,
          requestId,
          status: "pending",
          input,
        });

        // Invalidate to show loading state
        await queryClient.invalidateQueries({
          queryKey: queryKeys.projectMediaItems(projectId),
        });

        // Start generation (this will take time)
        const imageUrl = await comfyUIService.generateImage(
          input.prompt || '',
          input.negative_prompt || '',
          input.width || 1536,
          input.height || 1536
        );

        return {
          request_id: requestId,
          imageUrl,
        };
      }

      // Use fal.ai for other endpoints
      return fal.queue.submit(endpointId, {
        input,
      });
    },
    onSuccess: async (data) => {
      if (isComfyUI) {
        // For ComfyUI, update to completed with image URL
        const allMedia = await db.media.findAll();
        const media = allMedia.find(m => m.requestId === data.request_id);
        if (media) {
          await db.media.update(media.id, {
            status: "completed",
            output: {
              images: [{
                url: (data as any).imageUrl,
                width: input.width || 1536,
                height: input.height || 1536,
              }]
            },
          });
        }
      } else {
        // For fal.ai, create pending media
        await db.media.create({
          projectId,
          createdAt: Date.now(),
          mediaType,
          kind: "generated",
          endpointId,
          requestId: data.request_id,
          status: "pending",
          input,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.projectMediaItems(projectId),
      });
    },
    onError: async (error) => {
      if (isComfyUI) {
        // Mark as failed if generation fails
        const medias = await db.media.findAll();
        const media = medias.find(m => m.projectId === projectId && m.status === 'pending' && m.endpointId === endpointId);
        if (media) {
          await db.media.update(media.id, {
            status: "failed",
          });
          await queryClient.invalidateQueries({
            queryKey: queryKeys.projectMediaItems(projectId),
          });
        }
      }
      console.error('Generation error:', error);
    },
  });
};
