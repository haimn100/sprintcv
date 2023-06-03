import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";
import { JobLog, JobLogStatus } from "../types/JobLog";
import { JobLogRepository } from "../data/repositories/JobLogRepository";
import { Provider, ProviderRepository } from "../data/repositories/ProviderRepository";


export type JobArticle = {
    jid: string;
    title: string;
    handle: ElementHandle;
}

abstract class JobProvider {

    protected _page: Page;
    protected _browser: Browser;
    protected _appliedJobs: Set<string>;
    protected _provider: Provider;
    protected _jobLogs: JobLog[] = [];
    protected config: any;

    protected abstract _name: string;
    protected abstract _base: string;
    protected _jobLogRepository: JobLogRepository;
    protected _providerRepository: ProviderRepository;

    constructor(browser: Browser, jobLogRepository: JobLogRepository, providerRepository: ProviderRepository) {
        this._browser = browser;
        this._jobLogRepository = jobLogRepository;
        this._providerRepository = providerRepository;

    }

    get name(): string {
        return this._name;
    }

    get browser(): any {
        return this._browser;
    }

    withLogin(): boolean {
        return true;
    }

    async init(): Promise<void> {
        this._page = await this._browser.newPage();
        await this._page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36');
        this._provider = await this.provider();
        this._appliedJobs = await this._jobLogRepository.getAppliedJobsByProvider(this._provider.id);
    }


    async provider(): Promise<Provider> {
        let prv = await this._providerRepository.findByName(this._name);
        if (!prv) {
            await this._providerRepository.addProvider(this._name);
            prv = await this._providerRepository.findByName(this._name);
        }
        return prv;
    }

    abstract login(username: string, password: string): Promise<void>;

    abstract getJobArticals({ searchTerm }: any): Promise<JobArticle[]>;

    abstract applyForJob(article: JobArticle): Promise<{ ok: boolean, error?: string }>;

    abstract navigateToJobSearchPage(): Promise<void>;

    abstract getSearchTerms(): Promise<string[]>;

    alreadyApplied(jid: string) {
        return this._appliedJobs.has(jid);
    }

    async saveJobLogsToDB(jobs: JobLog[]): Promise<void> {
        if (jobs.length) {
            console.log(`Saving ${jobs.length} jobs to DB...`);
            await this._jobLogRepository.saveJobLogs(jobs)
            console.log(`Saved ${jobs.length} jobs to DB.`);
        }
    }

    async getAppliedJobsIds(): Promise<Set<string>> {
        const provider = await this.provider();
        return await this._jobLogRepository.getAppliedJobsByProvider(provider.id, 200);
    }

    addJobLog(jid: string, title: string, error?: string) {
        this._jobLogs.push({
            jid,
            status: error ? 'error' : 'sent',
            title,
            provider_id: this._provider.id
        })
    }

    /*
        perform any last actions and save to db
    */
    async finish() {
        await this.saveJobLogsToDB(this._jobLogs);
        console.log(`saved ${this._jobLogs.length}`);
    }
}

export default JobProvider;
