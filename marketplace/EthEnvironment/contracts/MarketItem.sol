// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTItem is ERC721URIStorage 
{   
    using Counters for Counters.Counter;
    Counters.Counter private __tokenIds;

    event CreatedNFT(uint tokenID, address owner, string tokenURI);

    constructor() ERC721("Blank NFTs", "BNFT") {}

    function createNFT(string calldata tokenURI) public
    {
        __tokenIds.increment();
        uint currentID = __tokenIds.current();
        _safeMint(msg.sender, currentID);
        _setTokenURI(currentID, tokenURI);

        emit CreatedNFT(currentID, msg.sender, tokenURI);
    }
}