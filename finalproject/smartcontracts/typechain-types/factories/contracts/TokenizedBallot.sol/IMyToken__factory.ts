/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IMyToken,
  IMyTokenInterface,
} from "../../../contracts/TokenizedBallot.sol/IMyToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "getPastVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IMyToken__factory {
  static readonly abi = _abi;
  static createInterface(): IMyTokenInterface {
    return new Interface(_abi) as IMyTokenInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): IMyToken {
    return new Contract(address, _abi, runner) as unknown as IMyToken;
  }
}
