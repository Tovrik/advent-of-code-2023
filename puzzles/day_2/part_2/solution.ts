import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");

const rows = data.split("\n");

// * regex for digit followed by the word blue
const blueRegex = /\d+ blue/g;
const redRegex = /\d+ red/g;
const greenRegex = /\d+ green/g;
const gamesRegex = /Game \d+/g;

const sum = rows.reduce((acc: number, row: string) => {
  const blueMatches = Array.from(row.matchAll(blueRegex));
  const redMatches = Array.from(row.matchAll(redRegex));
  const greenMatches = Array.from(row.matchAll(greenRegex));

  let minBlue = 0;
  let minRed = 0;
  let minGreen = 0;

  blueMatches.forEach((match) => {
    const num = parseInt(match[0].split(" ")[0]);
    if (minBlue < num) minBlue = num;
  });

  redMatches.forEach((match) => {
    const num = parseInt(match[0].split(" ")[0]);
    if (minRed < num) minRed = num;
  });

  greenMatches.forEach((match) => {
    const num = parseInt(match[0].split(" ")[0]);
    if (minGreen < num) minGreen = num;
  });

  return (acc += minBlue * minRed * minGreen);
}, 0);

console.log(sum);
