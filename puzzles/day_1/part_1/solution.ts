import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");

function findFirstNumberInString(str: string): number | undefined {
  const index = str.split("").findIndex((char) => !isNaN(parseInt(char)));
  return str[index] ? parseInt(str[index]) : undefined;
}

function findLastNumberInString(str: string): number | undefined {
  const reversed = str.split("").reverse();
  const index = reversed.findIndex((char) => !isNaN(parseInt(char)));
  return reversed[index] ? parseInt(reversed[index]) : undefined;
}

const rows = data.split("\n");
const result = rows.reduce((acc: number, row: string) => {
  const first = findFirstNumberInString(row);
  const last = findLastNumberInString(row);

  return acc + parseInt(`${first}${last}`);
}, 0);

console.log(result);
