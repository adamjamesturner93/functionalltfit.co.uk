// import Mux from "@mux/mux-node";

// const { video } = new Mux(
//   process.env.MUX_TOKEN_ID!,
//   process.env.MUX_TOKEN_SECRET!
// );

export async function deleteMuxAsset(videoUrl: string) {
  try {
    const assetId = videoUrl.split("/")[4]; // Assuming the URL format is like: https://stream.mux.com/VIDEO_ID.m3u8
    // await video.Assets.del(assetId);
  } catch (error) {
    console.error("Error deleting Mux asset:", error);
    throw error;
  }
}
