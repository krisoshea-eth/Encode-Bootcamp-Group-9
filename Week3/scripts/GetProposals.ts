import { ethers } from "hardhat";
import { TokenizedBallot__factory, TokenizedBallot } from "../typechain-types";

import * as dotenv from 'dotenv';
dotenv.config();


// To run:
// npx ts-node --files ./scripts/GetProposals.ts <contract address> <number of proposals>
// npx ts-node --files ./scripts/GetProposals.ts 0x8B55ae7604EBf49b83952411d94Ed477C94dc40D 5

async function main() {
  const parameter = process.argv.slice(2);
  const contractAddress = parameter[0];
  const numberOfProposals = parseInt(parameter[1], 10);

  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");

  let bf = new TokenizedBallot__factory();
  bf = bf.connect(provider);
  const ballotContract = (await bf.attach(contractAddress)) as TokenizedBallot;

  for (let index = 0; index < numberOfProposals; index++) {
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
