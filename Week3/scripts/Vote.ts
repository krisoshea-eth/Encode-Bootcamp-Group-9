import { ethers } from "hardhat";
import { TokenizedBallot, MyToken, TokenizedBallot__factory} from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();
/**
 * Required parameters for voting
 * tokenizedBallotContract - already deployed - passing address
 * index of proposal user is voting for
 * amount - voting amount
 */

//To run:
// npx hardhat run ./scripts/Vote.ts <ballotContractAddress> <proposal> <amount>
// npx hardhat run ./scripts/Vote.ts 0x8B55ae7604EBf49b83952411d94Ed477C94dc40D 4 1
async function main() {
    const parameter = process.argv.slice(2);
    const ballotContractAddress = parameter[0];
    const proposal = parameter[1];
    const _amount = parameter[2];

    //connecting Wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC ?? "", provider); 

    const tokenBallotFactory = new TokenizedBallot__factory(wallet);
    const ballotContract = tokenBallotFactory.attach(ballotContractAddress) as TokenizedBallot;
    const amount = ethers.parseUnits(_amount, "ether");
    const tx = await ballotContract.vote(proposal, amount);
    console.log(`Transaction hash: ${tx.hash}`);
    }

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
