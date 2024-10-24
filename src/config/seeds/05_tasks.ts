import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex('tasks').del();

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Insert seed entries
  await knex('tasks').insert([
    {
      project_id: 1,
      created_by: 2,
      worker_user_id: 3,
      status: 'IN_PROCESS',
      due_date: tomorrow,
      created_at: now,
      updated_at: now,
    },
    {
      project_id: 1,
      created_by: 2,
      worker_user_id: 3,
      status: 'DONE',
      due_date: now,
      done_at: now,
      created_at: now,
      updated_at: now,
    },
    {
      project_id: 2,
      created_by: 3,
      worker_user_id: null,
      status: 'CREATED',
      due_date: nextWeek,
      created_at: now,
      updated_at: now,
    },
    {
      project_id: 3,
      created_by: 4,
      worker_user_id: 4,
      status: 'IN_PROCESS',
      due_date: nextWeek,
      created_at: now,
      updated_at: now,
    },
  ]);
}
