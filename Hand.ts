import { Card } from "./type";

export class Hand {
	private _blackjackPairs: Card[] = ["10", "J", "K", "Q"];
	curr: Card[] = [];
	constructor() {
		this.curr = [];
	}

	public clear() {
		while (this.curr.length) {
			this.curr.pop();
		}
	}

	public addCard(card: Card) {
		this.curr.push(card);
	}

	public isBlackjack() {
		if (this.curr.length !== 2) {
			return false;
		}
		const aceIndex = this.curr.indexOf("A");
		if (aceIndex === -1) {
			return false;
		}
		const otherIndex = aceIndex ? 0 : 1;
		if (this._blackjackPairs.includes(this.curr[otherIndex])) {
			return true;
		}
	}

	public busted() {
		return this.getLowestPossibleValueOfHand() > 21;
	}

	public getLowestPossibleValueOfHand() {
		let total = 0;
		for (const currCard of this.curr) {
			total += getLowestValueOfCard(currCard);
		}
		return total;
	}

	public getCalculationTimeValueOfHand() {
		const pessimisticTotal = this.getLowestPossibleValueOfHand();
		const optimisticTotal = pessimisticTotal + (this.curr.includes("A") ? 10 : 0);
		if (optimisticTotal > 21) {
			return pessimisticTotal;
		}
		return optimisticTotal;
	}

	public dealerShouldDraw() {
		const pessimisticTotal = this.getLowestPossibleValueOfHand();
		// At most 1 ace can be counted as 11
		const optimisticTotal = pessimisticTotal + (this.curr.includes("A") ? 10 : 0);
		if (optimisticTotal >= 17 && optimisticTotal <= 21) {
			// dealer should count ace as 11
			return false;
		}

		// dealer should count ace as 1
		return pessimisticTotal < 17 ? true : false;
	}

	public getHighestPossibleValueOfhand() {}
}

function getLowestValueOfCard(card: Card) {
	switch (card) {
		case "A":
			return 1;
		case "K":
			return 10;
		case "Q":
			return 10;
		case "J":
			return 10;
		case "2":
			return 2;
		case "3":
			return 3;
		case "4":
			return 4;
		case "5":
			return 5;
		case "6":
			return 6;
		case "7":
			return 7;
		case "8":
			return 8;
		case "9":
			return 9;
		case "10":
			return 10;
	}
}
