import { ethers } from "ethers";
import { Ballot__factory, Ballot } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const parameter = process.argv.slice(2);
  const contractddress = parameter[0];
  const toAddress = parameter[1];

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
  const ballotContract = ballotFactory.attach(contractddress) as Ballot;
  const tx = await ballotContract.delegate(toAddress);
  console.log(`Transaction hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
