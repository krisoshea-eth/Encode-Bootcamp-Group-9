import { ethers } from "hardhat";
import { TokenizedBallot, MyToken, TokenizedBallot__factory, MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

//To run:
// npx hardhat run ./scripts/winningProposal.ts <tokenizedBallot contract address>
// npx hardhat run ./scripts/winningProposal.ts 0x8B55ae7604EBf49b83952411d94Ed477C94dc40D
async function main(){
    const parameter = process.argv.slice(2);
    const ballotContractAddress = parameter[0];

    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    //const wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC ?? "", provider);

    //tokenized ballot contract
    const ballotFactory = new TokenizedBallot__factory(wallet);
    const ballotContract = ballotFactory.attach(ballotContractAddress) as TokenizedBallot;
    const winner = await ballotContract.winnerName();
    console.log(`Winner name: ${ethers.decodeBytes32String(winner)}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });