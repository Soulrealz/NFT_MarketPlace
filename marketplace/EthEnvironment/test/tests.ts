import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "hardhat/internal/hardhat-network/stack-traces/model";
const BigNumber = require('bignumber.js');


describe ("NFTMarket", () => {
  let nftMarket: Contract;
  let nftItem: Contract;

  before(async () => {
    const MarketItem = await ethers.getContractFactory('NFTItem');
    nftItem = await MarketItem.deploy();
    await nftItem.deployed();

    const MarketPlace = await ethers.getContractFactory('NFTMarket');
    nftMarket = await MarketPlace.deploy();
    await nftMarket.deployed();

  })

  const createNFT = async (tokenURI: string) => {
    const transaction = await nftItem.createNFT(tokenURI);
    const receipt = await transaction.wait();
    const tokenID = receipt.events[0].args.tokenId;

    return tokenID;
  }

  // describe("tester", function() {
  //   it("idk", async () => {
  //     const transaction = await nftItem.createNFT('https://some.uri/');
  //     const receipt = await transaction.wait();
  //     //console.log("Addr1: ", await (await ethers.getSigners())[0].getAddress(), "\n",);
  //     //console.log("Ev0: from to tokenId\n", receipt.events[0].args.from, "\n", receipt.events[0].args.to, "\n", receipt.events[0].args.tokenId);
  //     //console.log("\n\nEv1: owner tokenURI tokenId\n", receipt.events[1].args.owner, "\n", receipt.events[1].args.tokenURI, "\n", receipt.events[1].args.tokenID);
  //     const tokenID = receipt.events[0].args.tokenId;

  //     //console.log("\n\nNFTItem Address: ", nftItem.address, "\nNFTMarket Address: ", nftMarket.address, "\n");
  //     await nftItem.approve(nftMarket.address, tokenID);
  //     const tr2 = await nftMarket.listNFT(tokenID, 13, nftItem.address);
  //     const rc2 = await tr2.wait();

  //   })
  // })

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
    const tokenURI = 'https://some.uri/';

    it("should revert if price is zero", async () => {             
      const tokenID = await createNFT(tokenURI);

      await expect(nftMarket.listNFT(tokenID, 0, nftItem.address)).to.be.revertedWithCustomError(nftMarket, "InvalidPrice");
    })

    it("should revert if not called by owner", async () => {
      const [addr1, addr2] = await ethers.getSigners();
      const tokenID = await createNFT(tokenURI);

      await expect(nftMarket.connect(addr2).listNFT(tokenID, 13, nftItem.address)).to.be.revertedWith("ERC721: caller is not token owner or approved");
    })

    it("should list token for sale", async () => {
      const tokenID = await createNFT(tokenURI);
      await nftItem.approve(nftMarket.address, tokenID);
      await expect(nftMarket.listNFT(tokenID, 13, nftItem.address)).to.emit(nftMarket, "NFTListed");
    })
  })

  describe("buyNFT", function () {
    const tokenURI = 'https://some.uri/';

    it("should revert if nft is not listed", async () => {
      await expect(nftMarket.buyNFT(1234, nftItem.address,)).to.be.revertedWithCustomError(nftMarket, "NFTNotListedForSale");
    })

    it("should revert if eth send is not equal to price", async () => {      
      const tokenID = await createNFT(tokenURI);
      await nftItem.approve(nftMarket.address, tokenID);
      await nftMarket.listNFT(tokenID, 13, nftItem.address);
      await expect(nftMarket.buyNFT(tokenID, nftItem.address, {value: 12})).to.be.revertedWithCustomError(nftMarket, "InvalidPrice");
    })

    it("should buy nft successfully", async () => {
      const tokenID = await createNFT(tokenURI);

      const [addr1, addr2] = await ethers.getSigners();
      const sellerBalance = await addr1.getBalance();
      const price = 12345;
      await nftItem.approve(nftMarket.address, tokenID);
      await nftMarket.listNFT(tokenID, price, nftItem.address);
      await new Promise(r => setTimeout(r, 100));

      const MIDBALANCE = await addr1.getBalance();
      console.log("MIDBAL: ", ethers.utils.formatEther(MIDBALANCE), "\n");      
      
      await nftMarket.connect(addr2).buyNFT(tokenID, nftItem.address, {value: price});
      await new Promise(r => setTimeout(r, 100));
      const newSellerBalance = await addr1.getBalance();
      console.log("Balance of seller: ", ethers.utils.formatEther(sellerBalance), "\n");
      console.log("Balance of seller: ", ethers.utils.formatEther(newSellerBalance), "\n");
      console.log("wat da: ", ethers.utils.formatEther(MIDBALANCE));
      console.log("fak? ", ethers.utils.formatEther(newSellerBalance));
      console.log("--------------------------------");
      const numb = "5" - "3";
      console.log(numb);
      console.log("--------------------------------");
      const diff = ethers.utils.formatEther(MIDBALANCE) - ethers.utils.formatEther(newSellerBalance);
      console.log("Diff: ", diff);
      const profit = Math.floor((price * 98) / 100);
      console.log("Profit: ", profit);
      const fee = price - profit;

      console.log("old: ", ethers.utils.formatEther(sellerBalance))
      console.log("mid: ", ethers.utils.formatEther(MIDBALANCE))
      console.log("new: ", ethers.utils.formatEther(newSellerBalance))
      console.log("profit: ", profit)
      expect(diff).to.equal(profit);
      //ADD CHECK FOR CONTRACT BALANCE DO NOT ASSUME ITS 0
    })
  })
})

