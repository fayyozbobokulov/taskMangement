import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table
      .enum('role', ['ADMIN', 'ORG_ADMIN_USER', 'ORG_USER'])
      .notNullable()
      .defaultTo('ORG_USER');
    table.integer('created_by').unsigned().nullable();
    table
      .foreign('created_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
