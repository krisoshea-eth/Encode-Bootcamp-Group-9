# Tokenized Voting

This project contains:
* A Front End for a Tokenized Ballot
* A Back End for handling sensitive actions (like Minting tokens)
* Smart Contracts
  * An ERC20 Voting contract
  * A Ballot contract that leverages state of ERC20 token contract

Additional features:
* Leverages Quadratic Voting, which decreasing voting power with the square root of the number of tokens owned. This is meant to spread out power, so incredibly rich folks don't have disportionate amount of power.
* Added a Revoke Delegation, so if an address you originally delegated to begins to misbehave, you can easily revoke your delegation.

Screenshot:
<img width="657" alt="Screenshot 2023-09-13 at 10 26 41 PM" src="https://github.com/krisoshea-eth/Encode-Bootcamp-Group-9/assets/30440525/08a1f911-a2ce-4b77-a235-4dc13f12249e">
