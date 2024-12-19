import type {
  GenerationJob,
  VideoKeyFrame,
  VideoProject,
  VideoTrack,
} from "./schema";

export const MOCK_PROJECT: VideoProject = {
  id: "mock",
  title: "Mock Project",
  description: "A mock project for testing purposes",
  aspectRatio: "16:9",
};

export const MOCK_TRACKS: VideoTrack[] = [
  {
    id: "mock-track-1",
    locked: true,
    label: "video",
    type: "video",
    projectId: MOCK_PROJECT.id,
  },
  {
    id: "mock-track-2",
    locked: true,
    label: "music",
    type: "music",
    projectId: MOCK_PROJECT.id,
  },
  {
    id: "mock-track-3",
    locked: true,
    label: "voiceover",
    type: "voiceover",
    projectId: MOCK_PROJECT.id,
  },
];

export const MOCK_TRACK_FRAMES: Record<string, VideoKeyFrame[]> = {
  "mock-track-1": [
    {
      id: "mock-frame-1",
      timestamp: 0,
      duration: 5000,
      trackId: "mock-track-1",
      data: {
        type: "prompt",
        jobId: "do3yzpwmxu5u",
        prompt: "A prompt for the first clip",
      },
    },
    {
      id: "mock-frame-1-1",
      timestamp: 5001,
      duration: 5000,
      trackId: "mock-track-1",
      data: {
        type: "prompt",
        jobId: "l9zndlhdy2jv",
        prompt: "A prompt for the second clip",
      },
    },
    {
      id: "mock-frame-1-2",
      timestamp: 10001,
      duration: 5000,
      trackId: "mock-track-1",
      data: {
        type: "prompt",
        jobId: "a8zndl3dy2jv",
        prompt: "A prompt for the second clip",
      },
    },
  ],
  "mock-track-2": [
    {
      id: "mock-frame-2",
      timestamp: 0,
      duration: 15000,
      trackId: "mock-track-2",
      data: {
        type: "prompt",
        jobId: "oqtudcgjyqkf",
        prompt:
          "Chill tribal song, with lots of percursion instruments, mixed with eletronic and rock elements. Starts slow and builds up to some high energy beats.",
      },
    },
  ],
  "mock-track-3": [
    {
      id: "mock-frame-3",
      timestamp: 3000,
      duration: 5000,
      trackId: "mock-track-3",
      data: {
        type: "prompt",
        jobId: "bw9qe1hugvkv",
        prompt:
          "I don't really care what you call me. I've been a silent spectator, watching species evolve, empires rise and fall. But always remember, I am mighty and enduring. Respect me and I'll nurture you; ignore me and you shall face the consequences.",
      },
    },
  ],
};

export const MOCK_JOBS: Record<string, GenerationJob> = {
  do3yzpwmxu5u: {
    id: "do3yzpwmxu5u",
    requestId: "mock-request-1",
    endpointId: "mock-endpoint-1",
    createdAt: Date.now() - 1000 * 3,
    endedAt: Date.now(),
    mediaType: "video",
    input: {
      prompt:
        "A close-up dramatic shot of a elf queen, starring at the distance. Her eyes are bright green",
      image_url:
        "https://fal.media/files/lion/ZSq6EuYjW0preTjtq7imL_49c0c8e6dbdd457d8f826a9b9446d7c1.png",
      prompt_optimizer: true,
    },
    output: {
      video: {
        url: "https://fal.media/files/rabbit/RSOVCYsIU8uH3gE6vwp8f_output.mp4",
        content_type: "video/mp4",
        file_name: "output.mp4",
        file_size: 922732,
      },
    },
    projectId: MOCK_PROJECT.id,
    status: "completed",
  },
  l9zndlhdy2jv: {
    id: "l9zndlhdy2jv",
    requestId: "mock-request-1-1",
    endpointId: "mock-endpoint-1-1",
    createdAt: Date.now() - 1000 * 5,
    mediaType: "video",
    input: {
      prompt:
        "An elfic forest, some fog starts to take over the scene while some distant colorful lights can be seen",
      image_url:
        "https://fal.media/files/rabbit/uHmqhuESUKd6JEZ1LSQ26_4414a8ad617b4f18a3d97595d9c93dca.png",
      prompt_optimizer: true,
    },
    output: {
      video: {
        url: "https://fal.media/files/koala/_q0CvZRqWzd2LuF1eUDXl_output.mp4",
        content_type: "video/mp4",
        file_name: "output.mp4",
        file_size: 343347,
      },
    },
    projectId: MOCK_PROJECT.id,
    status: "completed",
  },
  a8zndl3dy2jv: {
    id: "a8zndl3dy2jv",
    requestId: "mock-request-1-1",
    endpointId: "mock-endpoint-1-1",
    createdAt: Date.now() - 1000 * 5,
    mediaType: "video",
    input: {
      prompt:
        "An elfic forest, some fog starts to take over the scene while some distant colorful lights can be seen",
      image_url:
        "https://fal.media/files/rabbit/uHmqhuESUKd6JEZ1LSQ26_4414a8ad617b4f18a3d97595d9c93dca.png",
      prompt_optimizer: true,
    },
    output: {
      video: {
        url: "https://fal.media/files/elephant/ujYTCkYp2KWWkmlkbGfwl_output.mp4",
        content_type: "video/mp4",
        file_name: "output.mp4",
        file_size: 445720,
      },
    },
    projectId: MOCK_PROJECT.id,
    status: "completed",
  },
  oqtudcgjyqkf: {
    id: "oqtudcgjyqkf",
    requestId: "mock-request-2",
    endpointId: "mock-endpoint-2",
    createdAt: Date.now() - 1000 * 5,
    mediaType: "music",
    input: {
      steps: 300,
      prompt: "early morning vibes lo-fi eletronic ambient music, beats",
      seconds_total: 15,
    },
    output: {
      audio_file: {
        url: "https://v2.fal.media/files/4b73d8b280bb460bb8687497e1a8f110_tmp298_for9.wav",
        content_type: "application/octet-stream",
        file_name: "tmp298_for9.wav",
        file_size: 2646078,
      },
    },
    projectId: MOCK_PROJECT.id,
    status: "completed",
  },
  // bw9qe1hugvkv: {
  //   id: "bw9qe1hugvkv",
  //   requestId: "mock-request-3",
  //   endpointId: "mock-endpoint-3",
  //   createdAt: Date.now() - 1000 * 7,
  //   mediaType: "voiceover",
  //   input: {
  //     gen_text: "The world has changed...",
  //     ref_text: "Some call me nature, others call me mother nature.",
  //     model_type: "F5-TTS",
  //     ref_audio_url:
  //       "https://github.com/SWivid/F5-TTS/raw/21900ba97d5020a5a70bcc9a0575dc7dec5021cb/tests/ref_audio/test_en_1_ref_short.wav",
  //     remove_silence: true,
  //   },
  //   output: {
  //     audio_url: {
  //       url: "https://v3.fal.media/files/rabbit/XiKE6MlvKH4H-g-cW3THZ_tmpxn5nvgo7.wav",
  //       content_type: "application/octet-stream",
  //       file_name: "tmpxn5nvgo7.wav",
  //       file_size: 119324,
  //     },
  //   },
  //   projectId: MOCK_PROJECT.id,
  //   status: "completed",
  // },
};
