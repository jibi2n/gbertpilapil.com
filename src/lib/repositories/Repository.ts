export type Row = Record<string, unknown>;
type Columns = Record<string, string | number | null>;

/**
 * Shared database access for one table. Subclasses say which table, how to
 * order it, and how to convert between rows and model objects.
 * Repositories are the only code that talks to D1.
 */
export abstract class Repository<T extends { id: number | null }> {
  protected abstract readonly table: string;
  protected abstract readonly orderBy: string;

  constructor(protected readonly db: D1Database) {}

  protected abstract fromRow(row: Row): T;
  /** Column values to store, without the id. */
  protected abstract toColumns(entity: T): Columns;

  /** Turns rows into models. Override to load related data in bulk. */
  protected async hydrate(rows: Row[]): Promise<T[]> {
    return rows.map((row) => this.fromRow(row));
  }

  protected async query(where = '', ...params: unknown[]): Promise<T[]> {
    const sql = `SELECT * FROM ${this.table} ${where} ORDER BY ${this.orderBy}`;
    const { results } = await this.db.prepare(sql).bind(...params).all<Row>();
    return this.hydrate(results);
  }

  list(): Promise<T[]> {
    return this.query();
  }

  async findById(id: number): Promise<T | null> {
    const [entity] = await this.query('WHERE id = ?', id);
    return entity ?? null;
  }

  async create(entity: T): Promise<T> {
    const columns = this.toColumns(entity);
    const names = Object.keys(columns);
    const sql = `INSERT INTO ${this.table} (${names.join(', ')}) VALUES (${names.map(() => '?').join(', ')}) RETURNING id`;
    const row = await this.db.prepare(sql).bind(...Object.values(columns)).first<{ id: number }>();
    return (await this.findById(row!.id))!;
  }

  async update(entity: T): Promise<T> {
    if (entity.id === null) throw new Error(`Cannot update a ${this.table} row that has no id`);
    const columns = this.toColumns(entity);
    const sql = `UPDATE ${this.table} SET ${Object.keys(columns).map((name) => `${name} = ?`).join(', ')} WHERE id = ?`;
    const { meta } = await this.db.prepare(sql).bind(...Object.values(columns), entity.id).run();
    if (meta.changes === 0) throw new Error(`No ${this.table} row with id ${entity.id}`);
    return (await this.findById(entity.id))!;
  }

  /** Returns false when there was nothing to delete. */
  async delete(id: number): Promise<boolean> {
    const { meta } = await this.db.prepare(`DELETE FROM ${this.table} WHERE id = ?`).bind(id).run();
    return meta.changes > 0;
  }
}
