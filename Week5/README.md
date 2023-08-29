# Lottery dApp

## Lottery contract deployment
Script to deploy here
contract address: [0x85Fe4a9a430085494264aE8D58aa92801202d39a](https://sepolia.etherscan.io/address/0x5d799947386F6dc71b06d69797FF7F82325cFAF3)

lottery token: [0xa34eAcC7fe761d69e988a5464ed7eE5369ea0040](https://sepolia.etherscan.io/address/0xa34eAcC7fe761d69e988a5464ed7eE5369ea0040)

```
pwd
~/workspace/solidity/week5/contracts

npx hardhat run ./scripts/Deploy.ts
Using address 0x87C924C1c720AFa2e1c287fE48E822e74c7df2A1
Wallet balance 1.9243592391481104
Lottery contract deployed at address 0x5d799947386F6dc71b06d69797FF7F82325cFAF3
Lottery token contract deployed at address 0x0A16Cfc2adbBb0bdE2BDb3ca371A612bF431A9E1
```

## Opening and closing bets
Example of opening bets:
tx-hash: 
Successfully started lottery. Bets are open!
Transaction Hash: 0xcebbba00af3f52969bf1a62bf29580ac3136909bb625324e164714f08ffa24ca
link: [https://sepolia.etherscan.io/tx/0xcebbba00af3f52969bf1a62bf29580ac3136909bb625324e164714f08ffa24ca](https://sepolia.etherscan.io/tx/0xcebbba00af3f52969bf1a62bf29580ac3136909bb625324e164714f08ffa24ca)

Example of closing bets:
tx-hash:

## Purchasing tokens
Tx-hash: 0xb8a35872cc8fd059a668c43a896993015ee50db793e8e527885b2c421162a972
link:

### A few changes made to Lottery contract
- Added function to obtain winner address
- Tweaked openBets function: only input is duration, then closing time is calculated within function

### Tasks
- deploy lottery contract and get address ✅
- check state functionality ✅ (might require some tweaking)
- top up tokens to own address ✅
    - currently: ratio is 1 i.e. 1 Sepolia= 1 LTO
    - Bet Price = 0.0001
    - Bet Fee = 0.00002
    - SEP <> LT0 Ratio = 1:1
- burn tokens to own address ✅
- withdraw  ✅
- open bets ✅
- bet ✅
- check prize ✅
