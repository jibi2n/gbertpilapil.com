import { readFileSync, readdirSync } from 'node:fs';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { getPlatformProxy } from 'wrangler';
import { Experience } from '../src/lib/models/Experience';
import { Project } from '../src/lib/models/Project';
import { Skill } from '../src/lib/models/Skill';
import { ValidationError } from '../src/lib/models/validation';
import { ExperienceRepository } from '../src/lib/repositories/ExperienceRepository';
import { ProjectRepository } from '../src/lib/repositories/ProjectRepository';
import { SkillRepository } from '../src/lib/repositories/SkillRepository';
import { TechnologyRepository } from '../src/lib/repositories/TechnologyRepository';

// Runs the real migrations and seed file against a throwaway in-memory D1.
let db: D1Database;
let dispose: () => Promise<void>;

async function runSqlFile(path: string) {
  const sql = readFileSync(path, 'utf8').replace(/^\s*--.*$/gm, '');
  const statements = sql.split(/;\s*$/m).map((s) => s.trim()).filter(Boolean);
  await db.batch(statements.map((statement) => db.prepare(statement)));
}

beforeAll(async () => {
  const proxy = await getPlatformProxy<{ DB: D1Database }>({ persist: false });
  db = proxy.env.DB;
  dispose = proxy.dispose;
  for (const file of readdirSync('migrations').sort()) await runSqlFile(`migrations/${file}`);
  await runSqlFile('seed.sql');
});

afterAll(() => dispose());

test('seeded projects load with their technologies, featured ones in order', async () => {
  const projects = new ProjectRepository(db);
  const featured = await projects.listFeatured();
  expect(featured.map((p) => p.slug)).toEqual([
    'sana-ai',
    'dollys-closet',
    'shopzada-data-warehouse',
    'pawsfolio',
    'save-sierra-madre',
    'digimon-pets',
  ]);
  expect(featured[0].technologies).toEqual(
    expect.arrayContaining(['Next.js', 'Tailwind CSS', 'Python', 'Supabase']),
  );
  expect(featured[0].technologies).toHaveLength(4);
  expect((await projects.list()).length).toBeGreaterThan(featured.length);
});

test('a project can be created, updated and deleted', async () => {
  const projects = new ProjectRepository(db);
  const created = await projects.create(
    new Project({ slug: 'test-project', title: 'Test', summary: 'A test', technologies: ['Rust'] }),
  );
  expect(created.id).not.toBeNull();
  expect(created.technologies).toEqual(['Rust']);
  expect(created.featured).toBe(false);

  const updated = await projects.update(
    new Project({ ...created, title: 'Renamed', featured: true, technologies: ['Python', 'SQL'] }),
  );
  expect(updated.title).toBe('Renamed');
  expect(updated.featured).toBe(true);
  expect([...updated.technologies].sort()).toEqual(['Python', 'SQL']);

  expect(await projects.delete(created.id!)).toBe(true);
  expect(await projects.findById(created.id!)).toBeNull();
  expect(await projects.delete(created.id!)).toBe(false);
  const { results } = await db
    .prepare('SELECT * FROM project_technologies WHERE project_id = ?')
    .bind(created.id)
    .all();
  expect(results).toEqual([]);
});

test('a project with an unknown technology is rejected', async () => {
  const projects = new ProjectRepository(db);
  await expect(
    projects.create(
      new Project({ slug: 'bad-tech', title: 'Bad', summary: 'x', technologies: ['COBOL'] }),
    ),
  ).rejects.toThrow(ValidationError);
});

test('models reject bad data', () => {
  expect(() => new Project({ slug: 'Not A Slug', title: 'x', summary: 'x' })).toThrow(ValidationError);
  expect(() => new Project({ slug: 'ok', title: ' ', summary: 'x' })).toThrow(ValidationError);
  expect(() => new Project({ slug: 'ok', title: 'x', summary: 'x', liveUrl: 'javascript:alert(1)' })).toThrow(ValidationError);
  expect(() => new Experience({ role: 'x', organization: 'y', startDate: '2025-13' })).toThrow(ValidationError);
});

test('experience periods read naturally', () => {
  const now = new Date('2026-10-13');
  const period = (startDate: string | null, endDate: string | null) =>
    new Experience({ role: 'r', organization: 'o', startDate, endDate }).period(now);
  expect(period(null, null)).toBe('');
  expect(period('2025-03', null)).toBe('Mar 2025 – Present');
  expect(period('2025-03', '2026-01')).toBe('Mar 2025 – Jan 2026');
  expect(period('2025', '2025')).toBe('2025');
  expect(period(null, '2027-06')).toBe('Expected Jun 2027');
  expect(period(null, '2024-06')).toBe('Jun 2024');
});

test('experiences, skills and technologies round-trip', async () => {
  const experiences = new ExperienceRepository(db);
  const seeded = await experiences.list();
  expect(seeded[0].organization).toBe('University of Santo Tomas');
  const job = await experiences.create(
    new Experience({ role: 'Intern', organization: 'Acme', startDate: '2026-06', sortOrder: 99 }),
  );
  expect((await experiences.list()).at(-1)!.id).toBe(job.id);
  await experiences.delete(job.id!);

  const skills = new SkillRepository(db);
  const skill = await skills.create(new Skill({ name: 'Testing', sortOrder: 99 }));
  expect((await skills.update(new Skill({ ...skill, description: 'Writes tests' }))).description).toBe('Writes tests');
  await skills.delete(skill.id!);

  const groups = await new TechnologyRepository(db).listByCategory();
  expect([...groups.keys()]).toEqual([
    'Languages',
    'Frameworks and libraries',
    'Databases and cloud',
    'DevOps',
    'Tools',
  ]);
  expect(groups.get('Languages')![0].name).toBe('Python');
});
