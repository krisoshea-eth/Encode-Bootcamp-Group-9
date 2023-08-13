
import { ethers } from "ethers";
import { MyToken, MyToken__factory } from "../typechain-types";

import * as dotenv from 'dotenv';
dotenv.config();

// To run:
// npx ts-node --files ./scripts/Delegate.ts <ERC20 contract address> <receiver address>
// npx ts-node --files ./scripts/Delegate.ts 0xE15A6FaD4cEE67269A9A7c054482Ba99c383BD5b 0x87C924C1c720AFa2e1c287fE48E822e74c7df2A1

async function main() {
    const parameter = process.argv.slice(2);
    const contractAddress = parameter[0];
    const receiverAddress = parameter[1];

    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

    // Verify Wallet
    console.log(`Using wallet address ${wallet.address}`);
    const balanceBN = await provider.getBalance(wallet.address);
    const balance = Number(ethers.formatUnits(balanceBN));
    console.log(`Wallet balance ${balance}`);
    if (balance < 0.01) {
        throw new Error("Not enough ether");
    }

    const myTokenContractFactory = new MyToken__factory(wallet);
    const myTokenContract = myTokenContractFactory.attach(contractAddress) as MyToken;

    const mintTx = await myTokenContract.connect(wallet).delegate(receiverAddress);
    await mintTx.wait();

    const newVotesBN = await myTokenContract.getVotes(receiverAddress);
    const newVotes = Number(ethers.formatUnits(newVotesBN));
    console.log("Receiver new vote balance:", newVotes);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
