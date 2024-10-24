import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex('users').del();

  // Insert seed entries
  await knex('users').insert([
    {
      id: 1,
      name: 'System Admin',
      role: 'ADMIN',
      created_by: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: 'John Org Admin',
      role: 'ORG_ADMIN_USER',
      created_by: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      name: 'Alice User',
      role: 'ORG_USER',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 4,
      name: 'Bob User',
      role: 'ORG_USER',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
