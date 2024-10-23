import { Inject, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../knex/constants';

export interface BaseEntity {
  id: number;
}
export class BaseRepository<T> {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    private readonly tableName: string,
  ) {}

  // Query Building Methods
  protected query(): Knex.QueryBuilder {
    return this.knex(this.tableName);
  }

  // Basic CRUD Operations
  async findAll(): Promise<T[]> {
    return this.query().select('*');
  }

  async findById(id: number): Promise<T | undefined> {
    return this.query().where({ id }).first();
  }

  async create(data: Partial<T>): Promise<T> {
    const [newRecord] = await this.query().insert(data).returning('*');
    return newRecord;
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    return this.query().insert(data).returning('*');
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    const [updatedRecord] = await this.query()
      .where({ id })
      .update(data)
      .returning('*');

    if (!updatedRecord) {
      throw new NotFoundException(`Record with id ${id} not found`);
    }

    return updatedRecord;
  }

  async updateMany(ids: number[], data: Partial<T>): Promise<T[]> {
    return this.query().whereIn('id', ids).update(data).returning('*');
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.query().where({ id }).delete();

    if (!deleted) {
      throw new NotFoundException(`Record with id ${id} not found`);
    }
  }

  async deleteMany(ids: number[]): Promise<void> {
    await this.query().whereIn('id', ids).delete();
  }

  // Advanced Query Methods
  async findOneBy(conditions: Partial<T>): Promise<T | undefined> {
    return this.query().where(conditions).first();
  }

  async findBy(conditions: Partial<T>): Promise<T[]> {
    return this.query().where(conditions);
  }

  async findIn(column: keyof T, values: any[]): Promise<T[]> {
    return this.query().whereIn(column as string, values);
  }

  async findNotIn(column: keyof T, values: any[]): Promise<T[]> {
    return this.query().whereNotIn(column as string, values);
  }

  // Pagination
  async paginate(
    page: number = 1,
    perPage: number = 10,
  ): Promise<{ data: T[]; total: number; lastPage: number }> {
    const offset = (page - 1) * perPage;
    const [count] = await this.query().count('* as count');
    const total = parseInt(count as any);
    const lastPage = Math.ceil(total / perPage);

    const data = await this.query().offset(offset).limit(perPage);

    return {
      data,
      total,
      lastPage,
    };
  }

  // Aggregation Methods
  async count(column: keyof T = 'id' as keyof T): Promise<number> {
    const result = await this.query()
      .count(`${String(column)} as count`)
      .first();
    return parseInt(result?.count as string);
  }

  async max(column: keyof T): Promise<number> {
    const result = await this.query()
      .max(`${String(column)} as max`)
      .first();
    return result?.max;
  }

  async min(column: keyof T): Promise<number> {
    const result = await this.query()
      .min(`${String(column)} as min`)
      .first();
    return result?.min;
  }

  async avg(column: keyof T): Promise<number> {
    const result = await this.query()
      .avg(`${String(column)} as avg`)
      .first();
    return result?.avg;
  }

  async sum(column: keyof T): Promise<number> {
    const result = await this.query()
      .sum(`${String(column)} as sum`)
      .first();
    return result?.sum;
  }

  // Join Methods
  protected leftJoin<R>(
    tableName: string,
    column1: keyof T | string,
    column2: keyof R | string,
  ): Knex.QueryBuilder {
    return this.query().leftJoin(
      tableName,
      column1 as string,
      column2 as string,
    );
  }

  protected innerJoin<R>(
    tableName: string,
    column1: keyof T | string,
    column2: keyof R | string,
  ): Knex.QueryBuilder {
    return this.query().innerJoin(
      tableName,
      column1 as string,
      column2 as string,
    );
  }

  // Transaction Methods
  async transaction<R>(
    callback: (trx: Knex.Transaction) => Promise<R>,
  ): Promise<R> {
    return this.knex.transaction(callback);
  }

  // Advanced Where Clauses
  async whereBetween(column: keyof T, range: [any, any]): Promise<T[]> {
    return this.query().whereBetween(column as string, range);
  }

  async whereNotBetween(column: keyof T, range: [any, any]): Promise<T[]> {
    return this.query().whereNotBetween(column as string, range);
  }

  async whereNull(column: keyof T): Promise<T[]> {
    return this.query().whereNull(column as string);
  }

  async whereNotNull(column: keyof T): Promise<T[]> {
    return this.query().whereNotNull(column as string);
  }

  // Order Methods
  async orderBy(
    column: keyof T,
    direction: 'asc' | 'desc' = 'asc',
  ): Promise<T[]> {
    return this.query().orderBy(column as string, direction);
  }

  // Group By and Having
  protected groupBy(...columns: (keyof T)[]): Knex.QueryBuilder {
    return this.query().groupBy(columns.map((col) => String(col)));
  }

  protected having(
    column: keyof T,
    operator: string,
    value: any,
  ): Knex.QueryBuilder {
    return this.query().having(column as string, operator, value);
  }

  // Raw Queries
  protected raw(sql: string, bindings?: any[]): Knex.Raw {
    return this.knex.raw(sql, bindings);
  }

  // Upsert
  async upsert(data: Partial<T>, conflictColumns: (keyof T)[]): Promise<T> {
    const [record] = await this.query()
      .insert(data)
      .onConflict(conflictColumns as string[])
      .merge()
      .returning('*');
    return record;
  }

  // Soft Delete (if your table has deleted_at column)
  async softDelete(id: number): Promise<void> {
    await this.update(id, { deleted_at: new Date() } as any);
  }

  // Including soft deleted records
  protected withTrashed(): Knex.QueryBuilder {
    return this.query();
  }

  // Only soft deleted records
  protected onlyTrashed(): Knex.QueryBuilder {
    return this.query().whereNotNull('deleted_at');
  }

  // Restore soft deleted record
  async restore(id: number): Promise<void> {
    await this.update(id, { deleted_at: null } as any);
  }
}
