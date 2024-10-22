import { Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../knex/constants';

export class BaseRepository<T> {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    private readonly tableName: string, // Table name for the entity
  ) {}

  async findAll(): Promise<T[]> {
    return this.knex(this.tableName).select('*');
  }

  async findById(id: number): Promise<T | undefined> {
    return this.knex(this.tableName).where({ id }).first();
  }

  async create(data: Partial<T>): Promise<T> {
    const [newRecord] = await this.knex(this.tableName)
      .insert(data)
      .returning('*');
    return newRecord;
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    const [updatedRecord] = await this.knex(this.tableName)
      .where({ id })
      .update(data)
      .returning('*');
    return updatedRecord;
  }

  async delete(id: number): Promise<void> {
    await this.knex(this.tableName).where({ id }).del();
  }
}
