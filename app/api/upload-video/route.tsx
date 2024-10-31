import { NextResponse } from "next/server";
import { Mux } from "@mux/mux-node";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const upload = await Video.Uploads.create({
      new_asset_settings: { playback_policy: "public" },
    });

    await Video.Uploads.update(upload.id, {
      data: buffer,
      content_type: file.type,
    });

    const asset = await Video.Assets.get(upload.asset_id!);

    return NextResponse.json({ url: asset.playback_ids![0].playback_url });
  } catch (error) {
    console.error("Error uploading to Mux:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
