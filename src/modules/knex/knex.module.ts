/* eslint-disable no-undef */
import {
  Module,
  Global,
  DynamicModule,
  Provider,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import knex, { Knex } from 'knex';
import { KNEX_CONNECTION } from './constants';
import { knexConfig } from 'src/config/knexfile';

@Global()
@Module({})
export class KnexModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  static forRoot(config: Knex.Config = knexConfig): DynamicModule {
    const connectionProvider: Provider = {
      provide: KNEX_CONNECTION,
      useFactory: async () => {
        try {
          const connection = knex(config);

          // Test connection
          await connection.raw('SELECT 1');
          console.log('Database connection established successfully');

          return connection;
        } catch (error) {
          console.error('Failed to connect to the database:', error);
          throw error;
        }
      },
    };

    return {
      module: KnexModule,
      providers: [connectionProvider],
      exports: [connectionProvider],
      global: true,
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<Knex.Config> | Knex.Config;
    inject?: any[];
  }): DynamicModule {
    const connectionProvider: Provider = {
      provide: KNEX_CONNECTION,
      useFactory: async (...args: any[]) => {
        try {
          const config = await options.useFactory(...args);
          const connection = knex(config);

          // Test connection
          await connection.raw('SELECT 1');
          console.log('Database connection established successfully');

          return connection;
        } catch (error) {
          console.error('Failed to connect to the database:', error);
          throw error;
        }
      },
      inject: options.inject || [],
    };

    return {
      module: KnexModule,
      providers: [connectionProvider],
      exports: [connectionProvider],
      global: true,
    };
  }

  async onApplicationShutdown() {
    try {
      const connection = this.moduleRef.get<Knex>(KNEX_CONNECTION);
      await connection.destroy();
      console.log('Database connection closed successfully');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
}
