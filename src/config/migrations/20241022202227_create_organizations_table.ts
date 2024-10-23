import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('organizations', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('created_by').unsigned().notNullable();
    table
      .foreign('created_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table.timestamps(true, true); // This creates both created_at and updated_at columns
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('organizations');
}
