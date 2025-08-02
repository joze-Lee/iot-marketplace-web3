// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IDataPublisher {
    function getDataEntry(uint256 dataId) external view returns (
        uint256 id,
        address publisher,
        string memory dataHash,
        string memory description,
        uint256 timestamp,
        bool isAvailable
    );
}

contract Marketplace {
    struct Listing {
        uint256 dataId;
        address publisher;
        uint256 price; // in wei
        bool isSold;
    }

    address public owner;
    IDataPublisher public dataPublisher;

    mapping(uint256 => Listing) public listings;  // dataId => Listing
    mapping(uint256 => address) public buyers;    // dataId => buyer
    mapping(address => uint256) public earnings;  // publisher => balance

    event DataListed(uint256 dataId, address publisher, uint256 price);
    event DataPurchased(uint256 dataId, address buyer);

    constructor(address dataPublisherAddress) {
        owner = msg.sender;
        dataPublisher = IDataPublisher(dataPublisherAddress);
    }

    function listData(uint256 dataId, uint256 price) external {
        (
            ,
            address publisher,
            ,
            ,
            ,
            bool isAvailable
        ) = dataPublisher.getDataEntry(dataId);

        require(isAvailable, "Data not available");
        require(publisher == msg.sender, "Only publisher can list");

        listings[dataId] = Listing({
            dataId: dataId,
            publisher: msg.sender,
            price: price,
            isSold: false
        });

        emit DataListed(dataId, msg.sender, price);
    }

    function buyData(uint256 dataId) external payable {
        Listing storage listing = listings[dataId];
        require(!listing.isSold, "Already sold");
        require(msg.value == listing.price, "Incorrect payment");

        listing.isSold = true;
        buyers[dataId] = msg.sender;
        earnings[listing.publisher] += msg.value;

        emit DataPurchased(dataId, msg.sender);
    }

    function getDataHash(uint256 dataId) external view returns (string memory) {
        require(buyers[dataId] == msg.sender, "Not purchased");
        (
            ,
            ,
            string memory dataHash,
            ,
            ,
        ) = dataPublisher.getDataEntry(dataId);

        return dataHash;
    }

    function withdrawEarnings() external {
        uint256 amount = earnings[msg.sender];
        require(amount > 0, "Nothing to withdraw");
        earnings[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
