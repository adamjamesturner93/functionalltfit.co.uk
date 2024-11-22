import Mux from '@mux/mux-node';
import { NextResponse } from 'next/server';

const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function GET() {
  try {
    const upload = await muxClient.video.uploads.create({
      cors_origin: process.env.NEXT_PUBLIC_APP_URL!,
      new_asset_settings: {
        playback_policy: ['signed'],
      },
    });

    return NextResponse.json({ url: upload.url, id: upload.id });
  } catch (error) {
    console.error('Error creating Mux upload:', error);
    return NextResponse.json({ error: 'Failed to create upload URL' }, { status: 500 });
  }
}
