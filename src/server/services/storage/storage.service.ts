import { IStorageProvider } from './storage.interface';
import { LocalStorageProvider } from './providers/local.provider';
import { S3StorageProvider } from './providers/s3.provider';

let provider: IStorageProvider | null = null;

function select(): IStorageProvider {
  const driver = process.env.STORAGE_DRIVER?.toLowerCase();
  switch (driver) {
    case 's3':
      return new S3StorageProvider();
    case 'local':
    default:
      return new LocalStorageProvider();
  }
}

export const StorageService: IStorageProvider = new Proxy(
  {},
  {
    get(_t, prop: keyof IStorageProvider) {
      if (!provider) provider = select();
      // @ts-expect-error dynamic indexing
      return provider[prop];
    }
  }
) as IStorageProvider;
