// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BridgeX {
    event Transfer(address indexed recipient, uint256 amount, uint256 nonce);

    function processTransfer(address recipient, uint256 amount, uint256 nonce) public {
        // Validate incoming data and signatures
        // Transfer tokens for recipient
        payable(recipient).transfer(amount);
        emit Transfer(recipient, amount, nonce);
    }

    // Add function to validate signatures from the relayer
}
