import { ValidationError } from './models/validation';

const MAX_BYTES = 3 * 1024 * 1024;
const PREFIX = 'images/';
/** The public address images are served from (see src/pages/media/[name].ts). */
const PUBLIC_PATH = '/media/';

const TYPES: Record<string, string> = {
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
};

/** Works out the image type from the file's first bytes, not from what the upload claims to be. */
function sniff(bytes: Uint8Array): string | null {
  const ascii = (start: number, length: number) => String.fromCharCode(...bytes.subarray(start, start + length));
  if (bytes[0] === 0x89 && ascii(1, 3) === 'PNG') return 'png';
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpg';
  if (ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') return 'webp';
  return null;
}

/**
 * Project images uploaded from the dashboard. They are kept in Cloudflare KV,
 * next to the resume, and served from /media/<name>.
 */
export class ImageStore {
  constructor(private readonly files: KVNamespace) {}

  /** True for image addresses this store owns (as opposed to files shipped with the site). */
  static owns(url: string | null): url is string {
    return url !== null && url.startsWith(PUBLIC_PATH);
  }

  /**
   * Stores an image and returns the address to use for it. Each upload gets a
   * new name, so browsers can cache images forever without showing a stale one.
   */
  async save(label: string, image: ArrayBuffer): Promise<string> {
    if (image.byteLength > MAX_BYTES) throw new ValidationError('The image must be 3 MB or smaller');
    const extension = sniff(new Uint8Array(image));
    if (!extension) throw new ValidationError('The image must be a PNG, JPEG or WebP file');
    const name = `${label}-${Date.now()}.${extension}`;
    await this.files.put(PREFIX + name, image);
    return PUBLIC_PATH + name;
  }

  /** The image's bytes and type, or null if there is no such image. */
  async get(name: string): Promise<{ data: ArrayBuffer; type: string } | null> {
    const match = /^[a-z0-9-]+\.(webp|png|jpg)$/.exec(name);
    if (!match) return null;
    const data = await this.files.get(PREFIX + name, 'arrayBuffer');
    return data ? { data, type: TYPES[match[1]] } : null;
  }

  /** Removes an image by its address. Addresses this store doesn't own are left alone. */
  async delete(url: string | null): Promise<void> {
    if (ImageStore.owns(url)) await this.files.delete(PREFIX + url.slice(PUBLIC_PATH.length));
  }
}
