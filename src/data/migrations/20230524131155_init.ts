import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('providers', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
    })
        .createTable('job_log', function (table) {
            table.increments('id').primary(); // Creates an 'id' column that auto-increments
            table.string('jid');
            table.string('title');
            table.integer('provider_id').unsigned();
            table.string('status');
            table.string('error');
            table.timestamps(true, true); // Creates 'created_at' and 'updated_at' columns
            table.foreign('provider_id').references('job_providers.id');
            table.unique(['jid', 'provider_id']);
        });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTable('job_providers')
        .dropTable('job_log');
}

