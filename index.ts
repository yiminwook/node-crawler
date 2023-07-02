import { parse } from 'csv-parse';
import fs from 'fs';
import xlsx from 'xlsx';
import axios from 'axios'; //ajax 라이브러리
import { load } from 'cheerio'; //html 파싱

const getRecordsFromCsv = async () => {
  const records: [string, string][] = [];

  fs.createReadStream('csv/data.csv')
    .pipe(parse({ delimiter: ',' }))
    .on('data', (csvrow) => {
      records.push(csvrow);
    })
    .on('end', () => {
      records.forEach((r, i) => {
        // console.log(i, r);
      });
    });

  return records;
};

const workbook = xlsx.readFile('xlsx/data.xlsx');
const sheet = workbook.Sheets['영화목록'];

const data = xlsx.utils.sheet_to_json(sheet) as { 제목: string; 링크: string }[];

data.forEach(({ 제목, 링크 }) => {
  // console.log(제목, 링크);
});

for (const [i, r] of data.entries()) {
  // console.log(r.제목, r.링크);
}

const crawler = async () => {
  await Promise.all(
    data.map(async ({ 제목, 링크 }, i) => {
      const response = await axios.get(링크);
      if (response.status === 200) {
        const html = response.data;
        const $ = load(html);
        const text = $('.inner_cont:nth-child(2) .list_cont:nth-child(1) dd').text();
        console.log(제목, 링크, text);
      }
    }),
  );
};

crawler();
