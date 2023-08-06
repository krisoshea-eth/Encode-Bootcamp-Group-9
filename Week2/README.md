# Usage

Note: you may need to use `--files`` flag with `ts-node``. The examples below run on my macbook, hardhat environment without using it.

## Deploy
With Ethers:
```
npx ts-node ./scripts/DeployWithEthers.ts proposal-name-1 proposal-name-2 ...
```

Example:
```
npx ts-node ./scripts/DeployWithEthers.ts "Chocolate" "Vanilla" "Strawberry" 
```

You must have a provider and wallet set up in the `.env`.

## Get Proposals
```
npx ts-node ./scripts/GetProposals.ts <contract address>
```

Example:
```
npx ts-node ./scripts/GetProposals.ts 0x23Da7Faedf03137d6b16C56fb9DAf4bA84776790 
Got proposal:  { index: 0, name: 'Chocolate', voteCount: 1n }
Got proposal:  { index: 1, name: 'Vanilla', voteCount: 0n }
Got proposal:  { index: 2, name: 'Strawberry', voteCount: 0n }
```

## Give Right to Vote
Only the deployer of the contract (the chairperson) is able to give voting rights.
```npx ts-node ./scripts/GiveRightToVote.ts <contract address> <new voter wallet address>```

Example:
```npx ts-node ./scripts/GiveRightToVote.ts 0x23Da7Faedf03137d6b16C56fb9DAf4bA84776790 0x6D8Eb771F6503fd4db08E2879f582e6030c9B877```

An example of what would happen if anyone other than the deployer(chairperson) tries to assign voting rights:
<img width="963" alt="voteDelegation" src="https://github.com/krisoshea-eth/Encode-Bootcamp-Group-9/assets/85358998/aa99d328-e86b-4502-a42b-6505c7ca1634">



## Vote for a Proposal
```npx ts-node ./scripts/Vote.ts <contract address> <proposal index>```

Example:
```npx ts-node ./scripts/Vote.ts 0x23Da7Faedf03137d6b16C56fb9DAf4bA84776790 0 ```

## Delegate Vote
```npx ts-node ./scripts/DelegateVote.ts <contract address> <address of delegate>```

Example:
```npx ts-node ./scripts/Vote.ts 0x23Da7Faedf03137d6b16C56fb9DAf4bA84776790 0x9Ec31FF4CA2fBCe8Dd89e3DFA60B8052C782F361 ```

## Get Winner Name

```
npx ts-node ./scripts/GetWinnerName.ts <contract address>
```

Example:
```
npx ts-node ./scripts/GetWinnerName.ts 0x23Da7Faedf03137d6b16C56fb9DAf4bA84776790
Using address 0x87C924C1c720AFa2e1c287fE48E822e74c7df2A1
Wallet balance 1.4936607009556941
Winner: Chocolate
```

# Example Deployed Contract with Transactions

https://sepolia.etherscan.io/address/0x23da7faedf03137d6b16c56fb9daf4ba84776790

