// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CarbonCreditToken.sol";

contract Governance {
    CarbonCreditToken public carbonToken;

    struct Proposal {
        string description;
        uint256 voteCount;
        address proposer;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public nextProposalId;

    mapping(address => mapping(uint256 => bool)) public votes;

    event ProposalCreated(uint256 proposalId, string description);
    event Voted(uint256 proposalId, address voter);

    constructor(address _carbonToken) {
        carbonToken = CarbonCreditToken(_carbonToken);
    }

    function createProposal(string memory description) external {
        proposals[nextProposalId] = Proposal(description, 0, msg.sender);
        emit ProposalCreated(nextProposalId, description);
        nextProposalId++;
    }

    function vote(uint256 proposalId) external {
        require(carbonToken.balanceOf(msg.sender) > 0, "You must own tokens to vote");
        require(!votes[msg.sender][proposalId], "You have already voted");

        votes[msg.sender][proposalId] = true;
        proposals[proposalId].voteCount += carbonToken.balanceOf(msg.sender);

        emit Voted(proposalId, msg.sender);
    }

    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return proposals[proposalId];
    }
}
