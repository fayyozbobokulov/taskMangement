import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('organization_users', (table) => {
    table.increments('id').primary();
    table.integer('org_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.timestamps(true, true);

    // Foreign keys
    table
      .foreign('org_id')
      .references('id')
      .inTable('organizations')
      .onDelete('CASCADE');

    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    // Unique constraint to prevent duplicate assignments
    table.unique(['org_id', 'user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('organization_users');
}
