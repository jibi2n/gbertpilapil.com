import { optionalText, requiredText, sortOrder } from './validation';

export interface SkillData {
  id?: number | null;
  name: string;
  description?: string;
  sortOrder?: number;
}

/** Something I can do, as opposed to a Technology, which is a tool I use. */
export class Skill {
  readonly id: number | null;
  readonly name: string;
  readonly description: string;
  readonly sortOrder: number;

  constructor(data: SkillData) {
    this.id = data.id ?? null;
    this.name = requiredText(data.name, 'Name');
    this.description = optionalText(data.description);
    this.sortOrder = sortOrder(data.sortOrder);
  }
}
