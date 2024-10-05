import JobProvider, { JobArticle } from "../JobProvider";

export default class JobMaster extends JobProvider {
    protected _base: string = 'https://jobmaster.co.il';
    protected _name: string = "jobmaster.co.il";

    async login(username: string, password: string): Promise<void> {

        await this._page.goto('https://account.jobmaster.co.il/', { timeout: 10000 });
        await this._page.waitForSelector('#email');
        await this._page.type('#email', username);
        await this._page.type('#password', password);
        await this._page.click('input[type="submit"]');
        await this._page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });

        const url = new URL(this._page.url());
        if (url.searchParams.get('err')) {
            throw 'Loginf failed' + url.href;
        }

    }

    async getJobArticals({ searchTerm }: any): Promise<JobArticle[]> {

        const res: JobArticle[] = [];
        await this._page.waitForSelector('#q', { timeout: 10000 });

        await this._page.type('#q', searchTerm);
        await this._page.click('form .HomeSearchBoxBtn button');

        // await this._page.goto(`${this._base}/jobs/?q=${searchTerm}&l=מרכז&headcatnum=15&jobtype=11`);

        await this._page.waitForSelector('article.JobItem', { timeout: 10000 });

        const jobCards = await this._page.$$('article.JobItem');


        for (const article of jobCards) {
            const jid = await article.evaluate((element) => element.id.replace('misra', ''), article);

            if (jid) {

                //get the job title
                const jobTitle = await article.evaluate((e) => e.querySelector('.CardHeader')?.textContent?.trim());

                res.push({
                    jid,
                    title: jobTitle || '',
                    handle: article
                });
            }
        }

        return res;
    }

    async applyForJob(article: JobArticle): Promise<{ ok: boolean; error?: string | undefined; }> {
        try {
            //clicking the job card to open the job description
            // await article.handle.click();
            // //select the job info card that appears on the right side
            // await this._page.waitForSelector('#enterJob');

            // console.log('found #enterJob');
            await this._page.evaluate((jobId: string) => (window as any).applyJob(jobId, null), article.jid);

            //wait for the modal to appear
            await this._page.waitForSelector('#modal_window');
            console.log('found #modal_window.Show');
            //get modal
            const modal = await this._page.$('#modal_window');
            console.log('found modal');
            const hasQuestions = await modal?.$$('div.UpdateGroup.FilterQuestions');
            console.log('found questions', hasQuestions?.length);

            //TODO: handle questions
            if (hasQuestions && hasQuestions?.length > 0) {
                await this._page.click(".bttn.CancelButton");
                return { ok: false, error: 'job have questions' }
            }

            console.log('clicking apply button')

            const applyButton = await modal?.$('button.Finished_Cv_Send');
            await applyButton?.click();
            console.log('clicked apply button');
            return { ok: true }
        } catch (err: any) {
            return { ok: false, error: err.toString() }
        }

    }

    async getSearchTerms(): Promise<string[]> {
        return ['help desk', 'טכנאי מחשבים'];
    }


    async navigateToJobSearchPage(): Promise<void> {
        await this._page.goto(this._base);
    }

    async getPaginationUrls(): Promise<string[]> {
        const links = await this._page.$$('#paging a.paging');
        if (links && links.length > 0) {
            const urls = new Set<string>();
            await Promise.all(links.map(async link => {
                const url = await link.evaluate(el => el.getAttribute('href'));
                if (url) urls.add(`${this._base}${url}`);
            }));
            return [...urls];
        }
        return [];
    }

}