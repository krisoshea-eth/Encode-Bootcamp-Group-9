import { ethers } from "hardhat";
import { Ballot__factory, Ballot } from "../typechain-types";

import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const parameter = process.argv.slice(2);
  const contractAddress = parameter[0];

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

  const ballotFactory = new Ballot__factory(wallet);
  const ballotContract = (await ballotFactory.attach(contractAddress)) as Ballot;

  const winnerName = await ballotContract.winnerName();
  const name = ethers.decodeBytes32String(winnerName);
  console.log('Winner: ' + name);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
