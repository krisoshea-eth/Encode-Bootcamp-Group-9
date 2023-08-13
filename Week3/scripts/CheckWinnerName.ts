import { string } from './../node_modules/hardhat/src/internal/core/params/argumentTypes';
import { Token } from './../node_modules/@solidity-parser/parser/dist/src/types.d';
import { ethers } from "ethers";
import { TokenizedBallot__factory, TokenizedBallot } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const parameter = process.argv.slice(2);
  const contractddress = parameter[0];

  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

  // Verify Wallet
  console.log(`Using address ${wallet.address}`);
  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  const tokenizedBallotFactory = new TokenizedBallot__factory(wallet);
  const tokenizedBallotContract = tokenizedBallotFactory.attach(contractddress) as TokenizedBallot;
  const winnerName = await tokenizedBallotContract.winnerName();
  console.log(`Winnner Name: ${ethers.decodeBytes32String(winnerName)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});