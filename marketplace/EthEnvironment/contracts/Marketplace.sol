// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MarketItem.sol";

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

    event NFTListed(uint tokenID, uint price);
    event NFTBought(uint tokenID, address newOwner);
    event NFTListingCancelled();

    constructor() {}

    function listNFT(uint tokenID, uint price, NFTItem item) external 
    {
        if (price < 0)
        {
            revert InvalidPrice();
        }

        item.approve(address(this), tokenID);
        item.transferFrom(msg.sender, address(this), tokenID);
        __listings[tokenID] = NFTListing(price, msg.sender, item);
        emit NFTListed(tokenID, price);
    }

    function buyNFT(uint tokenID) external payable
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

        listing.item.transferFrom(address(this), msg.sender, tokenID);
        payable(listing.seller).transfer(listing.price * 98 / 100);
        removeNFTFromListing(tokenID);

        emit NFTBought(tokenID, msg.sender);
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

        emit NFTListingCancelled();
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