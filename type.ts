import { Hand } from "./Hand";

export type Card = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "K" | "Q" | "J";

export type PlayerContext = {};

export enum Action {
	HIT = "hit",
	STAND = "stand",
}

export type Strategy<T extends PlayerContext = PlayerContext> = {
	HitStrategy: (playerHand: Hand, dealerHand: Hand, context: T) => Action;
	BetStrategy: (context: T, currBalance: number) => number;
	startingContext?: T;
	onShuffle?: (context: T) => void;
};

export type SimulationResult = {
	roundsPlayed: number;
	remainingBalance: number;
};
