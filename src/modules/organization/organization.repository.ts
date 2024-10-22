import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { BaseRepository } from '../base/base.repository';
import { Organization } from './interface/organization.interface';

@Injectable()
export class OrganizationRepository extends BaseRepository<Organization> {
  constructor(knex: Knex) {
    super(knex, 'organizations');
  }
}
