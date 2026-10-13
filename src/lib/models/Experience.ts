import { optionalDate, optionalText, requiredText, sortOrder } from './validation';

export interface ExperienceData {
  id?: number | null;
  role: string;
  organization: string;
  /** YYYY or YYYY-MM */
  startDate?: string | null;
  /** YYYY or YYYY-MM. Leave empty with a start date to mean "Present". */
  endDate?: string | null;
  description?: string;
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
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly description: string;
  readonly sortOrder: number;

  constructor(data: ExperienceData) {
    this.id = data.id ?? null;
    this.role = requiredText(data.role, 'role');
    this.organization = requiredText(data.organization, 'organization');
    this.startDate = optionalDate(data.startDate, 'startDate');
    this.endDate = optionalDate(data.endDate, 'endDate');
    this.description = optionalText(data.description);
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
