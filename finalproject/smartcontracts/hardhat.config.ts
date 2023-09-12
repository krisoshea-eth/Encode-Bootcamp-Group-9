import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  paths: { tests: "tests" },

  networks: {
    hardhat: {},
    sepolia: {
        url: process.env.RPC_ENDPOINT_URL,
        accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

export default config;
