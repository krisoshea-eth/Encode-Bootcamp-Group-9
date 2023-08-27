# Lottery dApp

## Lottery contract deployment
Script to deploy here
contract address: 0x85Fe4a9a430085494264aE8D58aa92801202d39a
on testnet link: https://sepolia.etherscan.io/address/0x85Fe4a9a430085494264aE8D58aa92801202d39a

lottery token: 0xa34eAcC7fe761d69e988a5464ed7eE5369ea0040

## Opening and closing bets
Example of opening bets:
tx-hash: 
Successfully started lottery. Bets are open!
Transaction Hash: 0xcebbba00af3f52969bf1a62bf29580ac3136909bb625324e164714f08ffa24ca
link: https://sepolia.etherscan.io/tx/0xcebbba00af3f52969bf1a62bf29580ac3136909bb625324e164714f08ffa24ca

Example of closing bets:
tx-hash:

## Purchasing tokens
Tx-hash: 0xb8a35872cc8fd059a668c43a896993015ee50db793e8e527885b2c421162a972
link:

### A few changes made to Lottery contract
Added function to obtain winner address
Tweaked openBets function: only input is duration, then closing time is calculated within function

### To do 
- deploy lottery contract and get address ✅
- check state functionality ✅ (might require some tweaking)
- top up tokens to own address ✅
    - need to re-deploy contract and change ratio/price/betting fees
    - currently ratio is 1 i.e. 1 Sepolia= 1 LTO
- burn tokens to own address
- withdraw fees - owner (needs testing)
- open bets ✅
- bet (needs testing)
- check prize
- display owner pool
