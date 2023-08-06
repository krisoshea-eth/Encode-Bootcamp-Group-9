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

  for (let index = 0; index < 4; index++) {
    try {
      const proposal = await ballotContract.proposals(index);
      const name = ethers.decodeBytes32String(proposal.name);
      const voteCount = proposal.voteCount;
      console.log('Got proposal: ', { index, name, voteCount });
    } catch (error) {
      // check error type - probably no more proposals
      console.log(`Error: ${error}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
