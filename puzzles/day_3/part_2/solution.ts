import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");

const rows = data.split("\n");

interface Point<T> {
  value: T;
  minX: number;
  maxX: number;
  y: number;
}

class Sign implements Point<string> {
  constructor(
    public value: string,
    public minX: number,
    public maxX: number,
    public y: number
  ) {}

  gearRatio(numerals: Numeral[]): number {
    const adjacentParts: Numeral[] = [];
    numerals.forEach((numeral) => {
      if (numeral.findAdjacentSign([this]) !== null) {
        adjacentParts.push(numeral);
      }
    });
    if (adjacentParts.length === 2) {
      return adjacentParts[0].value * adjacentParts[1].value;
    } else return 0;
  }
}

class Numeral implements Point<number> {
  constructor(
    public value: number,
    public minX: number,
    public maxX: number,
    public y: number
  ) {}

  findAdjacentSign(symbols: Sign[]): Sign | null {
    const minX = this.minX ? this.minX - 1 : 0;
    const minY = this.y ? this.y - 1 : 0;

    const maxX = this.maxX + 1;
    const maxY = this.y + 1;

    for (let i = 0; i < symbols.length; i++) {
      if (
        symbols[i].minX >= minX &&
        symbols[i].maxX <= maxX &&
        symbols[i].y >= minY &&
        symbols[i].y <= maxY
      ) {
        return symbols[i];
      }
    }
    return null;
  }
}

const numerals: Numeral[] = [];
const symbols: Sign[] = [];

rows.forEach((row) => {
  const points = row.split("");
  for (let i = 0; i < points.length; i++) {
    if (points[i] !== ".") {
      if (isNaN(parseInt(points[i]))) {
        symbols.push(new Sign(points[i], i, i, rows.indexOf(row)));
      } else {
        const minX = i;
        let maxX = i;
        let num = "";
        while (!isNaN(parseInt(points[i]))) {
          num += points[i];
          i++;
        }
        i--;
        maxX = i;
        numerals.push(
          new Numeral(parseInt(num), minX, maxX, rows.indexOf(row))
        );
      }
    }
  }
});

const valid = numerals.filter((numeral) => {
  return numeral.findAdjacentSign(symbols) !== null;
});

const result = symbols.reduce((acc, symbol) => {
  return (acc += symbol.gearRatio(valid));
}, 0);

console.log(result);
