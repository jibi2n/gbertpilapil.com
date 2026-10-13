import { requiredText, sortOrder } from './validation';

export interface TechnologyData {
  id?: number | null;
  name: string;
  /** Group heading in the Tech Stack section, e.g. "Languages". */
  category: string;
  sortOrder?: number;
}

export class Technology {
  readonly id: number | null;
  readonly name: string;
  readonly category: string;
  readonly sortOrder: number;

  constructor(data: TechnologyData) {
    this.id = data.id ?? null;
    this.name = requiredText(data.name, 'Name');
    this.category = requiredText(data.category, 'Category');
    this.sortOrder = sortOrder(data.sortOrder);
  }
}
