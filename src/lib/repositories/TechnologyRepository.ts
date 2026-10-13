import { Technology } from '../models/Technology';
import { Repository, type Row } from './Repository';

export class TechnologyRepository extends Repository<Technology> {
  protected readonly table = 'technologies';
  // Categories appear in the order their first technology was added.
  protected readonly orderBy =
    '(SELECT MIN(id) FROM technologies first WHERE first.category = technologies.category), sort_order, id';

  protected fromRow(row: Row): Technology {
    return new Technology({
      id: row.id as number,
      name: row.name as string,
      category: row.category as string,
      sortOrder: row.sort_order as number,
    });
  }

  protected toColumns(technology: Technology) {
    return { name: technology.name, category: technology.category, sort_order: technology.sortOrder };
  }

  /** Technologies grouped under their category heading, in display order. */
  async listByCategory(): Promise<Map<string, Technology[]>> {
    const groups = new Map<string, Technology[]>();
    for (const technology of await this.list()) {
      groups.set(technology.category, [...(groups.get(technology.category) ?? []), technology]);
    }
    return groups;
  }
}
