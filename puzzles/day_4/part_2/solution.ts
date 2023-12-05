import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");

const rows = data.split("\n");

class Card {
  public id: number;
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
    const score = numberOfMatches === 0 ? 0 : numberOfMatches;
    return score;
  }
}

class Deck {
  private map: Map<number, number>;

  constructor(cards: Card[]) {
    this.map = new Map(
      Array.from({ length: cards.length }, (_, i) => [i + 1, 1])
    );
  }

  private evaluateCard(currentCard: Card) {
    const score = currentCard.getScore();
    for (let i = currentCard.id + 1; i <= currentCard.id + score; i++) {
      this.map.set(i, (this.map.get(i) || 0) + 1);
    }
  }

  buildDeck(cards: Card[]) {
    cards.forEach((c) => {
      const numTimes = this.map.get(c.id) || 0;
      for (let i = 0; i < numTimes; i++) {
        this.evaluateCard(c);
      }
    });
  }

  scoreDeck(cards: Card[]): number {
    return cards.reduce((acc, c) => {
      return (acc += this.map.get(c.id) || 0);
    }, 0);
  }
}

const cards = rows.map((row) => new Card(row));

const deck = new Deck(cards);
deck.buildDeck(cards);
const score = deck.scoreDeck(cards);

console.log(score);
