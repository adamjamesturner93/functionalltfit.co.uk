"use server";

import Mux from "@mux/mux-node";

const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function generateMuxUploadUrl() {
  try {
    const resp = await muxClient.video.uploads.create({
      cors_origin: "https://functionallyfit.co.uk",
      new_asset_settings: {
        playback_policy: ["signed"],
        encoding_tier: "baseline",
      },
    });

    return {
      uploadUrl: resp.url,
      uploadId: resp.id,
    };
  } catch (error) {
    console.error("Error generating Mux upload URL:", error);
    throw new Error("Failed to generate upload URL");
  }
}

export async function getPlaybackToken(playbackId: string) {
  return muxClient.jwt.signPlaybackId(playbackId, {
    type: "video",
    expiration: "1d",
    keyId: process.env.MUX_SIGNING_KEY,
  });
}

export async function getAssetDetails(assetId: string) {
  try {
    const asset = await muxClient.video.assets.retrieve(assetId);
    return asset;
  } catch (error) {
    console.error("Error fetching asset details:", error);
    throw new Error("Failed to fetch asset details");
  }
}

export async function deleteAsset(assetId: string) {
  try {
    await muxClient.video.assets.delete(assetId);
  } catch (error) {
    console.error("Error deleting asset:", error);
    throw new Error("Failed to delete asset");
  }
}
