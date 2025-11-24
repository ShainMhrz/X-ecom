import fs from 'node:fs';
import path from 'node:path';
import { IStorageProvider, UploadResult } from '../storage.interface';

export class LocalStorageProvider implements IStorageProvider {
  private baseDir = path.join(process.cwd(), 'public', 'uploads');

  constructor() {
    if (!fs.existsSync(this.baseDir)) fs.mkdirSync(this.baseDir, { recursive: true });
  }

  async uploadFile(
    data: Buffer,
    options: { path?: string; contentType?: string; public?: boolean }
  ): Promise<UploadResult> {
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.bin`;
    const targetDir = options.path ? path.join(this.baseDir, options.path) : this.baseDir;
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    const filePath = path.join(targetDir, fileName);
    await fs.promises.writeFile(filePath, data);
    const rel = filePath.split(`${path.join(process.cwd(), 'public')}${path.sep}`)[1];
    return { key: rel.replace(/\\/g, '/'), url: `/${rel.replace(/\\/g, '/')}` };
  }

  async deleteFile(key: string): Promise<void> {
    const full = path.join(process.cwd(), 'public', key);
    if (fs.existsSync(full)) await fs.promises.unlink(full);
  }

  getFileUrl(key: string): string {
    return `/${key}`;
  }
}
