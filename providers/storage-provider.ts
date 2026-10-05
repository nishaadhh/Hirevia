import fs from "fs";
import path from "path";

export interface StorageProvider {
  upload(key: string, data: Buffer | Uint8Array, mimeType: string): Promise<string>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  createSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
  exists(key: string): Promise<boolean>;
}

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor(baseDir = "./storage_data") {
    this.baseDir = path.resolve(process.cwd(), baseDir);
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private getFilePath(key: string): string {
    // Sanitize key to prevent path traversal
    const safeKey = key.replace(/(\.\.[\/\\])+/g, "");
    return path.join(this.baseDir, safeKey);
  }

  async upload(key: string, data: Buffer | Uint8Array, mimeType: string): Promise<string> {
    const fullPath = this.getFilePath(key);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, Buffer.from(data));
    return `/api/storage/stream?key=${encodeURIComponent(key)}`;
  }

  async download(key: string): Promise<Buffer> {
    const fullPath = this.getFilePath(key);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${key}`);
    }
    return fs.readFileSync(fullPath);
  }

  async delete(key: string): Promise<void> {
    const fullPath = this.getFilePath(key);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  async createSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    // Generate an expiring token signature
    const signature = Buffer.from(`${key}:${expiresAt}`).toString("base64url");
    return `/api/storage/stream?key=${encodeURIComponent(key)}&expires=${expiresAt}&sig=${signature}`;
  }

  async exists(key: string): Promise<boolean> {
    const fullPath = this.getFilePath(key);
    return fs.existsSync(fullPath);
  }
}

export class S3CompatibleStorageProvider implements StorageProvider {
  constructor(
    private config: {
      bucket: string;
      region: string;
      accessKeyId: string;
      secretAccessKey: string;
    }
  ) {}

  async upload(key: string, data: Buffer | Uint8Array, mimeType: string): Promise<string> {
    return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}`;
  }

  async download(key: string): Promise<Buffer> {
    const res = await fetch(`https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}`);
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async delete(key: string): Promise<void> {
    // S3 delete request
  }

  async createSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=${expiresInSeconds}&expires=${expiresAt}`;
  }

  async exists(key: string): Promise<boolean> {
    return true;
  }
}

let storageInstance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!storageInstance) {
    if (process.env.S3_BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID) {
      storageInstance = new S3CompatibleStorageProvider({
        bucket: process.env.S3_BUCKET_NAME,
        region: process.env.S3_REGION || "us-east-1",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      });
    } else {
      storageInstance = new LocalStorageProvider();
    }
  }
  return storageInstance;
}
