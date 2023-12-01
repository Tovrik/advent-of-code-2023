import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");

function findFirstNumberInString(str: string): number | undefined {
  const numericIndex = str
    .split("")
    .findIndex((char) => !isNaN(parseInt(char)));
  const stringMatch = str.match(
    /zero|one|two|three|four|five|six|seven|eight|nine/
  );

  if (stringMatch && (stringMatch.index ?? 999999) < numericIndex) {
    return stringToNumber(stringMatch[0]);
  } else {
    return parseInt(str[numericIndex]);
  }
}

function findLastNumberInString(str: string): number | undefined {
  const reversed = str.split("").reverse().join("");
  const numericIndex = reversed
    .split("")
    .findIndex((char) => !isNaN(parseInt(char)));
  const stringMatch = reversed.match(
    /eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|orez/
  );

  if (stringMatch && (stringMatch.index ?? 999999) < numericIndex) {
    return stringToNumber(stringMatch[0].split("").reverse().join(""));
  } else {
    return parseInt(reversed[numericIndex]);
  }
}

function stringToNumber(str: string): number | undefined {
  switch (str) {
    case "zero":
      return 0;
    case "one":
      return 1;
    case "two":
      return 2;
    case "three":
      return 3;
    case "four":
      return 4;
    case "five":
      return 5;
    case "six":
      return 6;
    case "seven":
      return 7;
    case "eight":
      return 8;
    case "nine":
      return 9;
    default:
      return undefined;
  }
}

const rows = data.split("\n");
const result = rows.reduce((acc: number, row: string) => {
  const first = findFirstNumberInString(row);
  const last = findLastNumberInString(row);

  return acc + parseInt(`${first}${last}`);
}, 0);

console.log(result);
