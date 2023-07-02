import { parse } from 'csv-parse';
import fs from 'fs';
import xlsx from 'xlsx';

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

const workbook = xlsx.readFile('xlsx/data.xlsx');
const sheet = workbook.Sheets['영화목록'];

const data = xlsx.utils.sheet_to_json(sheet) as { 제목: string; 링크: string }[];

data.forEach(({ 제목, 링크 }) => {
  console.log(제목, 링크);
});

for (const [i, r] of data.entries()) {
  console.log(r.제목, r.링크);
}
