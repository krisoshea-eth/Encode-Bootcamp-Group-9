import { ethers } from "hardhat";
import { Ballot__factory, Ballot } from "../typechain-types";

import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const parameter = process.argv.slice(2);
  const contractAddress = parameter[0];

  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");

  let bf = new Ballot__factory();
  bf = bf.connect(provider);
  const ballotContract = (await bf.attach(contractAddress)) as Ballot;

  const chairperson = await ballotContract.chairperson();
  console.log(`Chairperson: ${chairperson}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
