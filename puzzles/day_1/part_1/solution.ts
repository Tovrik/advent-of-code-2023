import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");

const rows = data.split("\n");
const result = rows.reduce((acc: number, row: string) => {
  let startIterator = 0;
  let endIterator = row.length - 1;
  let first: number | undefined = undefined;
  let last: number | undefined = undefined;

  while (startIterator < row.length) {
    if (first === undefined && !isNaN(parseInt(row[startIterator]))) {
      first = parseInt(row[startIterator]);
    }
    if (last === undefined && !isNaN(parseInt(row[endIterator]))) {
      last = parseInt(row[endIterator]);
    }
    if (first !== undefined && last !== undefined) {
      break;
    }
    endIterator--;
    startIterator++;
  }

  return acc + parseInt(`${first}${last}`);
}, 0);

console.log(result);
