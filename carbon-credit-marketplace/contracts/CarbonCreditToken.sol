// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CarbonCreditToken is ERC20 {
    address public admin;

    constructor(uint256 initialSupply) ERC20("CarbonCredit", "CCT") {
        admin = msg.sender; // The deployer is the admin
        _mint(msg.sender, initialSupply); // Mint initial supply to the admin
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == admin, "Only admin can mint");
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount); // Allow users to burn their tokens
    }

    function changeAdmin(address newAdmin) external {
        require(msg.sender == admin, "Only admin can change admin");
        admin = newAdmin;
    }
}
