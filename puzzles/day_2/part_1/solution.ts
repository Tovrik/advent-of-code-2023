import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");

const rows = data.split("\n");

// * regex for digit followed by the word blue
const blueRegex = /\d+ blue/g;
const redRegex = /\d+ red/g;
const greenRegex = /\d+ green/g;
const gamesRegex = /Game \d+/g;

const maxBlue = 14;
const maxRed = 12;
const maxGreen = 13;

const sum = rows.reduce((acc: number, row: string) => {
  const blueMatches = Array.from(row.matchAll(blueRegex));
  const redMatches = Array.from(row.matchAll(redRegex));
  const greenMatches = Array.from(row.matchAll(greenRegex));

  if (
    blueMatches.every((match) => parseInt(match[0].split(" ")[0]) <= maxBlue) &&
    redMatches.every((match) => parseInt(match[0].split(" ")[0]) <= maxRed) &&
    greenMatches.every((match) => parseInt(match[0].split(" ")[0]) <= maxGreen)
  ) {
    return (acc += parseInt(
      (row.match(gamesRegex)?.toString() ?? "0 0").split(" ")[1]
    ));
  } else return acc;
}, 0);

console.log(sum);
