import { parse } from 'csv-parse';
import fs from 'fs';

const records: [string, string][] = [];

fs.createReadStream('csv/data.csv')
  .pipe(parse({ delimiter: ',' }))
  .on('data', (csvrow) => {
    records.push(csvrow);
  })
  .on('end', () => {
    records.forEach((r, i) => {
      console.log(i, r);
    });
  });
