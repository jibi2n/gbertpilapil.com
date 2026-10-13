import { Skill } from '../models/Skill';
import { Repository, type Row } from './Repository';

export class SkillRepository extends Repository<Skill> {
  protected readonly table = 'skills';
  protected readonly orderBy = 'sort_order, id';

  protected fromRow(row: Row): Skill {
    return new Skill({
      id: row.id as number,
      name: row.name as string,
      description: row.description as string,
      sortOrder: row.sort_order as number,
    });
  }

  protected toColumns(skill: Skill) {
    return { name: skill.name, description: skill.description, sort_order: skill.sortOrder };
  }
}
