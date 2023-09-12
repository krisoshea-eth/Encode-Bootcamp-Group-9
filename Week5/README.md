# Lottery dApp
<img width="908" alt="Screenshot 2023-08-29 at 12 41 00 PM" src="https://github.com/krisoshea-eth/Encode-Bootcamp-Group-9/assets/30440525/3e54536d-5ce6-4bb7-8ca3-7a7558bc553e">

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
Example of opening bets for 300 seconds:
Transaction Hash: [0x2e185d9fdc84b7332c0d6704176785dacd80145212798e0f8dbf2390ec54d837](https://sepolia.etherscan.io/tx/0x2e185d9fdc84b7332c0d6704176785dacd80145212798e0f8dbf2390ec54d837)

## Purchasing LT0 tokens
Tx-hash: [0x1ad0c4def40b850cf63ee50b88d0c414a72789f8771426ba6364e218b3ff0588](https://sepolia.etherscan.io/tx/0x1ad0c4def40b850cf63ee50b88d0c414a72789f8771426ba6364e218b3ff0588)

## Approve LT0 tokens for use
Tx-hash: [0x4e4651fcf54a148f37d19da0c6177ff215b2bf8fcbc32a5ba5804c4158511c3c](https://sepolia.etherscan.io/tx/0x4e4651fcf54a148f37d19da0c6177ff215b2bf8fcbc32a5ba5804c4158511c3c)

## Bet
Place 5 bets with `betMany`
Tx-hash: [0xad96698cc1fe630d851b78b5af31f373a05a876862d4913b996e1850855e913f](https://sepolia.etherscan.io/tx/0xad96698cc1fe630d851b78b5af31f373a05a876862d4913b996e1850855e913f)

## Close lottery
Tx-hash: [0xd82a4948d3d968a7d0adbaabf8b8b1bfd95a5dc01906e8716ca3d9a3ae2f76b8](https://sepolia.etherscan.io/tx/0xd82a4948d3d968a7d0adbaabf8b8b1bfd95a5dc01906e8716ca3d9a3ae2f76b8)

## Claim Prize
Claim LT0: 0.000004
Tx-hash: [0x7d410832fab25cc2f490f22245b311463e7379c42b276cd4023fcef9017b3d9d](https://sepolia.etherscan.io/tx/0x7d410832fab25cc2f490f22245b311463e7379c42b276cd4023fcef9017b3d9d)

## Burn LT0 Tokens
Burn LT0 to reclaim SEP: 0.000004
Tx-hash: [0xbc28ca0de99a078d64f9579d6d98530e18ef76e35bf771373bd639c5ab99aec2](https://sepolia.etherscan.io/tx/0xbc28ca0de99a078d64f9579d6d98530e18ef76e35bf771373bd639c5ab99aec2)

### A few changes made to Lottery contract
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
