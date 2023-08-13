import { ethers } from "hardhat";
import { TokenizedBallot, MyToken, TokenizedBallot__factory, MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();
/**
 * Required parameters for voting
 * tokenizedBallotContract - already deployed - passing address
 * index of proposal user is voting for
 * amount - voting amount
 */

//To run:
// npx hardhat run ./scripts/Vote.ts <tokenContract address> <ballotContractAddress> <proposal>
// npx hardhat run ./scripts/Vote.ts 0xE15A6FaD4cEE67269A9A7c054482Ba99c383BD5b 0x8B55ae7604EBf49b83952411d94Ed477C94dc40D 4 1
async function main() {
    const parameter = process.argv.slice(2);
    const tokenContractAddress = parameter[0];
    const ballotContractAddress = parameter[1];
    const proposal = parameter[2];
    const _amount = parameter[3];

    //connecting Wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC ?? "", provider); 

    //tokenCOntract 
    const tokenFactory = new MyToken__factory(wallet);
    const tokenContract = tokenFactory.attach(tokenContractAddress) as MyToken;

    //checking token balance
    const walletBN = await tokenContract.balanceOf(wallet.getAddress());
    const walletTokens = ethers.parseUnits("1", "ether");
    console.log(`Wallet token balance is ${walletTokens}`);

    // Check voting power
    const walletAddress = wallet.address;
    const votingPower = await tokenContract.getVotes(walletAddress); 
    console.log(`Using wallet address ${walletAddress} which has ${votingPower} units of voting`);

    if (votingPower < 0.01) {
        throw new Error("No voting power");
      }
       

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
