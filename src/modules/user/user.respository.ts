import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { BaseRepository } from '../base';
import { User } from './interface/user.interface';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(knex: Knex) {
    super(knex, 'users');
  }

  async findByRole(role: string): Promise<User[]> {
    const results = await this.query().where({ role });
    return results as User[];
  }

  async findActiveUsersByRole(role: string): Promise<User[]> {
    const results = await this.query()
      .where({ role })
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');
    return results as User[];
  }

  async createUserWithDetails(
    userData: Omit<User, 'id'>,
    details: any,
  ): Promise<User> {
    return this.transaction(async (trx) => {
      const [user] = await trx('users').insert(userData).returning('*');

      await trx('user_details').insert({
        user_id: user.id,
        ...details,
      });

      return user as User;
    });
  }
}
