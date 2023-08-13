import { ethers } from "ethers";
import { MyToken__factory, MyToken } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const parameter = process.argv.slice(2);
  const contractddress = parameter[0];
  const toAddress = parameter[1];
  const amount = parameter[2];

  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

  // Verify Wallet
  console.log(`Using address ${wallet.address}`);
  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  const MyTokenFactory = new MyToken__factory(wallet);
  const MyTokenContract = MyTokenFactory.attach(contractddress) as MyToken;
  const tx = await MyTokenContract.mint(toAddress, amount);
  console.log(`Transaction hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});