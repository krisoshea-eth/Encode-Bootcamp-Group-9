// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
// import { TokenSale, MyERC20Token, MyERC721Token } from "../typechain-types";

// const RATIO = 10n;

// describe("NFT Shop", async () => {
//   let tokenSaleContract: TokenSale;
//   let paymentTokenContract: MyERC20Token;
//   let nftContract: MyERC721Token;

//   const [deployer, acct1, acct2] = await ethers.getSigners();

//   async function deployContracts() {
//     // Deploy a ERC20 token
//     const erc20TokenFactory = await ethers.getContractFactory("MyERC20Token");
//     const paymentTokenContract_ = await erc20TokenFactory.deploy();
//     await paymentTokenContract_.waitForDeployment();

//     const paymentTokenContractAddress = await paymentTokenContract_.getAddress();

//     // Deploy ERC721 token
//     const erc721TokenFactory = await ethers.getContractFactory("MyERC721Token");
//     const nftContract_ = await erc721TokenFactory.deploy();
//     await nftContract_.waitForDeployment();

//     const nftContractAddress = await nftContract_.getAddress();

//     // Deploy Tokensale contract
//     const tokenSaleContractFactory = await ethers.getContractFactory("TokenSale")
//     const tokenSaleContract_ = await tokenSaleContractFactory.deploy(RATIO, paymentTokenContractAddress, nftContractAddress);
//     await tokenSaleContract_.waitForDeployment();

//     // give minter role to Token Sale Contract
//     const tokenSaleAddress = await tokenSaleContract_.getAddress();
//     const minterRole = await paymentTokenContract_.MINTER_ROLE();
//     const giveRoleTx = await paymentTokenContract_.grantRole(minterRole, tokenSaleAddress);
//     await giveRoleTx.wait();

//     return {
//       tokenSaleContract_,
//       paymentTokenContract_,
//       nftContract_,
//     };
//   }

//   beforeEach(async () => {
//     const {tokenSaleContract_, paymentTokenContract_, nftContract_} = await loadFixture(deployContracts);
//     tokenSaleContract = tokenSaleContract_;
//     paymentTokenContract = paymentTokenContract_;
//     nftContract = nftContract_;
//   });

//   describe("When the Shop contract is deployed", async () => {
//     it("defines the ratio as provided in parameters", async () => {
//       const ratio = await tokenSaleContract.ratio();
//       expect(ratio).to.eq(RATIO);
//     });

//     it("uses a valid ERC20 as payment token", async () => {
//       const paymentTokenAddress = await tokenSaleContract.paymentToken();

//       const tokenContractFactory = await ethers.getContractFactory("ERC20");

//       const paymentToken = tokenContractFactory.attach(paymentTokenAddress) as MyERC20Token;

//       await expect(paymentToken.balanceOf(ethers.ZeroAddress)).not.to.be.reverted;
//       await expect(paymentToken.totalSupply()).not.to.be.reverted;
//     });
//   });

//   describe("When a user buys an ERC20 from the Token contract", async () => {
//     const TEST_ETH_VALUE = ethers.parseUnits("1", "ether");

//     let ETH_BALANCE_BEFORE_TX: bigint;
//     let ETH_BALANCE_AFTER_TX: bigint;
//     let TOKEN_BALANCE_BEFORE_TX: bigint;
//     let TOKEN_BALANCE_AFTER_TX: bigint;
//     let TX_FEES: bigint;

//     beforeEach(async () => {
//       ETH_BALANCE_BEFORE_TX = await ethers.provider.getBalance(acct1.getAddress());
//       TOKEN_BALANCE_BEFORE_TX = await paymentTokenContract.balanceOf(acct1.getAddress());

//       // value is in WEI, not ETH
//       const buyTokensTx = await tokenSaleContract.connect(acct1).buyTokens({
//         value: TEST_ETH_VALUE,
//       });

//       const receipt = await buyTokensTx.wait();

//       ETH_BALANCE_AFTER_TX = await ethers.provider.getBalance(acct1.getAddress());
//       TOKEN_BALANCE_AFTER_TX = await paymentTokenContract.balanceOf(acct1.getAddress());

//       const gasUsed = receipt?.gasUsed ?? 0n;
//       const gasPrice = buyTokensTx?.gasPrice ?? 0n;

//       TX_FEES = gasUsed * gasPrice;
//     });

//     it("charges the correct amount of ETH", async () => {
//       const diff = TOKEN_BALANCE_BEFORE_TX - TOKEN_BALANCE_AFTER_TX;
//       const expectedDiff = TEST_ETH_VALUE * RATIO + TX_FEES;
//       expect(diff).to.eq(expectedDiff);
//     });

//     it("gives the correct amount of tokens", async () => {
//       throw new Error("Not implemented");
//     });
//   });

//   describe("When a user burns an ERC20 at the Shop contract", async () => {
//     it("gives the correct amount of ETH", async () => {
//       throw new Error("Not implemented");
//     });

//     it("burns the correct amount of tokens", async () => {
//       throw new Error("Not implemented");
//     });
//   });

//   describe("When a user buys an NFT from the Shop contract", async () => {
//     it("charges the correct amount of ERC20 tokens", async () => {
//       throw new Error("Not implemented");
//     });

//     it("gives the correct NFT", async () => {
//       throw new Error("Not implemented");
//     });
//   });

//   describe("When a user burns their NFT at the Shop contract", async () => {
//     it("gives the correct amount of ERC20 tokens", async () => {
//       throw new Error("Not implemented");
//     });
//   });

//   describe("When the owner withdraws from the Shop contract", async () => {
//     it("recovers the right amount of ERC20 tokens", async () => {
//       throw new Error("Not implemented");
//     });

//     it("updates the owner pool account correctly", async () => {
//       throw new Error("Not implemented");
//     });
//   });
// });