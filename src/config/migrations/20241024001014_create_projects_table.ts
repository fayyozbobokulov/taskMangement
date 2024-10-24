import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('projects', (table) => {
    table.increments('id').primary();
    table.integer('org_id').unsigned().notNullable();
    table.integer('created_by').unsigned().notNullable();
    table.timestamps(true, true);

    // Foreign keys
    table
      .foreign('org_id')
      .references('id')
      .inTable('organizations')
      .onDelete('CASCADE');

    table
      .foreign('created_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('projects');
}
