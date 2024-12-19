import { db } from "@/data/db";
import { queryKeys } from "@/data/queries";
import type { GenerationJob } from "@/data/schema";
import { useProjectId } from "@/data/store";
import { fal } from "@/lib/fal";
import { cn, trackIcons } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, formatDuration } from "date-fns";
import { CircleXIcon, HourglassIcon } from "lucide-react";
import {
  type DragEventHandler,
  Fragment,
  type HTMLAttributes,
  createElement,
  useMemo,
} from "react";
import { Badge } from "./ui/badge";
import { LoadingIcon } from "./ui/icons";
import { Separator } from "./ui/separator";

type JobItemProps = {
  data: GenerationJob;
} & HTMLAttributes<HTMLDivElement>;

export function JobItem({ data, className, ...props }: JobItemProps) {
  const isDone = data.status === "completed" || data.status === "failed";
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  useQuery({
    queryKey: queryKeys.projectJob(projectId, data.id),
    queryFn: async () => {
      const queueStatus = await fal.queue.status(data.endpointId, {
        requestId: data.requestId,
      });
      if (queueStatus.status === "IN_PROGRESS") {
        await db.jobs.update(data.id, {
          ...data,
          status: "running",
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.projectJobs(data.projectId),
        });
      }
      if (queueStatus.status === "COMPLETED") {
        try {
          const result = await fal.queue.result(data.endpointId, {
            requestId: data.requestId,
          });
          await db.jobs.update(data.id, {
            ...data,
            output: result.data,
            endedAt: Date.now(),
            status: "completed",
          });
        } catch {
          await db.jobs.update(data.id, {
            ...data,
            endedAt: Date.now(),
            status: "failed",
          });
        } finally {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.projectJobs(data.projectId),
          });
        }
      }
      return null;
    },
    enabled: !isDone,
    refetchInterval: data.mediaType === "video" ? 20000 : 500,
  });
  const mediaUrl = Array.isArray(data.output?.images)
    ? data.output.images[0].url
    : "";
  const jobId = data.id.split("-")[0];
  const handleOnDragStart: DragEventHandler<HTMLDivElement> = (event) => {
    event.dataTransfer.setData("job", JSON.stringify(data));
    return true;
    // event.dataTransfer.dropEffect = "copy";
  };
  return (
    <div
      className={cn(
        "flex items-start space-x-2 py-2 px-4 hover:bg-accent transition-all",
        className,
      )}
      {...props}
      draggable={data.status === "completed"}
      onDragStart={handleOnDragStart}
    >
      <div className="w-16 h-16 aspect-square rounded overflow-hidden">
        {data.status === "completed" ? (
          <>
            {data.mediaType === "image" && (
              <img
                src={mediaUrl}
                alt="Generated media"
                className="h-full w-full object-cover"
              />
            )}
            {data.mediaType !== "image" && (
              <div className="w-full h-full bg-white/5 flex items-center justify-center text-muted-foreground">
                {createElement(trackIcons[data.mediaType], {
                  className: "w-8 h-8",
                } as any)}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center text-muted-foreground">
            {data.status === "running" && <LoadingIcon className="w-8 h-8" />}
            {data.status === "pending" && <HourglassIcon className="w-8 h-8" />}
            {data.status === "failed" && (
              <CircleXIcon className="w-8 h-8 text-rose-700" />
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col h-full gap-1 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex flex-row gap-1 items-center">
            {createElement(trackIcons[data.mediaType], {
              className: "w-4 h-4 stroke-1",
            } as any)}
            Job <code className="text-muted-foreground">#{jobId}</code>
          </h3>
          <Badge
            variant="outline"
            className={cn({
              "text-rose-700": data.status === "failed",
              "text-sky-500": data.status === "running",
              "text-muted-foreground": data.status === "pending",
            })}
          >
            {data.status}
          </Badge>
        </div>
        <div className="flex flex-row gap-2 justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(data.createdAt, { addSuffix: true })}
          </span>
          {!!data.endedAt && (
            <span className="text-xs text-muted-foreground">
              {formatDuration({
                seconds: (data.endedAt - data.createdAt) / 1000,
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

type JobsPanelProps = {
  jobs: GenerationJob[];
} & HTMLAttributes<HTMLDivElement>;

export function JobsPanel({ className, jobs }: JobsPanelProps) {
  return (
    <div className={cn("flex flex-col overflow-hidden", className)}>
      {jobs.map((job, index) => (
        <Fragment key={job.id}>
          <JobItem data={job} />
          {index < jobs.length - 1 && (
            <Separator className="px-2 ms-20 max-w-full" />
          )}
        </Fragment>
      ))}
    </div>
  );
}
