import { Knex } from 'knex';


export interface Provider {
    id: number;
    name: string;
}



export class ProviderRepository {

    private _db: Knex;
    private _cache: any = null;

    constructor(db: Knex) {
        this._db = db;
    }

    async loadCache() {
        this._cache = await this._db('providers').select('*');
    }

    async find() {
        await this.loadCache();
        return this._cache;
    }

    async addProvider(name: string): Promise<number | null> {
        try {
            const ids = await this._db('providers').insert({ name });
            return ids[0];
        } catch { }
        return null;
    }

    async findByName(name: string): Promise<Provider> {
        await this.loadCache();
        return this._cache.find((p: Provider) => p.name === name);

    }

}