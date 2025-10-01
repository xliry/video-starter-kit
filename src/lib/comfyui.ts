// Use proxy API to avoid CORS issues
const USE_PROXY = true;
const COMFYUI_API_URL = USE_PROXY ? '/api/comfyui' : 'https://bcsrnjrtebmu0x-8188.proxy.runpod.net';

export interface ComfyUIPromptResponse {
  prompt_id: string;
  number: number;
  node_errors?: Record<string, any>;
}

export interface ComfyUIHistoryResponse {
  [prompt_id: string]: {
    prompt: any;
    outputs: {
      [node_id: string]: {
        images?: Array<{
          filename: string;
          subfolder: string;
          type: string;
        }>;
      };
    };
    status: {
      status_str: string;
      completed: boolean;
    };
  };
}

// WAN 2.2 workflow template (from Wan2.2_Text-To-Image.json)
const WORKFLOW_TEMPLATE = {
  "154": {
    "inputs": {
      "model_name": "4xLSDIR.pth"
    },
    "class_type": "UpscaleModelLoader",
    "_meta": {
      "title": "Upscaler"
    }
  },
  "155": {
    "inputs": {
      "UPSCALE_MODEL": [
        "154",
        0
      ]
    },
    "class_type": "Anything Everywhere",
    "_meta": {
      "title": "Anything Everywhere"
    }
  },
  "224": {
    "inputs": {
      "clip_name": "umt5_xxl_fp8_e4m3fn_scaled.safetensors",
      "type": "wan",
      "device": "default"
    },
    "class_type": "CLIPLoader",
    "_meta": {
      "title": "Load CLIP"
    }
  },
  "225": {
    "inputs": {
      "vae_name": "wan_2.1_vae.safetensors"
    },
    "class_type": "VAELoader",
    "_meta": {
      "title": "Load VAE"
    }
  },
  "226": {
    "inputs": {
      "unet_name": "wan2.2_t2v_high_noise_14B_fp16.safetensors",
      "weight_dtype": "default"
    },
    "class_type": "UNETLoader",
    "_meta": {
      "title": "Load Diffusion Model"
    }
  },
  "227": {
    "inputs": {
      "text": "",
      "clip": [
        "224",
        0
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "Positive Prompt"
    }
  },
  "228": {
    "inputs": {
      "text": "",
      "clip": [
        "224",
        0
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "Negative Prompt"
    }
  },
  "231": {
    "inputs": {
      "CONDITIONING": [
        "228",
        0
      ]
    },
    "class_type": "Prompts Everywhere",
    "_meta": {
      "title": "Prompts Everywhere"
    }
  },
  "252": {
    "inputs": {
      "upscale_method": "lanczos",
      "scale_by": 0.5,
      "image": [
        "269",
        0
      ]
    },
    "class_type": "ImageScaleBy",
    "_meta": {
      "title": "Upscale Image By"
    }
  },
  "256": {
    "inputs": {
      "CLIP": [
        "224",
        0
      ]
    },
    "class_type": "Anything Everywhere",
    "_meta": {
      "title": "Anything Everywhere"
    }
  },
  "257": {
    "inputs": {
      "VAE": [
        "225",
        0
      ]
    },
    "class_type": "Anything Everywhere",
    "_meta": {
      "title": "Anything Everywhere"
    }
  },
  "269": {
    "inputs": {
      "samples": [
        "313",
        1
      ],
      "vae": [
        "225",
        0
      ]
    },
    "class_type": "VAEDecode",
    "_meta": {
      "title": "VAE Decode"
    }
  },
  "282": {
    "inputs": {
      "unet_name": "wan2.2_t2v_low_noise_14B_fp16.safetensors",
      "weight_dtype": "default"
    },
    "class_type": "UNETLoader",
    "_meta": {
      "title": "Load Diffusion Model"
    }
  },
  "302": {
    "inputs": {
      "model": [
        "226",
        0
      ]
    },
    "class_type": "ModelPassThrough",
    "_meta": {
      "title": "ModelPass"
    }
  },
  "307": {
    "inputs": {
      "model": [
        "282",
        0
      ]
    },
    "class_type": "ModelPassThrough",
    "_meta": {
      "title": "ModelPass"
    }
  },
  "310": {
    "inputs": {
      "width": 1536,
      "height": 1536,
      "batch_size": 1
    },
    "class_type": "EmptyLatentImage",
    "_meta": {
      "title": "Image Size"
    }
  },
  "311": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": [
        "269",
        0
      ]
    },
    "class_type": "SaveImage",
    "_meta": {
      "title": "Save Image"
    }
  },
  "312": {
    "inputs": {
      "eta": 0.5,
      "sampler_name": "multistep/res_2m",
      "scheduler": "bong_tangent",
      "steps": 30,
      "steps_to_run": 12,
      "denoise": 1,
      "cfg": 3.0000000000000004,
      "seed": 1059513782545625,
      "sampler_mode": "standard",
      "bongmath": true,
      "model": [
        "314",
        0
      ],
      "positive": [
        "227",
        0
      ],
      "negative": [
        "228",
        0
      ],
      "latent_image": [
        "310",
        0
      ]
    },
    "class_type": "ClownsharKSampler_Beta",
    "_meta": {
      "title": "ClownsharKSampler"
    }
  },
  "313": {
    "inputs": {
      "eta": 0.5,
      "sampler_name": "exponential/res_2s",
      "scheduler": "bong_tangent",
      "steps": 30,
      "steps_to_run": -1,
      "denoise": 1,
      "cfg": 3.0000000000000004,
      "seed": 0,
      "sampler_mode": "resample",
      "bongmath": true,
      "model": [
        "315",
        0
      ],
      "positive": [
        "227",
        0
      ],
      "negative": [
        "228",
        0
      ],
      "latent_image": [
        "312",
        0
      ]
    },
    "class_type": "ClownsharKSampler_Beta",
    "_meta": {
      "title": "ClownsharKSampler"
    }
  },
  "314": {
    "inputs": {
      "sage_attention": "auto",
      "model": [
        "302",
        0
      ]
    },
    "class_type": "PathchSageAttentionKJ",
    "_meta": {
      "title": "Patch Sage Attention KJ"
    }
  },
  "315": {
    "inputs": {
      "sage_attention": "auto",
      "model": [
        "307",
        0
      ]
    },
    "class_type": "PathchSageAttentionKJ",
    "_meta": {
      "title": "Patch Sage Attention KJ"
    }
  }
};

