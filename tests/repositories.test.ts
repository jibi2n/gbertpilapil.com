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
    expect.arrayContaining(['Next.js', 'FastAPI', 'Python', 'Whisper', 'Supabase']),
  );
  expect(featured[0].technologies).toHaveLength(8);
  expect(featured[0].detailParagraphs).toHaveLength(2);
  expect(featured[0].log).toHaveLength(4);
  expect(featured[0].specializations).toEqual(['AI', 'Web Development']);
  expect((await projects.list()).length).toBeGreaterThan(featured.length);

  // The Projects page shows the showcased ones plus anything marked as listed.
  const listed = await projects.listListed();
  expect(listed.map((p) => p.slug)).toEqual(expect.arrayContaining(['sana-ai', 'pomodoro-app', 'mokuteki']));
});

test('a project can be created, updated and deleted', async () => {
  const projects = new ProjectRepository(db);
  const created = await projects.create(
    new Project({
      slug: 'test-project',
      title: 'Test',
      summary: 'A test',
      technologies: ['Rust'],
      log: ['Did one thing', '  ', 'Did another\nthing'],
      specializations: [' AI ', 'AI', '', 'Web Development'],
    }),
  );
  expect(created.id).not.toBeNull();
  expect(created.technologies).toEqual(['Rust']);
  expect(created.featured).toBe(false);
  expect(created.listed).toBe(true);
  expect(created.specializations).toEqual(['AI', 'Web Development']);

  // Unlisted and not showcased: stored, but off the Projects page.
  await projects.update(new Project({ ...created, listed: false }));
  expect((await projects.listListed()).map((p) => p.slug)).not.toContain('test-project');
  expect(created.log).toEqual(['Did one thing', 'Did another thing']);

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
  expect(seeded[0].role).toBe('Technology and Innovation Intern');
  expect(seeded[0].period()).toBe('Jun 2026 – Aug 2026');
  expect(seeded[0].kind).toBe('experience');
  expect(seeded[0].skills).toContain('Supabase');
  expect(seeded.filter((entry) => entry.kind === 'education').map((entry) => entry.organization)).toEqual([
    'University of Santo Tomas',
  ]);
  expect(seeded.filter((entry) => entry.kind === 'award')).toHaveLength(2);
  const job = await experiences.create(
    new Experience({ role: 'Intern', organization: 'Acme', startDate: '2026-06', sortOrder: 99, skills: [' Go ', '', 'SQL'] }),
  );
  expect(job.kind).toBe('experience');
  expect(job.skills).toEqual(['Go', 'SQL']);
  expect(() => new Experience({ role: 'x', organization: 'y', kind: 'hobby' })).toThrow(ValidationError);
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
    'Data, cloud and DevOps',
    'AI',
    'Tools',
  ]);
  expect(groups.get('Languages')![0].name).toBe('Python');
});

test('the resume store keeps a PDF and rejects anything else', async () => {
  const { ResumeStore } = await import('../src/lib/ResumeStore');
  const proxy = await getPlatformProxy<{ FILES: KVNamespace }>({ persist: false });
  try {
    const store = new ResumeStore(proxy.env.FILES);
    expect(await store.get()).toBeNull();

    const pdf = readFileSync('content/resume.pdf');
    await store.save(pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength) as ArrayBuffer);
    expect((await store.get())!.byteLength).toBe(pdf.byteLength);

    const notPdf = new TextEncoder().encode('<html>not a resume</html>').buffer as ArrayBuffer;
    await expect(store.save(notPdf)).rejects.toThrow(ValidationError);
  } finally {
    await proxy.dispose();
  }
});

test('the image store keeps pictures and rejects other files', async () => {
  const { ImageStore } = await import('../src/lib/ImageStore');
  const proxy = await getPlatformProxy<{ FILES: KVNamespace }>({ persist: false });
  try {
    const store = new ImageStore(proxy.env.FILES);
    const png = readFileSync('public/projects/pawsfolio.webp');
    const bytes = png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength) as ArrayBuffer;

    const url = await store.save('demo', bytes);
    expect(url).toMatch(/^\/media\/demo-\d+\.webp$/);
    const saved = await store.get(url.slice('/media/'.length));
    expect(saved!.type).toBe('image/webp');
    expect(saved!.data.byteLength).toBe(bytes.byteLength);

    // Names that could reach outside the image folder are never looked up.
    expect(await store.get('../resume.pdf')).toBeNull();

    await store.delete(url);
    expect(await store.get(url.slice('/media/'.length))).toBeNull();
    // Pictures shipped with the site are not this store's to delete.
    await store.delete('/projects/pawsfolio.webp');

    const pdf = readFileSync('content/resume.pdf');
    await expect(
      store.save('demo', pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength) as ArrayBuffer),
    ).rejects.toThrow(ValidationError);
  } finally {
    await proxy.dispose();
  }
});
