import { Injectable, Inject } from '@nestjs/common';
import { KNEX_CONNECTION } from '../knex/constants';
import { Knex } from 'knex';

@Injectable()
export class OrganizationRepository {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async findAll(): Promise<any[]> {
    return this.knex('organizations').select('*');
  }

  async findById(id: number): Promise<any> {
    return this.knex('organizations').where({ id }).first();
  }

  async createOrganization(data: any): Promise<any> {
    return this.knex('organizations').insert(data).returning('*');
  }

  async updateOrganization(id: number, data: any): Promise<any> {
    return this.knex('organizations').where({ id }).update(data).returning('*');
  }

  async deleteOrganization(id: number): Promise<void> {
    await this.knex('organizations').where({ id }).del();
  }
}
