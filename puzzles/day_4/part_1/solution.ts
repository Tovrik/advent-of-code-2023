import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");

const rows = data.split("\n");

class Card {
  private id: number;
  private winningNumbers: number[];
  private scratchNumbers: Map<number, number[]> = new Map();

  constructor(private row: string) {
    const [id, numbers] = row.split(":");
    this.id = parseInt(id.substring(5));
    const [a, b] = numbers.split("|");
    this.winningNumbers = a
      .split(" ")
      .map((n) => parseInt(n))
      .filter((n) => !isNaN(n));
    b.split(" ").forEach((n, i) => {
      const num = parseInt(n);
      if (!isNaN(num)) {
        this.scratchNumbers.set(num, [
          ...(this.scratchNumbers.get(num) || []),
          i,
        ]);
      }
    });
  }

  getScore(): number {
    const numberOfMatches = this.winningNumbers.reduce((acc, n) => {
      const scratch = this.scratchNumbers.get(n);
      if (scratch && scratch.length > 0) {
        return (acc += 1);
      } else return acc;
    }, 0);
    const score = numberOfMatches === 0 ? 0 : Math.pow(2, numberOfMatches - 1);
    return score;
  }
}

const cards = rows.map((row) => new Card(row));
const overallScore = cards.reduce((acc, c) => {
  return (acc += c.getScore());
}, 0);
console.log(overallScore);
