import fs from 'fs';
import { parse } from 'csv-parse';

export const getRecordsFromCsv = async () => {
  const records: [string, string][] = [];

  const stream = fs.createReadStream('csv/data.csv').pipe(parse({ delimiter: ',' }));

  return new Promise<typeof records>((resolve, reject) => {
    stream.on('data', (csvrow) => records.push(csvrow));
    stream.on('end', () => resolve(records));
    stream.on('error', (error) => reject(error));
  });
};
