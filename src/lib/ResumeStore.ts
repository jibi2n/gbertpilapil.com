import { ValidationError } from './models/validation';

const KEY = 'resume.pdf';
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Where the resume PDF lives. It is kept in Cloudflare KV rather than in the
 * site's files so it can be replaced without a redeploy: the dashboard will
 * call save() with an uploaded file.
 */
export class ResumeStore {
  constructor(private readonly files: KVNamespace) {}

  /** The PDF's bytes, or null if no resume has been uploaded. */
  get(): Promise<ArrayBuffer | null> {
    return this.files.get(KEY, 'arrayBuffer');
  }

  async save(pdf: ArrayBuffer): Promise<void> {
    // Every PDF file starts with the characters "%PDF-".
    const start = new TextDecoder().decode(pdf.slice(0, 5));
    if (start !== '%PDF-') throw new ValidationError('The resume must be a PDF file');
    if (pdf.byteLength > MAX_BYTES) throw new ValidationError('The resume must be 5 MB or smaller');
    await this.files.put(KEY, pdf);
  }
}
