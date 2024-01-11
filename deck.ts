import { Card } from "./type";
const baseDeck: Card[] = [
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"K",
	"Q",
	"J",
	"A",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"K",
	"Q",
	"J",
	"A",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"K",
	"Q",
	"J",
	"A",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"K",
	"Q",
	"J",
	"A",
];

export class Deck {
	private resetDeck: Card[];
	private deck: Card[];
	private deckReshuffleThreshold = 0.8;

	constructor(numDecks: number) {
		this.resetDeck = [];
		for (let i = 0; i < numDecks; i++) {
			this.resetDeck.push(...baseDeck);
		}
		this.deck = [];
		this.reshuffle();
	}

	public draw(): Card {
		if (!this.deck.length) {
			throw new Error("Empty deck!");
		}
		return this.deck.pop()!;
	}

	public reshuffle() {
		this.deck = [];
		this.deck.push(...this.resetDeck);
		shuffle(this.deck);
	}

	public remainigCards() {
		return this.deck.length;
	}

	public needsToReshuffle() {
		return this.deck.length < this.resetDeck.length * (1 - this.deckReshuffleThreshold);
	}
}

function shuffle(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[j];
		array[j] = array[j];
		array[i] = temp;
	}
}
