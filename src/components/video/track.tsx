import type { VideoKeyFrame, VideoTrack } from "@/data/schema";
import { cn, trackIcons } from "@/lib/utils";
import { type HTMLAttributes, createElement } from "react";

// const colors = ["teal", "sky", "violet", "rose", "orange"] as const;
// type VideoTrackColor = (typeof colors)[number];

type VideoTrackViewProps = {
  // color?: VideoTrackColor;
  track: VideoTrack;
  frame: VideoKeyFrame;
} & HTMLAttributes<HTMLDivElement>;

export function VideoTrackView({
  className,
  // color = colors[0],
  track,
  frame,
  ...props
}: VideoTrackViewProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded overflow-hidden",
        // https://tailwindcss.com/docs/content-configuration#dynamic-class-names
        {
          "bg-teal-500 dark:bg-teal-600": track.type === "video",
          "bg-sky-500 dark:bg-sky-600": track.type === "music",
          "bg-violet-500 dark:bg-violet-600": track.type === "voiceover",
        },
        className,
      )}
      {...props}
    >
      <div className="px-2 py-0.5 bg-black/10 flex flex-row items-center">
        <span className="flex flex-row gap-1 text-sm items-center font-semibold text-white/60">
          {createElement(trackIcons[track.type], {
            className: "w-3 h-3 opacity-70 stroke-[3px]",
          } as any)}
          <span>{track.label}</span>
        </span>
      </div>
      <div className="p-px h-10"></div>
    </div>
  );
}