export class ComfyUIService {
  private clientId: string;

  constructor() {
    this.clientId = this.generateClientId();
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Generate a random seed
   */
  private generateSeed(): number {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  /**
   * Submit a prompt to ComfyUI
   */
  async generateImage(
    prompt: string,
    negativePrompt: string = '',
    width: number = 1536,
    height: number = 1536
  ): Promise<string> {
    // Clone the workflow template
    const workflow = JSON.parse(JSON.stringify(WORKFLOW_TEMPLATE));

    // Update prompt
    workflow["227"].inputs.text = prompt;
    workflow["228"].inputs.text = negativePrompt;

    // Update dimensions
    workflow["310"].inputs.width = width;
    workflow["310"].inputs.height = height;

    // Generate random seed
    workflow["312"].inputs.seed = this.generateSeed();

    // Submit prompt
    const response = await fetch(COMFYUI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(USE_PROXY ? {
        action: 'submit',
        workflow,
        clientId: this.clientId,
      } : {
        prompt: workflow,
        client_id: this.clientId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit prompt: ${response.statusText}`);
    }

    const result: ComfyUIPromptResponse = await response.json();

    if (result.node_errors && Object.keys(result.node_errors).length > 0) {
      throw new Error(`Node errors: ${JSON.stringify(result.node_errors)}`);
    }

    if (!result.prompt_id) {
      throw new Error(`No prompt_id in response: ${JSON.stringify(result)}`);
    }

    // Wait for completion and get the image
    return this.waitForCompletion(result.prompt_id);
  }

  /**
   * Poll for completion and return image URL
   */
  private async waitForCompletion(promptId: string): Promise<string> {
    let attempts = 0;
    const maxAttempts = 180; // 3 minutes timeout (1 second interval)
    const checkQueueInterval = 5; // Check queue every 5 attempts

    while (attempts < maxAttempts) {
      // First, try to get history
      const history = await this.getHistory(promptId);

      if (history && history[promptId]) {
        const status = history[promptId].status;

        if (status.completed) {
          const outputs = history[promptId].outputs;

          // Find the SaveImage node output (node 311)
          const saveImageOutput = outputs["311"];

          if (saveImageOutput && saveImageOutput.images && saveImageOutput.images.length > 0) {
            const image = saveImageOutput.images[0];
            return this.getImageUrl(image.filename, image.subfolder, image.type);
          }

          throw new Error('No image found in output');
        }

        if (status.status_str === 'error') {
          throw new Error('Image generation failed');
        }
      }

      // Every 5 attempts, check the queue to see if our job finished
      if (attempts > 0 && attempts % checkQueueInterval === 0) {
        try {
          const queueStatus = await this.checkQueue(promptId);

          // If prompt is not in queue and we've waited at least 45 seconds,
          // assume it completed but history was lost - try to find the image
          if (!queueStatus.inQueue && attempts >= 45) {
            console.log('Prompt not in queue and history empty - attempting to find generated image');

            // Try multiple common filename patterns
            const possibleFilenames = [
              `ComfyUI_${promptId.substring(0, 8)}.png`,
              `ComfyUI_temp_${promptId.substring(0, 8)}.png`,
              `${promptId}.png`,
              // Try with incremental numbers (last 5 images)
              ...Array.from({ length: 5 }, (_, i) => `ComfyUI_${String(i + 1).padStart(5, '0')}_.png`)
            ];

            for (const filename of possibleFilenames) {
              try {
                const imageUrl = this.getImageUrl(filename, '', 'output');
                // Try to fetch the image to verify it exists
                const testResponse = await fetch(imageUrl, { method: 'HEAD' });
                if (testResponse.ok) {
                  console.log(`Found image with filename: ${filename}`);
                  return imageUrl;
                }
              } catch (e) {
                // Continue trying other filenames
              }
            }
          }
        } catch (e) {
          console.error('Failed to check queue:', e);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    // Final attempt: try common filename patterns
    console.log('Timeout reached - attempting final image search');
    const fallbackFilenames = [
      'ComfyUI_00001_.png',
      'ComfyUI_00002_.png',
      'ComfyUI_00003_.png',
      'ComfyUI_00004_.png',
      'ComfyUI_00005_.png',
    ];

    for (const filename of fallbackFilenames) {
      try {
        const imageUrl = this.getImageUrl(filename, '', 'output');
        const testResponse = await fetch(imageUrl, { method: 'HEAD' });
        if (testResponse.ok) {
          console.log(`Found image on timeout with filename: ${filename}`);
          return imageUrl;
        }
      } catch (e) {
        // Continue trying
      }
    }

    throw new Error('Timeout waiting for image generation - no image found');
  }

  /**
   * Get history for a specific prompt
   */
  private async getHistory(promptId: string): Promise<ComfyUIHistoryResponse | null> {
    try {
      const response = await fetch(COMFYUI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'history',
          promptId,
        }),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  /**
   * Construct image URL
   */
  private getImageUrl(filename: string, subfolder: string, type: string): string {
    if (USE_PROXY) {
      // For proxy, we need to fetch through our API
      return `/api/comfyui?action=image&filename=${encodeURIComponent(filename)}&subfolder=${encodeURIComponent(subfolder)}&type=${encodeURIComponent(type)}`;
    }
    const params = new URLSearchParams({
      filename,
      subfolder,
      type,
    });
    return `https://bcsrnjrtebmu0x-8188.proxy.runpod.net/view?${params.toString()}`;
  }

  /**
   * Check if a specific prompt is still in the queue
   */
  private async checkQueue(promptId: string): Promise<{ inQueue: boolean; position?: number }> {
    try {
      const response = await fetch(COMFYUI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'queue',
        }),
      });

      if (!response.ok) {
        return { inQueue: false };
      }

      const queue = await response.json();

      // Check both running and pending queues
      const running = queue.queue_running || [];
      const pending = queue.queue_pending || [];

      for (let i = 0; i < running.length; i++) {
        if (running[i][1] === promptId) {
          return { inQueue: true, position: -1 };
        }
      }

      for (let i = 0; i < pending.length; i++) {
        if (pending[i][1] === promptId) {
          return { inQueue: true, position: i };
        }
      }

      return { inQueue: false };
    } catch (e) {
      console.error('Error checking queue:', e);
      return { inQueue: false };
    }
  }

  /**
   * Get queue status
   */
  async getQueue() {
    const response = await fetch(`${COMFYUI_API_URL}/queue`);
    if (!response.ok) {
      throw new Error(`Failed to get queue: ${response.statusText}`);
    }
    return await response.json();
  }
}

export const comfyUIService = new ComfyUIService();
