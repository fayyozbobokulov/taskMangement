import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex('organizations').del();

  // Insert seed entries
  await knex('organizations').insert([
    {
      id: 1,
      name: 'Tech Solutions Inc',
      created_by: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: 'Digital Services LLC',
      created_by: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
