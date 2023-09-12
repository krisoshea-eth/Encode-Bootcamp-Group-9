/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface TokenizedBallotInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "chairperson"
      | "proposals"
      | "updateVoterBalance"
      | "vote"
      | "voterBalances"
      | "votingPower"
      | "votingPowerSpent"
      | "winnerName"
      | "winningProposal"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "Voted"): EventFragment;

  encodeFunctionData(
    functionFragment: "chairperson",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "proposals",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "updateVoterBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "vote",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "voterBalances",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "votingPower",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "votingPowerSpent",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "winnerName",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "winningProposal",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "chairperson",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "proposals", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updateVoterBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "vote", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "voterBalances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "votingPower",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "votingPowerSpent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "winnerName", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "winningProposal",
    data: BytesLike
  ): Result;
}

export namespace VotedEvent {
  export type InputTuple = [
    voter: AddressLike,
    proposal: BigNumberish,
    amount: BigNumberish
  ];
  export type OutputTuple = [voter: string, proposal: bigint, amount: bigint];
  export interface OutputObject {
    voter: string;
    proposal: bigint;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface TokenizedBallot extends BaseContract {
  connect(runner?: ContractRunner | null): TokenizedBallot;
  waitForDeployment(): Promise<this>;

  interface: TokenizedBallotInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  chairperson: TypedContractMethod<[], [string], "view">;

  proposals: TypedContractMethod<
    [arg0: BigNumberish],
    [[string, bigint] & { name: string; voteCount: bigint }],
    "view"
  >;

  updateVoterBalance: TypedContractMethod<[], [void], "nonpayable">;

  vote: TypedContractMethod<
    [proposal: BigNumberish, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  voterBalances: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  votingPower: TypedContractMethod<[account: AddressLike], [bigint], "view">;

  votingPowerSpent: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  winnerName: TypedContractMethod<[], [string], "view">;

  winningProposal: TypedContractMethod<[], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "chairperson"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "proposals"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [[string, bigint] & { name: string; voteCount: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "updateVoterBalance"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "vote"
  ): TypedContractMethod<
    [proposal: BigNumberish, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "voterBalances"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "votingPower"
  ): TypedContractMethod<[account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "votingPowerSpent"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "winnerName"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "winningProposal"
  ): TypedContractMethod<[], [bigint], "view">;

  getEvent(
    key: "Voted"
  ): TypedContractEvent<
    VotedEvent.InputTuple,
    VotedEvent.OutputTuple,
    VotedEvent.OutputObject
  >;

  filters: {
    "Voted(address,uint256,uint256)": TypedContractEvent<
      VotedEvent.InputTuple,
      VotedEvent.OutputTuple,
      VotedEvent.OutputObject
    >;
    Voted: TypedContractEvent<
      VotedEvent.InputTuple,
      VotedEvent.OutputTuple,
      VotedEvent.OutputObject
    >;
  };
}
