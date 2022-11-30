// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MarketItem.sol";

import "../../node_modules/hardhat/console.sol";


contract NFTMarket is Ownable
{   
    struct NFTListing 
    {
        uint256 price;
        address seller;
        NFTItem item;
        bool isForSale;
    }

    mapping(uint256 => NFTListing) private __listings;
    mapping(address => uint) private __userFunds;

    error InvalidPrice();
    error InsufficientFunds();
    error NFTNotListedForSale();
    error NotTheOwner();
    error ZeroBalance();
    error FailedToSendEther();

    event NFTListed(uint tokenID, uint price, address from, address to);
    event NFTBought(uint tokenID, address from, address newOwner);
    event NFTListingCancelled(address from, address to);

    constructor() {}

    function listNFT(uint tokenID, uint price, NFTItem item) external 
    {
        if (price == 0)
        {
            revert InvalidPrice();
        }
        item.transferFrom(msg.sender, address(this), tokenID);
        __listings[tokenID] = NFTListing(price, msg.sender, item, true);
        emit NFTListed(tokenID, price, msg.sender, address(this));
    }

    function buyNFT(uint tokenID, NFTItem item) external payable
    {
        NFTListing memory listing = __listings[tokenID];
        if (!listing.isForSale) 
        {
            revert NFTNotListedForSale();
        }
        if (listing.price != msg.value)
        {
            revert InsufficientFunds();
        }
        item.transferFrom(address(this), msg.sender, tokenID);
        __userFunds[listing.seller] += listing.price * 98 / 100;
        __userFunds[owner()] += (listing.price - (listing.price * 98 / 100));
        removeNFTFromListing(tokenID);
        
        emit NFTBought(tokenID, address(this), msg.sender);
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
        delete __listings[tokenID];
    }

    // function withdrawFunds() external onlyOwner
    // {
    //     uint balance = address(this).balance;
    //     if (balance == 0)
    //     {
    //         revert ZeroBalance();
    //     }

    //     (bool sent, ) = address(owner()).call{value: balance}("");
    //     if (!sent)
    //     {
    //         revert FailedToSendEther();
    //     }
    //     //payable(owner()).transfer(balance);
    // }

    function userWithdrawMoney() external 
    {
        uint balance = __userFunds[msg.sender];
        // console.log("owner bal: ", __userFunds[owner()]);
        // console.log("this bal: ", address(this).balance);
        // console.log("msg.sender addr: ", address(msg.sender));
        // console.log("msg.sender bal: ", balance);
        if (balance == 0)
        {
            revert ZeroBalance();
        }

        (bool sent, ) = msg.sender.call{value: balance}("");
        if (!sent)
        {
            revert FailedToSendEther();
        }
        delete __userFunds[msg.sender];
        // console.log("post delete:");
        // console.log("owner bal: ", __userFunds[owner()]);
        // console.log("this bal: ", address(this).balance);
        // console.log("msg.sender addr: ", address(msg.sender));
        // console.log("msg.sender bal: ", __userFunds[msg.sender]);
    }
}