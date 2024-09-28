// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CarbonCreditToken.sol";

contract CarbonMarketplace {
    CarbonCreditToken public carbonToken;
    address public admin;

    struct Listing {
        uint256 amount;
        uint256 pricePerToken;
        address seller;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public nextListingId;

    event Listed(uint256 listingId, address seller, uint256 amount, uint256 pricePerToken);
    event Bought(uint256 listingId, address buyer, uint256 amount);

    constructor(address _carbonToken) {
        carbonToken = CarbonCreditToken(_carbonToken);
        admin = msg.sender;
    }

    function listTokens(uint256 amount, uint256 pricePerToken) external {
        require(carbonToken.balanceOf(msg.sender) >= amount, "Insufficient balance to list");

        // Create a new listing
        listings[nextListingId] = Listing(amount, pricePerToken, msg.sender);
        emit Listed(nextListingId, msg.sender, amount, pricePerToken);
        nextListingId++;
    }

    function buyTokens(uint256 listingId) external payable {
        Listing memory listing = listings[listingId];
        require(msg.value == listing.amount * listing.pricePerToken, "Incorrect ETH amount sent");

        // Transfer tokens from seller to buyer
        carbonToken.transferFrom(listing.seller, msg.sender, listing.amount);
        payable(listing.seller).transfer(msg.value); // Pay the seller

        delete listings[listingId]; // Remove the listing
        emit Bought(listingId, msg.sender, listing.amount);
    }
}
