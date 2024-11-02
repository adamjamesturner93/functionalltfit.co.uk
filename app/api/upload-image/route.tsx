import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { put as localPut } from "@/lib/local-blob-storage";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    let url: string;

    if (process.env.NODE_ENV === "production") {
      const blob = await put(`images/${nanoid()}-${file.name}`, file, {
        access: "public",
      });
      url = blob.url;
    } else {
      const buffer = Buffer.from(await file.arrayBuffer());
      url = await localPut(`${nanoid()}-${file.name}`, buffer);
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
