import { ethers } from "hardhat";

// To run:
// npx hardhat run ./scripts/DeployTokenizedBallot.ts --network sepolia

const PROPOSAL_NAMES = [
  "Chocolate",            // 0
  "Mint Chocolate Chip",  // 1
  "Strawberry",           // 2
  "Vanilla",              // 3
  "Cookie Dough",         // 4
];

const MY_ERC20_TOKEN_ADDRESS = "0x107C307308dF4C064A379cfC8E447c5fb5E700E3";

async function main() {
  console.log("Deploying TokenizedBallot contract...");

  const lastBlock = await ethers.provider.getBlock("latest");
  console.log(`Last block: ${lastBlock?.number ?? 0}`);

  const tokenizedBallotFactory = await ethers.getContractFactory("TokenizedBallot");
  const tokenizedBallotontract = await tokenizedBallotFactory.deploy(
      PROPOSAL_NAMES.map(ethers.encodeBytes32String),
      MY_ERC20_TOKEN_ADDRESS,
      lastBlock?.number ?? 0,
  );
  await tokenizedBallotontract.waitForDeployment();

  const address = await tokenizedBallotontract.getAddress();
  console.log(`Tokenized Ballot Contract deployed at address ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
