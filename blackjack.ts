import { Deck } from "./deck";
import { Action, Card, PlayerContext, SimulationResult, Strategy } from "./type";
import { Hand } from "./Hand";
import { RandomStrategy } from "./strategy";
const { performance } = require("perf_hooks");

function simulateGames(
	numDecks: number,
	strategy: Strategy,
	startingBalance: number,
	numRounds: number
): SimulationResult {
	// TODO: support insurance/splitting/doubling down
	const playerContext = strategy.startingContext || {};
	let balance = startingBalance;
	const deck = new Deck(numDecks);
	let playerHand = new Hand();
	let dealerHand = new Hand();
	let dealerPrivateHand = new Hand();

	for (let i = 0; i < numRounds; i++) {
		if (balance === 0) {
			return { remainingBalance: 0, roundsPlayed: i };
		}
		if (deck.needsToReshuffle()) {
			strategy.onShuffle?.(playerContext);
			deck.reshuffle();
		}
		playerHand.clear();
		dealerHand.clear();
		dealerPrivateHand.clear();
		// do round;
		let bet = getBet(playerContext, balance, strategy);
		// why alternate like this ???
		// TODO split hands
		playerHand.addCard(deck.draw());
		const dealerFirst = deck.draw();
		dealerHand.addCard(deck.draw());
		playerHand.addCard(deck.draw());
		const dealerFaceDown = deck.draw();

		dealerPrivateHand.addCard(dealerFirst);
		dealerPrivateHand.addCard(dealerFaceDown);

		const playerHasBlackjack = playerHand.isBlackjack();
		const dealerHasBlackjack = dealerPrivateHand.isBlackjack();
		if (playerHasBlackjack && dealerHasBlackjack) {
			continue; // push
		}
		if (playerHasBlackjack) {
			balance += bet * 1.5; // bet not subtracted and 1.5x payed
			continue;
		}
		if (dealerHasBlackjack) {
			balance -= bet;
			continue;
		}
		let busted = false;
		let playerAction: Action = strategy.HitStrategy(playerHand, dealerHand, playerContext);
		while (playerAction !== Action.STAND) {
			playerHand.addCard(deck.draw());
			if (playerHand.busted()) {
				balance -= bet;
				busted = true;
				break;
			} else {
				playerAction = strategy.HitStrategy(playerHand, dealerHand, playerContext);
			}
		}
		if (busted) {
			continue;
		}

		dealerHand.addCard(dealerFaceDown);
		while (dealerHand.dealerShouldDraw()) {
			dealerHand.addCard(deck.draw());
		}
		// dealer done playing
		if (dealerHand.busted()) {
			balance += bet;
			continue;
		}
		const dealerTotal = dealerHand.getCalculationTimeValueOfHand();
		const playerTotal = playerHand.getCalculationTimeValueOfHand();
		if (playerTotal === dealerTotal) {
			// push
			continue;
		}
		if (playerTotal > dealerTotal) {
			balance += bet;
			continue;
		}
		balance -= bet;
	}
	return { roundsPlayed: numRounds, remainingBalance: balance };
}

function getBet(playerContext: PlayerContext, balance: number, strategy: Strategy) {
	const desiredBet = strategy.BetStrategy(playerContext, balance);
	if (desiredBet > balance) {
		throw new Error(`Bet cannot exceed balance ${desiredBet} > ${balance}`);
	}
	return desiredBet;
}

// performance testing
const start = performance.now();
const result = simulateGames(8, RandomStrategy, 4000000000000, 50000000);
const end = performance.now();
const seconds = (end - start) / 1000;
console.log(
	`Seconds Elapsed: ${Intl.NumberFormat().format(
		Math.round(seconds * 10) / 10
	)}\nrounds played: ${Intl.NumberFormat().format(result.roundsPlayed)}. \nSims/second: ${Intl.NumberFormat().format(
		Math.round(result.roundsPlayed / seconds)
	)}\n`,
	result
);
