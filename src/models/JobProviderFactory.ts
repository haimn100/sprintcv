import knex from "knex";
import { JobLogRepository } from "../data/repositories/JobLogRepository";
import JobProvider from "./JobProvider";
import config from '../../knexfile';  // adjust the path to your knexfile
import { ProviderRepository } from "../data/repositories/ProviderRepository";
import JobMaster from "./providers/JobMaster";
import { SQLink } from "./providers/SQLink";

const db = knex(config);
const providerRepository = new ProviderRepository(db);
const jobLogRepository = new JobLogRepository(db, providerRepository);
export default class JobProviderFactory {

    make(type: string, browser: any): JobProvider {

        switch (type) {
            // case 'linkedin':
            //     return new LinkedIn('linkedin', page);
            case 'jobmaster.co.il':
                return new JobMaster(browser, jobLogRepository, providerRepository);
            case 'sqlink.com':
                return new SQLink(browser, jobLogRepository, providerRepository);
        }
        throw new Error('Invalid provider');
    }

    providersNames(): string[] {
        return [
            'jobmaster.co.il'
        ];
    }
}