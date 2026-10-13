import { ValidationError, optionalDate, optionalText, requiredText, sortOrder } from './validation';

/** The section an entry appears under, with the heading shown for it. */
export const EXPERIENCE_KINDS = {
  experience: 'Experience',
  education: 'Education',
  award: 'Awards and activities',
} as const;

export type ExperienceKind = keyof typeof EXPERIENCE_KINDS;

export interface ExperienceData {
  id?: number | null;
  role: string;
  organization: string;
  /** Which section it belongs to. Defaults to 'experience'. */
  kind?: string;
  /** YYYY or YYYY-MM */
  startDate?: string | null;
  /** YYYY or YYYY-MM. Leave empty with a start date to mean "Present". */
  endDate?: string | null;
  description?: string;
  /** Skills used in the role, e.g. ['Next.js', 'Supabase']. */
  skills?: readonly string[];
  sortOrder?: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(date: string): string {
  const [year, month] = date.split('-');
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

export class Experience {
  readonly id: number | null;
  readonly role: string;
  readonly organization: string;
  readonly kind: ExperienceKind;
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly description: string;
  readonly skills: readonly string[];
  readonly sortOrder: number;

  constructor(data: ExperienceData) {
    this.id = data.id ?? null;
    this.role = requiredText(data.role, 'Role or title');
    this.organization = requiredText(data.organization, 'Organization');
    const kind = data.kind ?? 'experience';
    if (!(kind in EXPERIENCE_KINDS)) throw new ValidationError('Section must be Experience, Education or Awards and activities');
    this.kind = kind as ExperienceKind;
    this.startDate = optionalDate(data.startDate, 'Start');
    this.endDate = optionalDate(data.endDate, 'End');
    this.description = optionalText(data.description);
    this.skills = (data.skills ?? []).map((skill) => skill.trim()).filter(Boolean);
    this.sortOrder = sortOrder(data.sortOrder);
  }

  /** Display text for the dates, or '' when none are known. */
  period(now: Date = new Date()): string {
    const { startDate, endDate } = this;
    if (!startDate && !endDate) return '';
    if (startDate && !endDate) return `${formatDate(startDate)} – Present`;
    if (!startDate && endDate) {
      const today = now.toISOString().slice(0, endDate.length);
      return endDate > today ? `Expected ${formatDate(endDate)}` : formatDate(endDate);
    }
    if (startDate === endDate) return formatDate(startDate!);
    return `${formatDate(startDate!)} – ${formatDate(endDate!)}`;
  }
}
