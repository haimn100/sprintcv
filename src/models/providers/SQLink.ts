import path from "path";
import JobProvider, { JobArticle } from "@src/models/JobProvider";
import { Page } from "puppeteer";
import { getResumeFilePath, sleep } from "@src/utils";

export class SQLink extends JobProvider {
    protected _name: string = "sqlink.com";
    protected _base: string;

    withLogin(): boolean {
        return false;
    }

    login(username?: string | undefined, password?: string | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getJobArticals({ searchTerm }: any): Promise<JobArticle[]> {

        await this._page.$eval('input#search_input', (input) => input.value = '');
        await this._page.type('input#search_input', searchTerm, { delay: 100 });

        const res: JobArticle[] = [];

        for (const article of await this._page.$$('.positionItem')) {
            const jid = await article.$eval('.article', (div) => div.getAttribute('id')?.replace('id-', ''));
            const title = await article.$eval('a h3', (a) => a.innerText);
            if (jid) {
                res.push({
                    jid,
                    title,
                    handle: article
                });
            }
        }

        return res;
    }

    async applyForJob(article: JobArticle): Promise<{ ok: boolean; error?: string | undefined; }> {

        const url = await article.handle.$eval('.article a', (a) => a.getAttribute('href'));
        const jobPage: Page = await this._browser.newPage();
        try {
            if (url) {
                console.log(url);
                await jobPage.goto(url);
                await sleep(1000);
                await jobPage.$eval('a#sendPopupCVinner', (a) => a.click());
                await jobPage.waitForSelector('.popup_careerc', { visible: true });
                const fileInput = await jobPage.$('.popup_careerc form input[type="file"]');
                const filePath = getResumeFilePath();
                await fileInput?.uploadFile(filePath);
                await sleep(500);
                await jobPage.$eval('.popup_careerc input[type="submit"]', (input: any) => input.click());
                return { ok: true }
            } else {
                return { ok: false, error: 'no link found' };
            }
        } catch (e: any) {
            console.log(e);
            return { ok: false, error: e.toString() }
        } finally {
            await jobPage.close();
        }
    }

    async navigateToJobSearchPage(): Promise<void> {
        await this._page.goto(`${this._base}/career/searchresults/`);
    }
    async getSearchTerms(): Promise<string[]> {
        return ['full stack'];
    }

}