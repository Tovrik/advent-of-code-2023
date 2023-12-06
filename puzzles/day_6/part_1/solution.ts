import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");

const [time, distance] = data.split("\n").map(extractNumbers);

class Race {
  constructor(public duration: number, public record: number) {}

  doesWin(held: number): boolean {
    return held * (this.duration - held) > this.record;
  }

  getNumberOfWaysToWin(): number {
    let count = 0;
    for (let i = 0; i < this.duration; i++) {
      if (this.doesWin(i)) {
        count++;
      }
    }
    return count;
  }
}

const races = time.map((n, i) => {
  return new Race(n, distance[i]);
});

function extractNumbers(input: string): number[] {
  // Regular expression to match numbers in the string
  const numberPattern = /\b\d+\b/g;

  // Find all matches and convert them to numbers
  const matches = input.match(numberPattern);
  if (matches) {
    return matches.map(Number);
  } else {
    return []; // Return an empty array if no numbers are found
  }
}

const num_ways_to_win = races.map((race) => {
  return race.getNumberOfWaysToWin();
});

console.log(num_ways_to_win.reduce((a, b) => a * b, 1));
