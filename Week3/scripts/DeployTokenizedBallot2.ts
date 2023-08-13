import { ethers } from "hardhat";

async function main() {
 let proposals = process.argv.slice(2);
 console.log("Deploying TokenizedBallot contract...");
 console.log("Proposals: ");
 proposals.forEach((element, index) => {
  console.log(`Proposal N. ${index + 1}: ${element}`);
 });

 let tokenContract = await ethers.getContractAt("MyToken", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
 let targetBlockNumber = await ethers.provider.getBlockNumber() + 1;

  const tokenizedBallotFactory = await ethers.getContractFactory("TokenizedBallot");
  const tokenizedBallotContract = await tokenizedBallotFactory.deploy(proposals.map(ethers.encodeBytes32String), tokenContract, targetBlockNumber);
  await tokenizedBallotContract.waitForDeployment();
  const address = await tokenizedBallotContract.getAddress();
  console.log(`TokenizedBallot Contract deployed at address ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});