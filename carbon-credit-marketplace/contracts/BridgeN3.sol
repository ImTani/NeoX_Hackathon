// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BridgeN3 {
    uint public nonce;
    address public treasury;

    event Deposit(address indexed user, uint256 amount, string recipient, uint256 nonce);

    constructor(address _treasury) {
        treasury = _treasury;
    }

    function deposit(string memory recipient) public payable {
        require(msg.value > 0, "Amount must be greater than zero");
        emit Deposit(msg.sender, msg.value, recipient, nonce++);
        payable(treasury).transfer(msg.value); // Transfer to treasury if needed
    }

    // Add function to validate and handle signatures from validators
}
