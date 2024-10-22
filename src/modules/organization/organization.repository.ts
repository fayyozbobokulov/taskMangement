import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class OrganizationRepository extends BaseRepository<any> {
  constructor(knex: Knex) {
    super(knex, 'organizations');
  }
}
