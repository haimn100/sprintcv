export default {
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    },
    migrations: {
        directory: './src/data/migrations'
    },
    seeds: {
        directory: './src/data/seeds'
    },
    useNullAsDefault: true
};
