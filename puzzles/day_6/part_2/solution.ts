import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");

const [time, distance] = data
  .split("\n")
  .map(extractNumbers)
  .map((n) => {
    return n.reduce((acc, n) => {
      return (acc += n.toString());
    }, "");
  })
  .map(Number);

class CRange {
  constructor(public min: number, public max: number) {}

  getMidPoint(): number {
    return Math.floor((this.max - this.min) / 2) + this.min;
  }

  getLeft(split: number | null = null): CRange {
    return new CRange(this.min, split ?? this.getMidPoint());
  }

  getRight(split: number | null = null): CRange {
    return new CRange((split ?? this.getMidPoint()) + 1, this.max);
  }
}

class Race {
  constructor(public duration: number, public record: number) {}

  doesWin(held: number): boolean {
    return held * (this.duration - held) > this.record;
  }

  isUpperEdge(held: number): boolean {
    if (this.doesWin(held) && !this.doesWin(held + 1)) {
      return true;
    } else return false;
  }

  isLowerEdge(held: number): boolean {
    if (this.doesWin(held) && !this.doesWin(held - 1)) {
      return true;
    } else return false;
  }

  async findUpperEdge(): Promise<number> {
    let range = new CRange(0, this.duration);
    while (true) {
      const midPoint = range.getMidPoint();

      console.log(`Current MidPoint: ${midPoint}`);
      console.log(`Current Range: ${JSON.stringify(range)} \n`);

      if (this.isUpperEdge(midPoint)) {
        return midPoint;
      } else if (this.doesWin(midPoint)) {
        range = range.getRight(midPoint);
      } else {
        range = range.getLeft(midPoint);
      }
    }
  }

  async findLowerEdge(): Promise<number> {
    let range = new CRange(0, this.duration);
    while (true) {
      const midPoint = range.getMidPoint();

      if (this.isLowerEdge(midPoint)) {
        return midPoint;
      } else if (this.doesWin(midPoint)) {
        range = range.getLeft(midPoint);
      } else {
        range = range.getRight(midPoint);
      }
    }
  }
}

const race = new Race(time, distance);

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

(async () => {
  const upperEdge = await race.findUpperEdge();
  const lowerEdge = await race.findLowerEdge();

  console.log(`RESULT: ${upperEdge - lowerEdge + 1}`);
})();
