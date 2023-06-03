import puppeteer from 'puppeteer';
import JobProviderFactory from './models/JobProviderFactory';
import { sleep } from './utils';
import providerConfig from './config.js';

async function main() {


    const browser = await puppeteer.launch({
        headless: 'new',
        dumpio: false,
        defaultViewport: {
            height: 879,
            width: 1920
        },
        args: ['--start-maximized'],
        devtools: false
    });


    const factory = new JobProviderFactory();

    for (const providerName of factory.providersNames()) {

        const config = providerConfig.providers.find(p => p.name === providerName);

        console.log(`---- provider ${providerName} ----`);

        const provider = factory.make(providerName, browser);

        //init provider
        await provider.init();

        if (provider.withLogin()) {
            console.log('trying to log in');
            if (config) {
                await provider.login(config?.user, config?.password);
            } else {
                throw 'Missing config for ' + providerName
            }
            console.log('logged in');
        }
        else {
            console.log('without login');
        }
        const searchTerms = await provider.getSearchTerms();
        for (const term of searchTerms) {

            console.log('navigating to search page');
            await provider.navigateToJobSearchPage();

            console.log('searching', term);
            const jobArticles = await provider.getJobArticals({ searchTerm: term });
            console.log(`found ${jobArticles.length} job articles`);
            for (const article of jobArticles) {


                if (provider.alreadyApplied(article.jid)) {
                    console.log(`already applied ${article.jid}`);
                    continue;
                }

                console.log(`trying to apply for ${article.jid} - ${article.title}`);
                const res = await provider.applyForJob(article);
                if (res.ok) {
                    console.log('ok', article.jid);
                    provider.addJobLog(article.jid, article.title);

                } else {
                    console.log('error', res.error);
                }
                await sleep(500);
            }
            await sleep(3000);
        }

        await provider.finish();
        console.log(`---- finished sending for provider ${provider.name} ---- `)
    }
    await browser.close();


    process.exit(0);
}

main().catch(console.error);
