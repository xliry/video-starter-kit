import { db } from "@/data/db";
import {
  MOCK_JOBS,
  MOCK_PROJECT,
  MOCK_TRACKS,
  MOCK_TRACK_FRAMES,
} from "@/data/mock";
import { queryKeys, useProject } from "@/data/queries";
import {
  type GenerationJob,
  PROJECT_PLACEHOLDER,
  TRACK_TYPE_ORDER,
  type VideoKeyFrame,
  type VideoProject,
  type VideoTrack,
} from "@/data/schema";
import { useProjectId, useVideoProjectStore } from "@/data/store";
import { resolveMediaUrl } from "@/lib/utils";
import { Player, type PlayerRef } from "@remotion/player";
import { preloadVideo, preloadAudio } from "@remotion/preload";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  Sequence,
  Video,
} from "remotion";
import { throttle } from "throttle-debounce";

interface VideoCompositionProps {
  project: VideoProject;
  tracks: VideoTrack[];
  frames: Record<string, VideoKeyFrame[]>;
  jobs: Record<string, GenerationJob>;
}

const FPS = 30;
const DEFAULT_DURATION = 5;
const VIDEO_WIDTH = 1024;
const VIDEO_HEIGHT = 720;

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  project,
  tracks,
  frames,
  jobs,
}) => {
  const sortedTracks = [...tracks].sort((a, b) => {
    return TRACK_TYPE_ORDER[a.type] - TRACK_TYPE_ORDER[b.type];
  });

  return (
    <Composition
      id={project.id}
      component={MainComposition as any}
      durationInFrames={DEFAULT_DURATION * FPS}
      fps={FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      defaultProps={{
        project,
        tracks: sortedTracks,
        frames,
        jobs,
      }}
    />
  );
};

const MainComposition: React.FC<VideoCompositionProps> = ({
  tracks,
  frames,
  jobs,
}) => {
  return (
    <AbsoluteFill>
      {tracks.map((track) => (
        <Sequence key={track.id}>
          {track.type === "video" && (
            <VideoTrackSequence
              track={track}
              frames={frames[track.id] || []}
              jobs={jobs}
            />
          )}
          {track.type === "music" && (
            <MusicTrackSequence
              track={track}
              frames={frames[track.id] || []}
              jobs={jobs}
            />
          )}
          {track.type === "voiceover" && (
            <VoiceoverTrackSequence
              track={track}
              frames={frames[track.id] || []}
              jobs={jobs}
            />
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

interface TrackSequenceProps {
  track: VideoTrack;
  frames: VideoKeyFrame[];
  jobs: Record<string, GenerationJob>;
}

const VideoTrackSequence: React.FC<TrackSequenceProps> = ({ frames, jobs }) => {
  return (
    <AbsoluteFill>
      {frames.map((frame) => {
        const job = jobs[frame.data.jobId];
        if (!job || job.status !== "completed") return null;

        const mediaUrl = resolveMediaUrl(job.output);
        if (!mediaUrl) return null;

        return (
          <Sequence
            key={frame.id}
            from={Math.floor(frame.timestamp / (1000 / FPS))}
          >
            {job.mediaType === "video" && <Video src={mediaUrl} />}
            {job.mediaType === "image" && (
              <Img src={mediaUrl} style={{ objectFit: "cover" }} />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const MusicTrackSequence: React.FC<TrackSequenceProps> = ({ frames, jobs }) => {
  return (
    <>
      {frames.map((frame) => {
        const job = jobs[frame.data.jobId];
        if (!job || job.status !== "completed") return null;

        const audioUrl = job.output?.audio_file?.url;
        if (!audioUrl) return null;

        return (
          <Sequence
            key={frame.id}
            from={Math.floor(frame.timestamp / (1000 / FPS))}
          >
            <Audio src={audioUrl} />
          </Sequence>
        );
      })}
    </>
  );
};

const VoiceoverTrackSequence: React.FC<TrackSequenceProps> = ({
  frames,
  jobs,
}) => {
  return (
    <>
      {frames.map((frame) => {
        const job = jobs[frame.data.jobId];
        if (!job || job.status !== "completed") return null;

        const audioUrl = job.output?.audio_url?.url;
        if (!audioUrl) return null;

        return (
          <Sequence
            key={frame.id}
            from={Math.floor(frame.timestamp / (1000 / FPS))}
          >
            <Audio src={audioUrl} />
          </Sequence>
        );
      })}
    </>
  );
};

type VideoCompositionData = {
  tracks: VideoTrack[];
  frames: Record<string, VideoKeyFrame[]>;
  jobs: Record<string, GenerationJob>;
};

const EMPTY_COMPOSITION: VideoCompositionData = {
  tracks: [],
  frames: {},
  jobs: {},
};

export default function VideoPreview() {
  const projectId = useProjectId();
  const setPlayer = useVideoProjectStore((s) => s.setPlayer);

  const { data: project = PROJECT_PLACEHOLDER } = useProject(projectId);
  const { data: composition = EMPTY_COMPOSITION } = useQuery({
    queryKey: queryKeys.projectPreview(projectId),
    queryFn: async () => {
      const tracks = await db.tracks.tracksByProject(projectId);
      const frames = (
        await Promise.all(
          tracks.map((track) => db.keyFrames.keyFramesByTrack(track.id)),
        )
      ).flatMap((f) => f);
      const jobs = await db.jobs.jobsByProject(projectId);
      // return {
      //   tracks: MOCK_TRACKS,
      //   frames: MOCK_TRACK_FRAMES,
      //   jobs: MOCK_JOBS,
      // };
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
  const { tracks = [], frames = {}, jobs = {} } = composition;
  useEffect(() => {
    const jobIds = Object.values(frames)
      .flatMap((f) => f)
      .map((f) => f.data.jobId);
    Object.values(jobs)
      .filter((job) => job.status === "completed" && jobIds.includes(job.id))
      .forEach((job) => {
        // if (job.output?.video?.url) {
        //   preloadVideo(job.output.video.url);
        // }
        // if (job.output?.audio_file?.url) {
        //   preloadAudio(job.output.audio_file.url);
        // }
        // if (job.output?.audio_url?.url) {
        //   preloadAudio(job.output.audio_url.url);
        // }
      });
  }, [frames]);

  // Calculate the effective duration based on the latest keyframe
  const calculateDuration = useCallback(() => {
    let maxTimestamp = 0;
    Object.values(frames).forEach((trackFrames) => {
      trackFrames.forEach((frame) => {
        maxTimestamp = Math.max(maxTimestamp, frame.timestamp);
      });
    });
    // Add 5 seconds padding after the last frame
    return Math.max(DEFAULT_DURATION, Math.ceil((maxTimestamp + 5000) / 1000));
  }, [frames]);

  const duration = calculateDuration();

  const setPlayerCurrentTimestamp = useVideoProjectStore(
    (s) => s.setPlayerCurrentTimestamp,
  );

  const setPlayerState = useVideoProjectStore((s) => s.setPlayerState);
  // Frame updates are super frequent, so we throttle the updates to the timestamp
  const updatePlayerCurrentTimestamp = useCallback(
    throttle(64, setPlayerCurrentTimestamp),
    [],
  );

  // Register events on the player
  const playerRef = useCallback((player: PlayerRef) => {
    if (!player) return;
    setPlayer(player);
    player.addEventListener("play", (e) => {
      setPlayerState("playing");
    });
    player.addEventListener("pause", (e) => {
      setPlayerState("paused");
    });
    player.addEventListener("seeked", (e) => {
      const currentFrame = e.detail.frame;
      updatePlayerCurrentTimestamp(currentFrame / FPS);
    });
    player.addEventListener("frameupdate", (e) => {
      const currentFrame = e.detail.frame;
      updatePlayerCurrentTimestamp(currentFrame / FPS);
    });
  }, []);

  return (
    <div className="flex-grow flex-1 h-full flex items-center justify-center bg-background-dark dark:bg-background-light">
      <div className="w-3/5 aspect-video relative">
        <Player
          ref={playerRef}
          component={MainComposition}
          inputProps={{
            project,
            tracks,
            frames,
            jobs,
          }}
          durationInFrames={duration * FPS}
          fps={FPS}
          compositionWidth={VIDEO_WIDTH}
          compositionHeight={VIDEO_HEIGHT}
          style={{
            width: "100%",
            height: "100%",
          }}
          clickToPlay={true}
          showPosterWhenPaused={false}
          autoPlay={false}
          loop={false}
          controls={false}
        />
      </div>
    </div>
  );
}
