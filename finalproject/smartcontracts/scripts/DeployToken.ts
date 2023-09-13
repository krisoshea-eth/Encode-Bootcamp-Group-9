import { ethers } from "hardhat";

// To run:
// npx hardhat run ./scripts/DeployToken.ts --network sepolia

async function main() {
  const ERC20VotesFactory = await ethers.getContractFactory("MyToken");
  const ERC20VotesContract = await ERC20VotesFactory.deploy();
  await ERC20VotesContract.waitForDeployment();
  const address = await ERC20VotesContract.getAddress();
  console.log(`MyToken Contract deployed at address ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
