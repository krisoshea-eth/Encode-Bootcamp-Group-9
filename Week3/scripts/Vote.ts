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
// npx hardhat run ./scripts/Vote.ts <proposal> <voting amount>
// npx hardhat run ./scripts/Vote.ts 4 1
async function main() {
    const parameter = process.argv.slice(2);
    const proposal = parameter[0];
    const _amount = parameter[1];

    const tokenContractAddress = "0xE15A6FaD4cEE67269A9A7c054482Ba99c383BD5b";
    const ballotContractAddress = "0x8B55ae7604EBf49b83952411d94Ed477C94dc40D";
    

    //connecting Wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    //const wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC ?? "", provider); 
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

    //tokenCOntract 
    const tokenFactory = new MyToken__factory(wallet);
    const tokenContract = tokenFactory.attach(tokenContractAddress) as MyToken;

    //checking token balance
    const walletBN = await tokenContract.balanceOf(wallet.getAddress());
    // ethers.parseUnits(walletBN, "ether");
    const decimals = await tokenContract.decimals();
    const walletTokens = ethers.formatUnits(walletBN, decimals)
    console.log(`Wallet token balance is ${walletTokens} tokens`);

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
