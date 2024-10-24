import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.integer('created_by').unsigned().notNullable();
    table.integer('project_id').unsigned().notNullable();
    table.integer('worker_user_id').unsigned().nullable();
    table
      .enum('status', ['CREATED', 'IN_PROCESS', 'DONE'])
      .notNullable()
      .defaultTo('CREATED');
    table.datetime('due_date').nullable();
    table.datetime('done_at').nullable();
    table.timestamps(true, true);

    // Foreign keys
    table
      .foreign('created_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table
      .foreign('project_id')
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE');

    table
      .foreign('worker_user_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
  });

  // Indexes
  await knex.schema.raw(`
    CREATE INDEX idx_tasks_status ON tasks(status);
    CREATE INDEX idx_tasks_project_id ON tasks(project_id);
    CREATE INDEX idx_tasks_worker_user_id ON tasks(worker_user_id);
    CREATE INDEX idx_tasks_due_date ON tasks(due_date);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tasks');
}
