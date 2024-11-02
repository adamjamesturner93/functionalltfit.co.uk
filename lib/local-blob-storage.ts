import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

export async function put(fileName: string, file: Buffer): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filePath = path.join(UPLOAD_DIR, fileName);
  await fs.writeFile(filePath, file);
  return `/uploads/${fileName}`;
}

export async function del(url: string): Promise<void> {
  const fileName = url.split("/").pop();
  if (fileName) {
    const filePath = path.join(UPLOAD_DIR, fileName);
    await fs.unlink(filePath);
  }
}

export async function get(url: string): Promise<Buffer> {
  const fileName = url.split("/").pop();
  if (fileName) {
    const filePath = path.join(UPLOAD_DIR, fileName);
    return fs.readFile(filePath);
  }
  throw new Error("Invalid URL");
}
