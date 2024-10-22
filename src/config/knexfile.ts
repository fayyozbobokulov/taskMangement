/* eslint-disable no-undef */
export default {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin_password',
    database: process.env.DB_NAME || 'project_management_db',
    port: Number(process.env.DB_PORT) || 5432,
  },
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
};
