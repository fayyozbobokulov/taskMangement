import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex('projects').del();

  // Insert seed entries
  await knex('projects').insert([
    {
      id: 1,
      org_id: 1,
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      org_id: 1,
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      org_id: 2,
      created_by: 4,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
