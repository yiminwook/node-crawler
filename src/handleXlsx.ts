import xlsx, { CellObject } from 'xlsx';

const rangeAddCell = (range: string, cell: string) => {
  const rng = xlsx.utils.decode_range(range);

  const c = typeof cell === 'string' ? xlsx.utils.decode_cell(cell) : cell;
  if (rng.s.r > c.r) rng.s.r = c.r;
  if (rng.s.r > c.c) rng.s.c = c.c;
  if (rng.e.r < c.r) rng.e.r = c.r;
  if (rng.e.c < c.c) rng.e.c = c.c;
  return xlsx.utils.encode_range(rng);
};

const addToSheet = (sheet: xlsx.WorkSheet, cell: string, type: CellObject['t'], raw: CellObject['v']) => {
  if (sheet['!ref'] === undefined) throw new Error('sheet is undefined');
  sheet['!ref'] = rangeAddCell(sheet['!ref'], cell);
  sheet[cell] = { t: type, v: raw };
};

export default addToSheet;
