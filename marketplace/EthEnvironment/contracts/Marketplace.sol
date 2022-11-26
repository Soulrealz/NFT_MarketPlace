// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MarketItem.sol";

import "../../node_modules/hardhat/console.sol";
struct NFTListing 
{
    uint256 price;
    address seller;
    NFTItem item;
}

contract NFTMarket is Ownable
{   
    mapping(uint256 => NFTListing) private __listings;

    error InvalidPrice();
    error NFTNotListedForSale();
    error NotTheOwner();
    error ZeroBalance();

    event NFTListed(uint tokenID, uint price, address from, address to);
    event NFTBought(uint tokenID, address from, address newOwner);
    event NFTListingCancelled(address from, address to);

    constructor() {}

    function listNFT(uint tokenID, uint price, NFTItem item) external 
    {
        if (price <= 0)
        {
            revert InvalidPrice();
        }
        item.transferFrom(msg.sender, address(this), tokenID);
        __listings[tokenID] = NFTListing(price, msg.sender, item);
        emit NFTListed(tokenID, price, msg.sender, address(this));
    }

    function buyNFT(uint tokenID, NFTItem item) external payable
    {
        NFTListing memory listing = __listings[tokenID];
        if (listing.price == 0) 
        {
            revert NFTNotListedForSale();
        }
        if (listing.price != msg.value)
        {
            revert InvalidPrice();
        }
        item.transferFrom(address(this), msg.sender, tokenID);
        payable(listing.seller).transfer(listing.price * 98 / 100);
        console.log("value - ", msg.value);
        console.log("transfer - ", listing.price * 98 / 100);
        console.log("balance - ", address(this).balance);
        removeNFTFromListing(tokenID);
        
        emit NFTBought(tokenID, address(this), msg.sender);
        console.log("555");
    }

    function cancelListing(uint tokenID) external
    {
        NFTListing memory listing = __listings[tokenID];
        if (listing.price == 0) 
        {
            revert NFTNotListedForSale();
        }
        if (listing.seller != msg.sender)
        {
            revert NotTheOwner();
        }

        listing.item.transferFrom(address(this), msg.sender, tokenID);
        removeNFTFromListing(tokenID);

        emit NFTListingCancelled(address(this), msg.sender);
    }

    function removeNFTFromListing(uint tokenID) private 
    {
        __listings[tokenID].price = 0;
        __listings[tokenID].seller = address(0);
    }

    function withdrawFunds() external onlyOwner
    {
        uint balance = address(this).balance;
        if (balance == 0)
        {
            revert ZeroBalance();
        }

        payable(owner()).transfer(balance);
    }
}