/* eslint-disable no-undef */
import {
  Module,
  Global,
  OnApplicationShutdown,
  Logger,
  DynamicModule,
  Provider,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import knex, { Knex } from 'knex';
import { KNEX_MODULE_OPTIONS, KNEX_CONNECTION } from './constants';
import { sleep } from './utils';
import { KnexModuleOptions, KnexModuleAsyncOptions } from './interface';
import { getKnexConfig } from 'src/config/knexfile';

@Global()
@Module({})
export class KnexModule implements OnApplicationShutdown {
  private readonly logger = new Logger('KnexModule');

  constructor(private readonly moduleRef: ModuleRef) {}

  static forRoot(
    options: KnexModuleOptions = getKnexConfig(process.env.NODE_ENV),
  ): DynamicModule {
    const optionsProvider: Provider = {
      provide: KNEX_MODULE_OPTIONS,
      useValue: options,
    };

    const connectionProvider: Provider = {
      provide: KNEX_CONNECTION,
      useFactory: async () => {
        return await KnexModule.createConnectionFactory(options);
      },
    };

    return {
      module: KnexModule,
      providers: [optionsProvider, connectionProvider],
      exports: [connectionProvider],
      global: true,
    };
  }

  static forRootAsync(options: KnexModuleAsyncOptions): DynamicModule {
    const connectionProvider: Provider = {
      provide: KNEX_CONNECTION,
      useFactory: async (...args: any[]) => {
        const config =
          (await options.useFactory(...args)) ||
          getKnexConfig(process.env.NODE_ENV);
        return await KnexModule.createConnectionFactory(config);
      },
      inject: options.inject || [],
    };

    return {
      module: KnexModule,
      imports: options.imports,
      providers: [connectionProvider],
      exports: [connectionProvider],
      global: true,
    };
  }

  private static async createConnectionFactory(
    options: KnexModuleOptions,
  ): Promise<Knex> {
    const logger = new Logger('KnexModule');
    const retryAttempts = options.retryAttempts ?? 10;
    const retryDelay = options.retryDelay ?? 3000;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const connection = knex(options);

        // Test connection
        await connection.raw('SELECT 1');

        // Setup connection error handler
        connection.on('error', (error) => {
          logger.error(`Database connection error: ${error.message}`);
        });

        logger.log('Database connection established successfully');
        return connection;
      } catch (error) {
        lastError = error;
        logger.error(
          `Failed to connect to database (attempt ${attempt}/${retryAttempts}): ${error.message}`,
        );

        if (attempt === retryAttempts) {
          break;
        }

        await sleep(retryDelay);
      }
    }

    throw new Error(
      `Failed to connect to database after ${retryAttempts} attempts: ${lastError?.message}`,
    );
  }

  async onApplicationShutdown() {
    try {
      const connection = this.moduleRef.get<Knex>(KNEX_CONNECTION);
      const options =
        this.moduleRef.get<KnexModuleOptions>(KNEX_MODULE_OPTIONS);

      if (!options?.keepConnectionAlive) {
        await connection.destroy();
        this.logger.log('Database connection closed successfully');
      }
    } catch (error) {
      this.logger.error('Error closing database connection:', error);
    }
  }
}
