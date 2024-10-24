import { Knex } from 'knex';
import { BaseRepository } from '../base';
import { OrganizationUser } from './interface/orgazation-user.interface';

export class OrganizationUserRepository extends BaseRepository<OrganizationUser> {
  constructor(knex: Knex) {
    super(knex, 'organization_users');
  }

  async findByOrganization(orgId: number): Promise<OrganizationUser[]> {
    return this.query().where('org_id', '=', orgId).select('*') as Promise<
      OrganizationUser[]
    >;
  }

  async findByUser(userId: number): Promise<OrganizationUser[]> {
    return this.query().where('user_id', '=', userId).select('*') as Promise<
      OrganizationUser[]
    >;
  }

  async findByOrgAndUser(
    orgId: number,
    userId: number,
  ): Promise<OrganizationUser | undefined> {
    return this.query()
      .where('org_id', '=', orgId)
      .where('user_id', '=', userId)
      .first() as Promise<OrganizationUser | undefined>;
  }

  async deleteByOrgAndUser(orgId: number, userId: number): Promise<void> {
    await this.query()
      .where('org_id', '=', orgId)
      .where('user_id', '=', userId)
      .delete();
  }

  async getUsersWithDetails(orgId: number): Promise<any[]> {
    return this.query()
      .select('users.*', 'organization_users.created_at as joined_at')
      .where('organization_users.org_id', '=', orgId)
      .join('users', 'users.id', 'organization_users.user_id');
  }
}
