// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CarbonCreditToken.sol";

contract CarbonMarketplace {
    CarbonCreditToken public carbonToken;
    address public admin;

    struct Order {
        uint256 amount;
        uint256 price;
        address trader;
        bool isBuyOrder;
    }

    struct UserReputation {
        uint256 totalTransactions;
        uint256 successfulTransactions;
    }

    mapping(uint256 => Order) public orders;
    uint256 public nextOrderId;
    mapping(address => UserReputation) public userReputations;

    event OrderCreated(uint256 orderId, address trader, uint256 amount, uint256 price, bool isBuyOrder);
    event OrderFulfilled(uint256 orderId, address buyer, address seller, uint256 amount, uint256 price);
    event OrderCancelled(uint256 orderId);

    constructor(address _carbonToken) {
        carbonToken = CarbonCreditToken(_carbonToken);
        admin = msg.sender;
    }

    function createLimitOrder(uint256 amount, uint256 price, bool isBuyOrder) external payable {
        if (isBuyOrder) {
            require(msg.value >= amount * price, "Insufficient ETH for buy order");
        } else {
            require(carbonToken.balanceOf(msg.sender) >= amount, "Insufficient token balance");
            require(carbonToken.allowance(msg.sender, address(this)) >= amount, "Insufficient token allowance");
        }

        orders[nextOrderId] = Order(amount, price, msg.sender, isBuyOrder);
        emit OrderCreated(nextOrderId, msg.sender, amount, price, isBuyOrder);
        nextOrderId++;

        tryMatchOrder(nextOrderId - 1);
    }

    function cancelOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(order.trader == msg.sender, "Not the order creator");
        require(order.amount > 0, "Order already fulfilled or cancelled");

        if (order.isBuyOrder) {
            payable(msg.sender).transfer(order.amount * order.price);
        }

        delete orders[orderId];
        emit OrderCancelled(orderId);
    }

    function tryMatchOrder(uint256 orderId) internal {
        Order storage currentOrder = orders[orderId];
        
        for (uint256 i = 0; i < nextOrderId; i++) {
            if (i == orderId) continue;
            
            Order storage matchingOrder = orders[i];
            if (matchingOrder.amount == 0) continue;
            if (currentOrder.isBuyOrder == matchingOrder.isBuyOrder) continue;
            
            if ((currentOrder.isBuyOrder && currentOrder.price >= matchingOrder.price) ||
                (!currentOrder.isBuyOrder && currentOrder.price <= matchingOrder.price)) {
                
                uint256 matchAmount = (currentOrder.amount < matchingOrder.amount) ? currentOrder.amount : matchingOrder.amount;
                uint256 matchPrice = matchingOrder.price;

                if (currentOrder.isBuyOrder) {
                    executeTransaction(currentOrder.trader, matchingOrder.trader, matchAmount, matchPrice);
                } else {
                    executeTransaction(matchingOrder.trader, currentOrder.trader, matchAmount, matchPrice);
                }

                currentOrder.amount -= matchAmount;
                matchingOrder.amount -= matchAmount;

                if (matchingOrder.amount == 0) {
                    delete orders[i];
                }

                if (currentOrder.amount == 0) {
                    delete orders[orderId];
                    break;
                }
            }
        }
    }

    function executeTransaction(address buyer, address seller, uint256 amount, uint256 price) internal {
        uint256 totalPrice = amount * price;

        carbonToken.transferFrom(seller, buyer, amount);
        payable(seller).transfer(totalPrice);

        updateReputation(buyer);
        updateReputation(seller);

        emit OrderFulfilled(nextOrderId, buyer, seller, amount, price);
    }

    function updateReputation(address user) internal {
        userReputations[user].totalTransactions++;
        userReputations[user].successfulTransactions++;
    }

    function getOrderDetails(uint256 orderId) external view returns (uint256, uint256, address, bool) {
        Order storage order = orders[orderId];
        return (order.amount, order.price, order.trader, order.isBuyOrder);
    }

    function getUserReputation(address user) external view returns (uint256, uint256) {
        UserReputation storage reputation = userReputations[user];
        return (reputation.totalTransactions, reputation.successfulTransactions);
    }
}