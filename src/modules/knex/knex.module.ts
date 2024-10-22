/* eslint-disable no-undef */
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
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'admin',
            password: process.env.DB_PASSWORD || 'admin_password',
            database: process.env.DB_NAME || 'project_management_db',
            port: Number(process.env.DB_PORT) || 5432,
          },
        });
      },
    },
  ],
  exports: [KNEX_CONNECTION],
})
export class KnexModule {}
