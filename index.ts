import { getRecordsFromCsv } from '@/handleCsv';
import puppeteer from 'puppeteer';

const crawler = async () => {
  try {
    const records = await getRecordsFromCsv();
    const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === 'production' }); //브라우저가 보이도록 오픈

    await Promise.all(
      records.map(async ([title, url], i) => {
        try {
          const page = await browser.newPage();
          await page.goto(url);
          const scoreEl = await page.$('.inner_cont:nth-child(2) .list_cont:nth-child(1) dd');
          if (!scoreEl) throw new Error(`${title} cant loaded`);
          const text = await scoreEl.evaluate((el) => el.textContent);
          console.log(text?.trim());
          await page.close();
        } catch (error) {
          console.log(error);
        }
      }),
    );

    await browser.close();
  } catch (error) {
    console.log(error);
  }
};

crawler();
