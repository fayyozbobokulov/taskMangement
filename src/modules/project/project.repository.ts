import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { BaseRepository } from '../base';
import { KNEX_CONNECTION } from '../knex/constants';
import { Project } from './interface/project.interface';

@Injectable()
export class ProjectRepository extends BaseRepository<Project> {
  constructor(@Inject(KNEX_CONNECTION) knex: Knex) {
    super(knex, 'projects');
  }

  async findByOrganization(orgId: number): Promise<Project[]> {
    return this.query().where('org_id', '=', orgId).select('*') as Promise<
      Project[]
    >;
  }

  async findByCreator(userId: number): Promise<Project[]> {
    return this.query().where('created_by', '=', userId).select('*') as Promise<
      Project[]
    >;
  }

  async findByOrgWithDetails(orgId: number): Promise<any[]> {
    return this.query()
      .select(
        'projects.*',
        'users.name as creator_name',
        'organizations.name as organization_name',
      )
      .where('projects.org_id', '=', orgId)
      .leftJoin('users', 'users.id', 'projects.created_by')
      .leftJoin('organizations', 'organizations.id', 'projects.org_id');
  }
}
