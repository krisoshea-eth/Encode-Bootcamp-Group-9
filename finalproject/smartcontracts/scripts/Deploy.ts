import { ethers } from "hardhat";
// import { Lottery__factory, LotteryToken__factory } from "../typechain-types";

import * as dotenv from 'dotenv';
dotenv.config();

const BET_PRICE = 0.0001;
const BET_FEE = 0.00002;
const TOKEN_RATIO = 1n;

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

  // Display Wallet Info
  console.log(`Using address ${wallet.address}`);
  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
  
  // Deploy Lottery
  const lotteryFactory = await ethers.getContractFactory("Lottery", wallet);
  const lotteryContract = await lotteryFactory.deploy(
    "LotteryToken",
    "LT0",
    TOKEN_RATIO,
    ethers.parseUnits(BET_PRICE.toFixed(18)),
    ethers.parseUnits(BET_FEE.toFixed(18)),
  );

  await lotteryContract.waitForDeployment();

  const lotteryAddress = await lotteryContract.getAddress();
  console.log(`Lottery contract deployed at address ${lotteryAddress}`);

  // Get LotteryToken Contract Address from the newly deployed Lottery Contract
  const tokenAddress = await lotteryContract.paymentToken();
  console.log(`Lottery token contract deployed at address ${tokenAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
