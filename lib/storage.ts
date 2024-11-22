import { del as vercelDel, put as vercelPut } from '@vercel/blob';

import * as localStorage from './local-blob-storage';

export async function put(fileName: string, file: Buffer): Promise<string> {
  if (process.env.NODE_ENV === 'production') {
    const blob = await vercelPut(fileName, file, { access: 'public' });
    return blob.url;
  } else {
    return localStorage.put(fileName, file);
  }
}

export async function del(url: string): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    await vercelDel(url);
  } else {
    await localStorage.del(url);
  }
}
