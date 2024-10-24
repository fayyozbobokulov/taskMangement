import { KnexModuleOptions } from './knex-options.interface';

export interface KnexOptionsFactory {
  createKnexOptions(): Promise<KnexModuleOptions> | KnexModuleOptions;
}
