import { expect } from "chai";
import { ethers } from "hardhat";
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

describe("Ballot Voting Tests", async () => {
  let MyERC20Contract: MyToken;
  let BallotContract: TokenizedBallot;

  let accounts: HardhatEthersSigner[];

  beforeEach(async () => {
    accounts = await ethers.getSigners();

    // Deploy MyToken Contract (ERC20 Token)
    const MyERC20ContractFactory = await ethers.getContractFactory("MyToken");
    MyERC20Contract = await MyERC20ContractFactory.deploy();
    await MyERC20Contract.waitForDeployment();

    const lastBlock = await ethers.provider.getBlock("latest")
    // console.log({lastBlock});

    // Mint a supply
    const minttx = await MyERC20Contract.mint(accounts[0].getAddress(), 1);

    
    // Deploy Ballot Contract
    const BallotContractFactory = await ethers.getContractFactory("TokenizedBallot");
    BallotContract = await BallotContractFactory.deploy(
      PROPOSAL_NAMES.map(ethers.encodeBytes32String),
      MyERC20Contract.getAddress(),
      lastBlock?.number ?? 0,
    );
    await BallotContract.waitForDeployment();


  });

  it("should have zero total supply at deployment", async () => {
    const totalSupplyBN = await MyERC20Contract.totalSupply();
    const decimals = await MyERC20Contract.decimals();
    const totalSupply = parseFloat(ethers.formatUnits(totalSupplyBN, decimals));
    expect(totalSupply).to.eq(0);
  });

  // it("triggers the Transfer event with the address of the sender when sending transactions", async function() {

  //   const minttx = await MyERC20Contract.mint(accounts[0].getAddress(), 1);

  //   const senderAddress = await accounts[0].getAddress();
  //   const recipientAddress = await accounts[1].getAddress();

  //   await expect(MyERC20Contract
  //     .transfer(recipientAddress, 1))
  //     .to.emit(MyERC20Contract, "Transfer")
  //     .withArgs(senderAddress, recipientAddress, 1);
  // });
});
