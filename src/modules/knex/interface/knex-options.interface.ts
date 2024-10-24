import { ModuleMetadata, Type } from '@nestjs/common';
import { Knex } from 'knex';
import { KnexOptionsFactory } from './knex-options-factory.interface';

export interface KnexModuleOptions extends Knex.Config {
  /**
   * Number of times to retry connecting
   * @default 10
   */
  retryAttempts?: number;

  /**
   * Delay between connection retry attempts (ms)
   * @default 3000
   */
  retryDelay?: number;

  /**
   * If true, connection won't be closed on application shutdown
   * @default false
   */
  keepConnectionAlive?: boolean;

  /**
   * If true, automatically validates connection on connect
   * @default true
   */
  autoValidate?: boolean;

  /**
   * Enable logging of database operations
   * @default false
   */
  debug?: boolean;
}

export interface KnexModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Injection token that will be provided and resolved for factory function
   */
  inject?: any[];

  /**
   * Factory function that returns KnexModuleOptions
   */
  useFactory?: (
    ...args: any[]
  ) => Promise<KnexModuleOptions> | KnexModuleOptions;

  /**
   * Class that implements KnexOptionsFactory to create options
   */
  useClass?: Type<KnexOptionsFactory>;

  /**
   * Existing provider to be used
   */
  useExisting?: Type<KnexOptionsFactory>;
}
