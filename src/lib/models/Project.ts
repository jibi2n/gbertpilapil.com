import { ValidationError, optionalText, optionalUrl, requiredText, sortOrder } from './validation';

export interface ProjectData {
  id?: number | null;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  /** The longer write-up shown in the detail panel. Blank lines separate paragraphs. */
  details?: string;
  /** What I did on the project, one entry each (a mini dev log). */
  log?: readonly string[];
  imageUrl?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
  featured?: boolean;
  sortOrder?: number;
  /** Technology names. Each must exist in the technologies table. */
  technologies?: readonly string[];
}

export class Project {
  readonly id: number | null;
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly description: string;
  readonly details: string;
  readonly log: readonly string[];
  readonly imageUrl: string | null;
  readonly liveUrl: string | null;
  readonly repoUrl: string | null;
  readonly featured: boolean;
  readonly sortOrder: number;
  readonly technologies: readonly string[];

  constructor(data: ProjectData) {
    this.id = data.id ?? null;
    this.slug = requiredText(data.slug, 'slug');
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(this.slug)) {
      throw new ValidationError('slug must be lowercase letters, numbers and hyphens');
    }
    this.title = requiredText(data.title, 'title');
    this.summary = requiredText(data.summary, 'summary');
    this.description = optionalText(data.description);
    this.details = optionalText(data.details);
    // Entries are stored one per line, so an entry can't contain a line break itself.
    this.log = (data.log ?? []).map((entry) => entry.replace(/\s+/g, ' ').trim()).filter(Boolean);
    this.imageUrl = optionalUrl(data.imageUrl, 'imageUrl');
    this.liveUrl = optionalUrl(data.liveUrl, 'liveUrl');
    this.repoUrl = optionalUrl(data.repoUrl, 'repoUrl');
    this.featured = data.featured ?? false;
    this.sortOrder = sortOrder(data.sortOrder);
    this.technologies = [...(data.technologies ?? [])];
  }

  /** Where the project should link out to: the live site if there is one, else the code. */
  get primaryUrl(): string | null {
    return this.liveUrl ?? this.repoUrl;
  }

  /** The details split into paragraphs. */
  get detailParagraphs(): string[] {
    return this.details.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  }
}
