import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('providers').del();

    // Inserts seed entries
    await knex('providers').insert([
        { id: 1, name: 'jobmaster.co.il' },
        { id: 2, name: 'sqlink.com' },
    ]);
}
