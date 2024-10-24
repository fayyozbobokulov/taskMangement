import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { BaseRepository } from '../base/base.repository';
import { Organization } from './interface/organization.interface';
import { KNEX_CONNECTION } from '../knex/constants';

@Injectable()
export class OrganizationRepository extends BaseRepository<Organization> {
  constructor(@Inject(KNEX_CONNECTION) knex: Knex) {
    super(knex, 'organizations');
  }
}
