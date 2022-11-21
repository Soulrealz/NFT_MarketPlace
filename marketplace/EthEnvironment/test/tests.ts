import { expect } from "chai";
import { ethers } from "hardhat";

describe("MarketItem", function () {
  
  it("should create nft", async () => {
    const MarketItem = await ethers.getContractFactory('NFTItem');
    const item = await MarketItem.deploy();
    await item.deployed();

    const tokenURI = 'https://some.uri/';
    const transaction = await item.createNFT(tokenURI);
    const receipt = await transaction.wait();

    // Check if new NFT tokenURI is same as the one sent to createNFT func
    const tokenID = receipt.events[0].args.tokenId;
    const mintedTokenURI = await item.tokenURI(tokenID);
    expect(mintedTokenURI).to.equal(tokenURI);

    const owner = await item.ownerOf(tokenID);
    const signers = await ethers.getSigners();
    const currentAddr = await signers[0].getAddress();
    expect(owner).to.equal(currentAddr);
  })
});
