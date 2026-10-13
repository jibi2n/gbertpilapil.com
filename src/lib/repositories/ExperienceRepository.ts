import { Experience } from '../models/Experience';
import { Repository, type Row } from './Repository';

export class ExperienceRepository extends Repository<Experience> {
  protected readonly table = 'experiences';
  protected readonly orderBy = 'sort_order, id';

  protected fromRow(row: Row): Experience {
    return new Experience({
      id: row.id as number,
      role: row.role as string,
      organization: row.organization as string,
      kind: row.kind as string,
      startDate: row.start_date as string | null,
      endDate: row.end_date as string | null,
      description: row.description as string,
      // Stored one skill per line.
      skills: (row.skills as string).split('\n'),
      sortOrder: row.sort_order as number,
    });
  }

  protected toColumns(experience: Experience) {
    return {
      role: experience.role,
      organization: experience.organization,
      kind: experience.kind,
      start_date: experience.startDate,
      end_date: experience.endDate,
      description: experience.description,
      skills: experience.skills.join('\n'),
      sort_order: experience.sortOrder,
    };
  }
}
