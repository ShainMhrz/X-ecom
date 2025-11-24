export interface UploadResult {
  key: string;
  url: string;
}

export interface IStorageProvider {
  uploadFile(
    data: Buffer,
    options: { path?: string; contentType?: string; public?: boolean }
  ): Promise<UploadResult>;
  deleteFile(key: string): Promise<void>;
  getFileUrl(key: string): string;
}
