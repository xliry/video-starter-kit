import { type NextRequest, NextResponse } from 'next/server';

const COMFYUI_API_URL = 'https://bcsrnjrtebmu0x-8188.proxy.runpod.net';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const filename = searchParams.get('filename');
    const subfolder = searchParams.get('subfolder');
    const type = searchParams.get('type');

    if (action === 'image' && filename && type !== null) {
      const params = new URLSearchParams({
        filename: filename as string,
        subfolder: (subfolder as string) || '',
        type: type as string
      });
      const response = await fetch(`${COMFYUI_API_URL}/view?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`ComfyUI API error: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': response.headers.get('content-type') || 'image/png',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    return NextResponse.json({ error: 'Invalid GET request' }, { status: 400 });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, promptId, workflow, clientId } = body;

    if (action === 'submit') {
      // Submit prompt to ComfyUI
      const response = await fetch(`${COMFYUI_API_URL}/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: workflow,
          client_id: clientId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ComfyUI error response:', errorText);
        throw new Error(`ComfyUI API error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Submit result:', JSON.stringify(result));
      return NextResponse.json(result);
    }

    if (action === 'history') {
      // Get history
      console.log('Fetching history for prompt:', promptId);
      const response = await fetch(`${COMFYUI_API_URL}/history/${promptId}`);

      if (!response.ok) {
        console.error('History fetch failed:', response.statusText);
        throw new Error(`ComfyUI API error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('History result:', JSON.stringify(result).substring(0, 500));
      return NextResponse.json(result);
    }

    if (action === 'queue') {
      // Get queue status
      const response = await fetch(`${COMFYUI_API_URL}/queue`);

      if (!response.ok) {
        throw new Error(`ComfyUI API error: ${response.statusText}`);
      }

      const result = await response.json();
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
