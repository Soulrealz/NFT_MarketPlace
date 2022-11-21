import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "hardhat/internal/hardhat-network/stack-traces/model";
import { NFTItem, NFTItem__factory } from "../typechain-types";


describe ("NFTMarket", () => {
  let nftMarket: Contract;
  let nftItem: Contract;

  before(async () => {
    const MarketItem = await ethers.getContractFactory('NFTItem');
    nftItem = await MarketItem.deploy();
    await nftItem.deployed();

    const MarketPlace = await ethers.getContractFactory('NFTMarket');
    nftMarket = await MarketItem.deploy();
    await nftMarket.deployed();

  })

  const createNFT = async (tokenURI: string) => {
    const transaction = await nftItem.createNFT(tokenURI);
    const receipt = await transaction.wait();
    const tokenID = receipt.events[0].args.tokenId;

    return tokenID;
  }

  describe("MarketItem", function () {
  
    it("should create nft", async () => {  
      const tokenURI = 'https://some.uri/';    
      const tokenID = await createNFT(tokenURI);
      // Check if new NFT tokenURI is same as the one sent to createNFT func      
      const mintedTokenURI = await nftItem.tokenURI(tokenID);
      expect(mintedTokenURI).to.equal(tokenURI);
  
      const owner = await nftItem.ownerOf(tokenID);
      const signers = await ethers.getSigners();
      const currentAddr = await signers[0].getAddress();
      expect(owner).to.equal(currentAddr);
    })
  });

  describe("ListNFT", function () {

    it("should revert if price is zero", async () => {
      const tokenURI = 'https://some.uri/'; 
      const tokenID = await createNFT(tokenURI);
      let item: NFTItem = NFTItem__factory.
      const transaction = nftMarket.listNFT(tokenID, 0);
      await expect (transaction).to.be.revertedWithCustomError(nftMarket, "InvalidPrice");
    })
  })
})

