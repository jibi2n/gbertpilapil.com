export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function requiredText(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`${field} is required`);
  }
  return value.trim();
}

export function optionalText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Accepts a full http(s) URL or a site-relative path like /projects/a.webp. */
export function optionalUrl(value: unknown, field: string): string | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string' || !/^(https?:\/\/|\/)\S+$/.test(value.trim())) {
    throw new ValidationError(`${field} must start with https:// or http://`);
  }
  return value.trim();
}

/** Accepts YYYY or YYYY-MM. */
export function optionalDate(value: unknown, field: string): string | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string' || !/^\d{4}(-(0[1-9]|1[0-2]))?$/.test(value)) {
    throw new ValidationError(`${field} must be a year (2026) or a year and month (2026-06)`);
  }
  return value;
}

export function sortOrder(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new ValidationError('Order must be a whole number');
  }
  return value;
}
