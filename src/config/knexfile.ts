export default {
  client: 'pg',
  connection: {
    host: 'postgres',
    user: 'admin',
    password: 'admin_password',
    database: 'project_management_db',
  },
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
};
