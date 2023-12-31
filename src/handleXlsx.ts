import xlsx, { CellObject } from 'xlsx';
import axios from 'axios'; //ajax 라이브러리
import { load } from 'cheerio'; //html 파싱

const rangeAddCell = (range: string, cell: string) => {
  const rng = xlsx.utils.decode_range(range);

  const c = typeof cell === 'string' ? xlsx.utils.decode_cell(cell) : cell;
  if (rng.s.r > c.r) rng.s.r = c.r;
  if (rng.s.r > c.c) rng.s.c = c.c;
  if (rng.e.r < c.r) rng.e.r = c.r;
  if (rng.e.c < c.c) rng.e.c = c.c;
  return xlsx.utils.encode_range(rng);
};

export const addToSheet = (sheet: xlsx.WorkSheet, cell: string, type: CellObject['t'], raw: CellObject['v']) => {
  if (sheet['!ref'] === undefined) throw new Error('sheet is undefined');
  sheet['!ref'] = rangeAddCell(sheet['!ref'], cell);
  sheet[cell] = { t: type, v: raw };
};

export const crawler = async () => {
  const workbook = xlsx.readFile('xlsx/data.xlsx');
  const sheet = workbook.Sheets['영화목록'];
  // sheet['!ref'] = 'A2:B11'; //범위변경

  const data = xlsx.utils.sheet_to_json(sheet) as { 제목: string; 링크: string }[];
  // const data2 = xlsx.utils.sheet_to_json(sheet, { header: 'A' }) as { A: string; B: string }[];
  // console.log(data2);

  // data.forEach(({ 제목, 링크 }) => {
  //   // console.log(제목, 링크);
  // });

  // for (const [i, r] of data.entries()) {
  //   // console.log(r.제목, r.링크);
  // }

  addToSheet(sheet, 'C1', 's', '평점');

  await Promise.all(
    data.map(async ({ 제목, 링크 }, i) => {
      const response = await axios.get(링크);
      if (response.status === 200) {
        const html = response.data;
        const $ = load(html);
        const text = $('.inner_cont:nth-child(2) .list_cont:nth-child(1) dd').text();
        const newCell = 'C' + (i + 2);
        addToSheet(sheet, newCell, 'n', parseFloat(text.trim()));
      }
    }),
  );

  await xlsx.writeFile(workbook, 'xlsx/result.xlsx');
};
