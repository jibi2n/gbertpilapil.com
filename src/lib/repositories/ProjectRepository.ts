import { Project } from '../models/Project';
import { ValidationError } from '../models/validation';
import { Repository, type Row } from './Repository';

export class ProjectRepository extends Repository<Project> {
  protected readonly table = 'projects';
  protected readonly orderBy = 'sort_order, id';

  protected fromRow(row: Row, technologies: string[] = []): Project {
    return new Project({
      id: row.id as number,
      slug: row.slug as string,
      title: row.title as string,
      summary: row.summary as string,
      description: row.description as string,
      details: row.details as string,
      log: (row.log as string).split('\n'),
      imageUrl: row.image_url as string | null,
      liveUrl: row.live_url as string | null,
      repoUrl: row.repo_url as string | null,
      featured: row.featured === 1,
      listed: row.listed === 1,
      sortOrder: row.sort_order as number,
      technologies,
    });
  }

  protected toColumns(project: Project) {
    return {
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      description: project.description,
      details: project.details,
      log: project.log.join('\n'),
      image_url: project.imageUrl,
      live_url: project.liveUrl,
      repo_url: project.repoUrl,
      featured: project.featured ? 1 : 0,
      listed: project.listed ? 1 : 0,
      sort_order: project.sortOrder,
    };
  }

  /** Loads every project's technology names in one query instead of one per project. */
  protected override async hydrate(rows: Row[]): Promise<Project[]> {
    if (rows.length === 0) return [];
    const { results } = await this.db
      .prepare(
        `SELECT pt.project_id, t.name FROM project_technologies pt
         JOIN technologies t ON t.id = pt.technology_id
         ORDER BY t.category, t.sort_order`,
      )
      .all<{ project_id: number; name: string }>();
    const byProject = new Map<number, string[]>();
    for (const { project_id, name } of results) {
      byProject.set(project_id, [...(byProject.get(project_id) ?? []), name]);
    }
    return rows.map((row) => this.fromRow(row, byProject.get(row.id as number)));
  }

  listFeatured(): Promise<Project[]> {
    return this.query('WHERE featured = 1');
  }

  /** Everything for the Projects page: listed projects, plus showcased ones whatever their setting. */
  listListed(): Promise<Project[]> {
    return this.query('WHERE listed = 1 OR featured = 1');
  }

  override async create(project: Project): Promise<Project> {
    const created = await super.create(project);
    await this.setTechnologies(created.id!, project.technologies);
    return (await this.findById(created.id!))!;
  }

  override async update(project: Project): Promise<Project> {
    await super.update(project);
    await this.setTechnologies(project.id!, project.technologies);
    return (await this.findById(project.id!))!;
  }

  private async setTechnologies(projectId: number, names: readonly string[]): Promise<void> {
    const statements = [
      this.db.prepare('DELETE FROM project_technologies WHERE project_id = ?').bind(projectId),
    ];
    if (names.length > 0) {
      const marks = names.map(() => '?').join(', ');
      const { results } = await this.db
        .prepare(`SELECT id, name FROM technologies WHERE name IN (${marks})`)
        .bind(...names)
        .all<{ id: number; name: string }>();
      const unknown = names.filter((name) => !results.some((tech) => tech.name === name));
      if (unknown.length > 0) {
        throw new ValidationError(`Unknown technologies: ${unknown.join(', ')}`);
      }
      for (const tech of results) {
        statements.push(
          this.db
            .prepare('INSERT INTO project_technologies (project_id, technology_id) VALUES (?, ?)')
            .bind(projectId, tech.id),
        );
      }
    }
    await this.db.batch(statements);
  }
}
