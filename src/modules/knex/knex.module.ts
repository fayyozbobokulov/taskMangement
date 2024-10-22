import { Module, Global } from '@nestjs/common';
import knex from 'knex';
import { KNEX_CONNECTION } from './constants';

@Global()
@Module({
  providers: [
    {
      provide: KNEX_CONNECTION,
      useFactory: () => {
        return knex({
          client: 'pg',
          connection: {
            host: 'postgres',
            user: 'admin',
            password: 'admin_password',
            database: 'project_management_db',
          },
        });
      },
    },
  ],
  exports: [KNEX_CONNECTION],
})
export class KnexModule {}
