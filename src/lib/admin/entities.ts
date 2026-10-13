import { EXPERIENCE_KINDS, Experience } from '../models/Experience';
import { Skill } from '../models/Skill';
import { Technology } from '../models/Technology';
import { ExperienceRepository } from '../repositories/ExperienceRepository';
import type { Repository } from '../repositories/Repository';
import { SkillRepository } from '../repositories/SkillRepository';
import { TechnologyRepository } from '../repositories/TechnologyRepository';

/** One input on a dashboard form. */
export interface Field {
  name: string;
  label: string;
  hint?: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  required?: boolean;
  /** The choices, for a 'select' field. */
  options?: { value: string; label: string }[];
}

type Values = Record<string, string>;
type Entity = { id: number | null; sortOrder: number };

/**
 * Everything the dashboard needs to list, add, edit and delete one kind of
 * content. The generic pages under /admin/[kind] are driven by these, so a
 * new kind of content is a new entry here rather than new pages.
 */
export interface EntityConfig<T extends Entity = Entity> {
  /** e.g. "experience entry" */
  singular: string;
  /** e.g. "Experience" */
  plural: string;
  /** Shown under the heading on the dashboard. */
  about: string;
  fields: Field[];
  repository(db: D1Database): Repository<T>;
  /** The name shown in lists and headings. */
  title(entity: T): string;
  /** A short second column for the list. */
  detail(entity: T): string;
  /** Model -> the text that fills the form. */
  toValues(entity: T): Values;
  /** Form text -> model. Throws ValidationError when something is wrong. */
  build(values: Values, id: number | null): T;
  /** Extra warning on the delete button, where deleting has side effects. */
  deleteNote?: string;
  /** Existing values to offer as suggestions for a field, by field name. */
  suggestions?(entities: T[]): Record<string, string[]>;
}

const order: Field = { name: 'sortOrder', label: 'Order', hint: 'Lower numbers come first.', type: 'number' };
const toOrder = (text: string) => Number(text || 0);

const experience: EntityConfig<Experience> = {
  singular: 'experience entry',
  plural: 'Experience',
  about: 'Roles, education, and awards. Each entry appears under the section you pick for it.',
  fields: [
    { name: 'role', label: 'Role or title', type: 'text', required: true },
    { name: 'organization', label: 'Organization', type: 'text', required: true },
    {
      name: 'kind',
      label: 'Section',
      hint: 'Which heading it appears under.',
      type: 'select',
      options: Object.entries(EXPERIENCE_KINDS).map(([value, label]) => ({ value, label })),
    },
    {
      name: 'startDate',
      label: 'Start',
      hint: 'A year (2026) or a year and month (2026-06). Leave Start and End both empty to show no dates.',
      type: 'text',
    },
    {
      name: 'endDate',
      label: 'End',
      hint: 'Leave empty with a Start to show "Present". An End in the future with no Start shows as "Expected".',
      type: 'text',
    },
    { name: 'description', label: 'Description', hint: 'Optional. A sentence or two.', type: 'textarea' },
    {
      name: 'skills',
      label: 'Skills used',
      hint: 'Optional. Separate with commas, for example: Next.js, Supabase, GitHub. Shown as small labels under the entry.',
      type: 'text',
    },
    order,
  ],
  repository: (db) => new ExperienceRepository(db),
  title: (entry) => entry.role,
  detail: (entry) => [EXPERIENCE_KINDS[entry.kind], entry.organization, entry.period()].filter(Boolean).join(', '),
  toValues: (entry) => ({
    role: entry.role,
    organization: entry.organization,
    kind: entry.kind,
    skills: entry.skills.join(', '),
    startDate: entry.startDate ?? '',
    endDate: entry.endDate ?? '',
    description: entry.description,
    sortOrder: String(entry.sortOrder),
  }),
  build: (values, id) =>
    new Experience({
      id,
      role: values.role,
      organization: values.organization,
      kind: values.kind,
      skills: values.skills.split(','),
      startDate: values.startDate,
      endDate: values.endDate,
      description: values.description,
      sortOrder: toOrder(values.sortOrder),
    }),
};

const skills: EntityConfig<Skill> = {
  singular: 'skill',
  plural: 'Skills',
  about: 'The "What I do" section. Their names also appear as chips in the Summary theme.',
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', hint: 'One sentence on what this covers.', type: 'textarea' },
    order,
  ],
  repository: (db) => new SkillRepository(db),
  title: (skill) => skill.name,
  detail: (skill) => skill.description,
  toValues: (skill) => ({ name: skill.name, description: skill.description, sortOrder: String(skill.sortOrder) }),
  build: (values, id) =>
    new Skill({ id, name: values.name, description: values.description, sortOrder: toOrder(values.sortOrder) }),
};

const tech: EntityConfig<Technology> = {
  singular: 'technology',
  plural: 'Tech stack',
  about:
    'The "Tools I use" section, the moving strip in the Summary theme, and the checkboxes on each project. Categories appear in the order their first technology was added.',
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    {
      name: 'category',
      label: 'Category',
      hint: 'Pick an existing one or type a new one. It must match exactly to join an existing group.',
      type: 'text',
      required: true,
    },
    { ...order, hint: 'Its position within the category. Lower numbers come first.' },
  ],
  repository: (db) => new TechnologyRepository(db),
  title: (technology) => technology.name,
  detail: (technology) => technology.category,
  toValues: (technology) => ({
    name: technology.name,
    category: technology.category,
    sortOrder: String(technology.sortOrder),
  }),
  build: (values, id) =>
    new Technology({ id, name: values.name, category: values.category, sortOrder: toOrder(values.sortOrder) }),
  deleteNote: 'It is also removed from every project that lists it.',
  suggestions: (technologies) => ({ category: [...new Set(technologies.map((technology) => technology.category))] }),
};

/** Keyed by the word used in the address: /admin/<kind>/<id>. */
export const entities: Record<string, EntityConfig<any>> = { experience, skills, tech };
