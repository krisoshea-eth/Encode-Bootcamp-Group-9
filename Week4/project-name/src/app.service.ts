import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as ERC20VotesJson from './assets/ERC20Votes.json';
import { MintResponse } from './dtos/minttoken.dto';

@Injectable()
export class AppService {
  provider: ethers.Provider;
  wallet: ethers.Wallet;
  contract: ethers.Contract;
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? '');
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', this.provider);
    this.contract = new ethers.Contract(process.env.ERC20_CONTRACT_ADDRESS, ERC20VotesJson.abi, this.wallet);
  }

  getHello(): string {
    return 'Hello World!';
  }

  getAnotherThing(): string {
    return "Other Thing";
  }

  getTokenAddress(): any {
    return {address: process.env.ERC20_CONTRACT_ADDRESS};
  }

  getTotalSupply(): Promise<BigInt> {
    return this.contract.totalSupply();
  }

  getTokenBalance(address: string): Promise<BigInt> {
    return this.contract.balanceOf(address);
  }

  async mintToken(address: string, quantity: number): Promise<MintResponse> {
    let receipt;

    try {
      const tx = await this.contract.mint(address, quantity);
      receipt = await tx.wait();
    } catch (e) {
      console.error('error', e);
      return { success: false, transactionHash: ''};
    }

    return {
      success: true,
      transactionHash: receipt.hash,
    };
  }
}
