import Mux from '@mux/mux-node';
import { NextResponse } from 'next/server';

const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { uploadId } = await request.json();

    if (!uploadId) {
      return NextResponse.json({ error: 'No upload ID provided' }, { status: 400 });
    }

    // Wait for the upload to complete
    let upload;
    let retries = 0;
    const maxRetries = 10;
    const retryDelay = 2000; // 2 seconds

    while (retries < maxRetries) {
      upload = await muxClient.video.uploads.retrieve(uploadId);

      if (upload.status === 'asset_created') {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      retries++;
    }

    if (!upload || upload.status !== 'asset_created') {
      throw new Error('Upload did not complete in time');
    }

    let asset;

    while (retries < maxRetries) {
      asset = await muxClient.video.assets.retrieve(upload.asset_id!);

      if (asset.status === 'ready') {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      retries++;
    }

    if (!asset || !asset.playback_ids || asset.playback_ids.length === 0) {
      throw new Error('Failed to retrieve Mux asset');
    }

    const playbackId = asset.playback_ids[0].id;

    return NextResponse.json({
      muxPlaybackId: playbackId,
      muxAssetId: asset.id,
      duration: asset.duration,
    });
  } catch (error) {
    console.error('Error creating Mux asset:', error);
    return NextResponse.json(
      {
        error: `Failed to create Mux asset: ${(error as Error).message || 'Unknown error'}`,
      },
      { status: 500 },
    );
  }
}
