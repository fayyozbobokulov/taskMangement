/* eslint-disable no-undef */
import type { Knex } from 'knex';

interface KnexConfig {
  [key: string]: Knex.Config;
}

const configs: KnexConfig = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'admin_password',
      database: process.env.DB_NAME || 'project_management_db',
      port: Number(process.env.DB_PORT) || 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './seeds',
    },
    debug: process.env.NODE_ENV === 'development',
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    debug: false,
  },
};

export const getKnexConfig = (
  environment: string = process.env.NODE_ENV || 'development',
): Knex.Config => {
  const config = configs[environment];
  if (!config) {
    throw new Error(`No configuration found for environment: ${environment}`);
  }
  return config;
};

export default configs;
