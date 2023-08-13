# Usage

The scripts included were used to deploy the ERCVotes token contract, a tokenized ballot contract, and give voting tokens, delegate voting power, cast votes, check vote power and query results within our group.
You may need to use `--files`` flag with `ts-node``

# Setting up the voting tokens 
## Deploy voting tokens contract
The ERC20Votes contract is deployed, and the contract address is retrieved:
```
npx hardhat run ./scripts/DeployERC20Token.ts --network sepolia
```

The contract address is: `0xE15A6FaD4cEE67269A9A7c054482Ba99c383BD5b`
https://sepolia.etherscan.io/tx/0x619bb72174e1c9e3c5a0496cb576a05f9bdea2e6961239fea0596486895383a9

You must have a provider and wallet set up in the `.env`.

## Mint Tokens
Mint and assign voting tokens to a given address using the mint function. Only deployer (has minter role) can do this unless minter role is assigned to a different address
```
npx ts-node --files ./scripts/Mint.ts <ERC20 contract address> <receiver address> <amount> 

```

Example:
```
npx ts-node --files ./scripts/Mint.ts 0xE15A6FaD4cEE67269A9A7c054482Ba99c383BD5b 0x6D8Eb771F6503fd4db08E2879f582e6030c9B877 10
Receiver new balance: 10
```

## Delegate
Any address with voting tokens can give themselves voting power i.e. the right to vote, by self-delegating using the delegate function.
```npx ts-node --files ./scripts/Delegate.ts <ERC20 contract address> <receiver address>```

Example:
```npx ts-node --files ./scripts/Delegate.ts 0xE15A6FaD4cEE67269A9A7c054482Ba99c383BD5b 0x87C924C1c720AFa2e1c287fE48E822e74c7df2A1```

# The Tokenized Ballot contract
## Deploy tokenized ballot
The TokenizedBallot contract is deployed with the token contract address passed as an input parameter so we can used the previously deployed token contract. The contract address for the tokenizedBallot is retrieved:
```
npx hardhat run ./scripts/deployTokenizedBallot.ts <tokenContract address>
npx hardhat run ./scripts/deployTokenizedBallot.ts 0xE15A6FaD4cEE67269A9A7c054482Ba99c383BD5b
```

The contract address is: `0x602727c195DB6E0F6bf7fd06645e91a1602a9FbD`
https://sepolia.etherscan.io/tx/0xbb6b82ed7215a633ec1e4b1d12d2975a87ab7512e831f9b5b6a65d24aff0b38a

## Vote
To vote, the script is run with the index of the proposal one wants to vote for, and the amount as input parameters. Both contract addresses were included in this script.
```npx ts-node ./scripts/Vote.ts <proposal index> <amount>```

Example:
```
npx ts-node ./scripts/Vote.ts 2 1
Wallet token balance is 10.0 tokens
Using wallet address 0x9Ec31FF4CA2fBCe8Dd89e3DFA60B8052C782F361 which has 10000000000000000000 units of voting
Transaction hash: 0xff63210e6f11319a251ec9b424e1247b09984c11ed148dd32977050edc3ad51a 
```
https://sepolia.etherscan.io/tx/0xff63210e6f11319a251ec9b424e1247b09984c11ed148dd32977050edc3ad51a

## Get Winner Name

```
npx ts-node ./scripts/winningProposal.ts <tokenizedBallot contract address>
```

Example:
```
npx ts-node ./scripts/winningProposal.ts 0x602727c195DB6E0F6bf7fd06645e91a1602a9FbD
Winner name: Mint Chocolate Chip
```

# Example Deployed Contract with Transactions

Token contract:
https://sepolia.etherscan.io/address/0xe15a6fad4cee67269a9a7c054482ba99c383bd5b

Tokenized ballot contract:
https://sepolia.etherscan.io/address/0x602727c195DB6E0F6bf7fd06645e91a1602a9FbD