import fs from 'fs';
import { parse } from 'csv-parse';

export const getRecordsFromCsv = async () => {
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
