import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex('organization_users').del();

  // Insert seed entries
  await knex('organization_users').insert([
    {
      org_id: 1,
      user_id: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      org_id: 1,
      user_id: 3,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      org_id: 2,
      user_id: 4,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
