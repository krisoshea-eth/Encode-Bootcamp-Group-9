import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { MyToken, TokenizedBallot } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const SUPPLY = 1_000_000;

const PROPOSAL_NAMES = [
  "Chocolate",            // 0
  "Mint Chocolate Chip",  // 1
  "Strawberry",           // 2
  "Vanilla",              // 3
  "Cookie Dough",         // 4
];

describe("Tokenized Ballot Tests", async () => {
  let MyERC20Contract: MyToken;
  let BallotContract: TokenizedBallot;

  let deployer: HardhatEthersSigner;
  let acct1: HardhatEthersSigner;
  let acct2: HardhatEthersSigner;
  let acct3: HardhatEthersSigner;

  async function deployContracts() {
    [deployer, acct1, acct2,  acct3] = await ethers.getSigners();

    // Deploy MyToken Contract (ERC20 Token)
    const MyERC20ContractFactory = await ethers.getContractFactory("MyToken");
    const MyERC20Contract_ = await MyERC20ContractFactory.deploy();
    await MyERC20Contract_.waitForDeployment();

    
    // console.log({lastBlock});

    // Mint a supply to accounts
    let tokenValue = ethers.parseUnits("1", "ether");
    let minttx = await MyERC20Contract_.mint(acct1, tokenValue);
    await minttx.wait();

    tokenValue = ethers.parseUnits("1", "ether");
    minttx = await MyERC20Contract_.mint(acct2, tokenValue);
    await minttx.wait();

    tokenValue = ethers.parseUnits("1", "ether");
    minttx = await MyERC20Contract_.mint(acct3, tokenValue);
    await minttx.wait();


    let selfDelegate = await MyERC20Contract_.connect(acct1).delegate(acct1.getAddress());
    await selfDelegate.wait();

    selfDelegate = await MyERC20Contract_.connect(acct2).delegate(acct2.getAddress());
    await selfDelegate.wait();

    selfDelegate = await MyERC20Contract_.connect(acct3).delegate(acct3.getAddress());
    await selfDelegate.wait();

    const lastBlock = await ethers.provider.getBlock("latest");
    
    // Deploy Ballot Contract
    const BallotContractFactory = await ethers.getContractFactory("TokenizedBallot");
    const BallotContract_ = await BallotContractFactory.deploy(
      PROPOSAL_NAMES.map(ethers.encodeBytes32String),
      MyERC20Contract_.getAddress(),
      lastBlock?.number ?? 0,
    );
    await BallotContract_.waitForDeployment();

    return {
      MyERC20Contract_,
      BallotContract_,
    };
  }

  beforeEach(async () => {
    const {MyERC20Contract_, BallotContract_} = await loadFixture(deployContracts);
    MyERC20Contract = MyERC20Contract_;
    BallotContract = BallotContract_;
  });

  // it("should have 100 total supply at deployment", async () => {

  //   const totalSupplyBigNumber = await MyERC20Contract.totalSupply();

  //   console.log('totalSupplyBigNumber = ', totalSupplyBigNumber);

  //   const decimals = await MyERC20Contract.decimals();

  //   console.log('decimals = ', decimals);

  //   const totalSupply = ethers.formatUnits(totalSupplyBigNumber, decimals);

  //   console.log('Total Supply = ', totalSupply);

  //   const expectedTokenValue = ethers.parseUnits("3", "ether");
  //   expect(totalSupplyBigNumber).to.eq(expectedTokenValue);
  // });

  // it("can delegate", async () => {
  //   const delegateTxn = await MyERC20Contract.connect(acct1).delegate(acct2.getAddress());
  //   await delegateTxn.wait();

  //   const acct1BalanceBN = await MyERC20Contract.balanceOf(acct1.getAddress());
  //   const expectedBalance1 = ethers.parseUnits("1", "ether");
  //   expect(acct1BalanceBN).to.eq(expectedBalance1);

  //   const acct2BalanceBN = await MyERC20Contract.balanceOf(acct2.getAddress());
  //   const expectedBalance2 = ethers.parseUnits("1", "ether");
  //   expect(acct2BalanceBN).to.eq(expectedBalance2);

  //   const acct1Votes = await MyERC20Contract.getVotes(acct1.getAddress());
  //   expect(acct1Votes).to.eq(0n);

  //   const selfDelegate = await MyERC20Contract.connect(acct2).delegate(acct2.getAddress());
  //   await selfDelegate.wait();

  //   const acct2Votes = await MyERC20Contract.getVotes(acct2.getAddress());
  //   const expectedVotesAcct2 = ethers.parseUnits("2", "ether");
  //   expect(acct2Votes).to.eq(expectedVotesAcct2);
  // });

  it("Use Tokenized Ballot", async function() {
    // let selfDelegate = await MyERC20Contract.connect(acct1).delegate(acct1.getAddress());
    // await selfDelegate.wait();

    // selfDelegate = await MyERC20Contract.connect(acct2).delegate(acct2.getAddress());
    // await selfDelegate.wait();

    // selfDelegate = await MyERC20Contract.connect(acct3).delegate(acct3.getAddress());
    // await selfDelegate.wait();

    const acct1VoteAmt = ethers.parseUnits("1", "ether");
    const acct1Vote = await BallotContract.connect(acct1).vote(4, acct1VoteAmt);
    acct1Vote.wait();

    const acct2VoteAmt = ethers.parseUnits("1", "ether");
    const acct2Vote = await BallotContract.connect(acct2).vote(0, acct2VoteAmt);
    acct2Vote.wait();

    const acct3VoteAmt = ethers.parseUnits("1", "ether");
    const acct3Vote = await BallotContract.connect(acct3).vote(4, acct3VoteAmt);
    acct3Vote.wait();

    const winningProposal = await BallotContract.winningProposal();
    // why isn't this a transaction??
    
    expect(winningProposal).to.eq(4);
  });
});
