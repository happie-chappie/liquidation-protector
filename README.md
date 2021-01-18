# liquidation-protector

- A bot that protects aave-liquidation
- Bot inputs
  - User wallet
  - PnL boundaries
    - stop-loss
    - take-profit
- Bot functionality
  - The bot tracks the cost of collateral and debt using Chainlink
  - When the stop-loss or take-profit signals are triggered, the bot runs the below set of steps to avoid liquidation
    1. Get Flashloan equal to debt
    1. Repay user debt
    1. Swap user's collateral to debt using 1inch API
    1. Repay Flashloan
