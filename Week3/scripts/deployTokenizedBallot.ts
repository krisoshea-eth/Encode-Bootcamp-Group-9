import { ethers } from "hardhat";
import { TokenizedBallot, MyToken, TokenizedBallot__factory, MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();
/**
 * Required parameters for deploying TokenBallot:, and voting
 * proposals - defined here
 * tokenContract - already deployed, address passed as input parameter
 * targetBlockNumber - function called in script
 */

//To run:
// npx hardhat run ./scripts/deployTokenizedBallot.ts <tokenContract address>
// npx hardhat run ./scripts/deployTokenizedBallot.ts 0xE15A6FaD4cEE67269A9A7c054482Ba99c383BD5b
const PROPOSAL_NAMES = [
    "Chocolate",            // 0
    "Mint Chocolate Chip",  // 1
    "Strawberry",           // 2
    "Vanilla",              // 3
    "Cookie Dough",         // 4
  ];
async function main() {
    const parameter = process.argv.slice(2);
    const tokenContractAddress = parameter[0];

    //connecting Wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC ?? "", provider); 

    const lastBlock = await ethers.provider.getBlock("latest");

    //tokenCOntract 
    // const tokenFactory = new MyToken__factory(wallet);
    // const tokenContract = tokenFactory.attach(tokenContractAddress) as MyToken;

    const tokenBallot = new TokenizedBallot__factory(wallet);
    const ballotContract = tokenBallot.deploy(PROPOSAL_NAMES,tokenContractAddress, lastBlock?.number ?? 0) ;
    const tbfAddress = (await ballotContract).getAddress();
    console.log(`Tokenized Ballot was deployed at address: ${tbfAddress}`);

    // const ballotFactory = new Ballot__factory(wallet);
    // const ballotContract = ballotFactory.attach(contractddress) as Ballot;
    // const tx = await ballotContract.vote(proposal);
    // console.log(`Transaction hash: ${tx.hash}`);
    }

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});