// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";  // Import SafeMath

interface IMyToken {
  function getPastVotes(address, uint256) external view returns (uint256);
}

/// @title Voting with delegation.
contract TokenizedBallot {
    using SafeMath for uint256;  // Use SafeMath for uint256
    IMyToken tokenContract;

    mapping(address => uint256) public votingPowerSpent;
    mapping(address => uint256) public voterBalances;
    event Voted(address indexed voter, uint proposal, uint256 amount);

    // This is a type for a single proposal.
    struct Proposal {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    address public chairperson;

    // A dynamically-sized array of `Proposal` structs.
    Proposal[] public proposals;

    uint256 targetBlockNumber;

    /// Create a new ballot to choose one of `proposalNames`.
    constructor(bytes32[] memory proposalNames, address _tokenContract, uint256 _targetBlockNumber) {
        tokenContract = IMyToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;

        // For each of the provided proposal names,
        // create a new proposal object and add it
        // to the end of the array.
        for (uint i = 0; i < proposalNames.length; i++) {
            // `Proposal({...})` creates a temporary
            // Proposal object and `proposals.push(...)`
            // appends it to the end of `proposals`.
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    /// @notice Votes for a proposal
    /// @param proposal The index of the proposal to vote for
    /// @param amount The amount of votes you wish to cast
    function vote(uint proposal, uint256 amount) external {
        require(proposal < proposals.length, "Invalid proposal index");

        // number of tokens required to cast a given number of votes for a single topic
        require(amount <= type(uint256).max / amount, "TokenizedBallot: amount too large");
        uint256 cost = amount ** 2;

        // Ensure the user has enough tokens to cast vote amount
        require( votingPower(msg.sender) >= cost, "TokenizedBallot: trying to vote more than allowed");

        votingPowerSpent[msg.sender] += cost;
        proposals[proposal].voteCount += amount;

        updateVoterBalance();
        emit Voted(msg.sender, proposal, amount);
    }

    function votingPower(address account) public view returns (uint256) {
        require(account != address(0), "Invalid address");
        return tokenContract.getPastVotes(account, targetBlockNumber) - votingPowerSpent[account];
    }

    function updateVoterBalance() public {
        voterBalances[msg.sender] = votingPower(msg.sender);
    }


    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}
