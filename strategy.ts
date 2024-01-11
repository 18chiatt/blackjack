import { Action, Strategy } from "./type";
// context is consistent between calls, so mutate it however you want.  Feel free to extend the context to something useful with `Strategy<MyObject>`
export const RandomStrategy: Strategy = {
	// decide whether to hit/stand
	HitStrategy: () => (Math.random() > 0.5 ? Action.HIT : Action.STAND),
	// decide how much money to spend
	BetStrategy: (_context, currMoney) => Math.min(currMoney, 25), //
	// callback for any modifi
	onShuffle: undefined,
	startingContext: {},
};

// TODO do basic strategy
