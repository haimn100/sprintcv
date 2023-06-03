import { Knex } from 'knex';
import { JobLog } from '../../types/JobLog';
import fs from 'fs';
import path from 'path';
import { IRepository } from './IRepository';

const rootPath = path.dirname(path.resolve(process.cwd(), 'package.json'));

const resourceFolder = path.resolve(rootPath, 'resources');


export class JobLogRepository implements IRepository<JobLog> {
    private _db: Knex;
    private _table = 'job_log';
    private _providersRepository;

    constructor(db: Knex, providersRepository: any) {
        this._db = db;
        this._providersRepository = providersRepository;
    }

    async getAppliedJobsByProvider(provider_id: number, limit?: number): Promise<Set<string>> {

        const idsSet = new Set<string>();
        const ids = await this._db(this._table)
            .where({ provider_id })
            .orderBy('created_at', 'desc')
            .limit(limit || 100)
            .select(['jid']);
        ids.forEach(item => idsSet.add(item.jid));
        return idsSet;
    }

    find(query: {}): Promise<JobLog> {
        throw new Error('Method not implemented.');
    }

    async findAll(): Promise<JobLog[]> {
        return await this._db(this._table).select('*');
    }

    findById(id: number): Promise<JobLog> {
        throw new Error('Method not implemented.');
    }

    async saveJobLogs(jobLogs: JobLog[]): Promise<void> {
        await this._db(this._table).insert(jobLogs).onConflict(['jid', 'provider_id']).merge();
    }

    async getJobLogsByProvider(provider_id: number, page: number, pageSize: number): Promise<JobLog[]> {
        const offset = (page - 1) * pageSize;
        const jobLogs = await this._db(this._table)
            .where({ provider_id })
            .limit(pageSize)
            .offset(offset);
        return jobLogs;
    }


}
