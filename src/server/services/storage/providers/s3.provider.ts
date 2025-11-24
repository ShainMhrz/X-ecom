import { IStorageProvider, UploadResult } from '../storage.interface';

export class S3StorageProvider implements IStorageProvider {
  async uploadFile(
    data: Buffer,
    options: { path?: string; contentType?: string; public?: boolean }
  ): Promise<UploadResult> {
    const key = `${options.path ? options.path + '/' : ''}${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
    return {
      key,
      url: process.env.CDN_BASE_URL
        ? `${process.env.CDN_BASE_URL}/${key}`
        : `https://example-s3/${key}`
    };
  }
  async deleteFile(key: string): Promise<void> {
    // implement with AWS SDK if needed
  }
  getFileUrl(key: string): string {
    return process.env.CDN_BASE_URL
      ? `${process.env.CDN_BASE_URL}/${key}`
      : `https://example-s3/${key}`;
  }
}
