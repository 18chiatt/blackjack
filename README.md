## Blackjack simulator

This project lets you test out your blackjack strategies defined in javascript.

Currently, there is no support for doubling down/insurance/splitting hands, but it will come in a future version maybe.

To run,

```
npm install
npm run exec
```

## Creating your own strategy

To test out your strategy, open strategy.ts and define your own config.

The "context" object is yours to mutate however you'd like, so feel free to cram in the count or whatever you want.

A basic "Random Strategy" has been provided as an example
