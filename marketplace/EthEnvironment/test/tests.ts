import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { Contract } from "hardhat/internal/hardhat-network/stack-traces/model";
//const BigNumber = require('bignumber.js');

//TODO check event params
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

  describe("CreateNFT", function () {
  
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
      await expect(nftMarket.buyNFT(tokenID, nftItem.address, {value: 12})).to.be.revertedWithCustomError(nftMarket, "InsufficientFunds");
    })

    it("should buy nft successfully", async () => {
      const tokenID = await createNFT(tokenURI);

      const [addr1, addr2] = await ethers.getSigners();
      const price = 12345;
      await nftItem.approve(nftMarket.address, tokenID);
      await nftMarket.listNFT(tokenID, price, nftItem.address);
      await new Promise(r => setTimeout(r, 100));
      
      await expect(nftMarket.connect(addr2).buyNFT(tokenID, nftItem.address, {value: price})).to.emit(nftMarket, "NFTBought");
    })
  })

  describe("cancelListing", () => {
    const tokenURI = 'https://some.uri/';
    it("should revert if nft is not listed", async () => {
      await expect(nftMarket.cancelListing(9999)).to.be.revertedWithCustomError(nftMarket, "NFTNotListedForSale");
    })

    it("should revert if caller is not seller", async () => {
      const tokenID = await createNFT(tokenURI);
      await nftItem.approve(nftMarket.address, tokenID);
      await nftMarket.listNFT(tokenID, 13, nftItem.address);

      const [addr1, addr2] = await ethers.getSigners()
      await expect(nftMarket.connect(addr2).cancelListing(tokenID)).to.be.revertedWithCustomError(nftMarket, "NotTheOwner");
    })

    it("should transfer ownership back to seller", async () => {
      const tokenID = await createNFT(tokenURI);
      await nftItem.approve(nftMarket.address, tokenID);
      await nftMarket.listNFT(tokenID, 13, nftItem.address);
      await nftMarket.cancelListing(tokenID)
      const owner = await nftItem.ownerOf(tokenID);

      const [addr1, addr2] = await ethers.getSigners()
      expect(owner).to.equal(await addr1.getAddress());
    })
  })

  describe("withdrawFunds", () => {
    const tokenURI = 'https://some.uri/';
    // it("should revert if zero balance", async () => {
    //   const [addr1, addr2] = await ethers.getSigners()
    //   await expect(nftMarket.connect(addr2).userWithdrawMoney()).to.be.revertedWithCustomError(nftMarket, "ZeroBalance");
    // })

    it("should withdraw only certain address' eth", async () => {
      const [addr1, addr2, addr3] = await ethers.getSigners()
      await expect(nftMarket.connect(addr2).userWithdrawMoney()).to.be.revertedWithCustomError(nftMarket, "ZeroBalance")
      await expect(nftMarket.connect(addr3).userWithdrawMoney()).to.be.revertedWithCustomError(nftMarket, "ZeroBalance")
      //Clear Contract
      await nftMarket.userWithdrawMoney();
      //console.log("Beginning:\nAddr1: ", await addr1.getBalance(), "\nAddr2", await addr2.getBalance(), "\nAddr3", await addr3.getBalance());
      
      //List and Buy
      const transaction = await nftItem.connect(addr3).createNFT(tokenURI);
      const receipt = await transaction.wait();
      const tokenID = receipt.events[0].args.tokenId;

      const price = 66666;
      await nftItem.connect(addr3).approve(nftMarket.address, tokenID);
      await nftMarket.connect(addr3).listNFT(tokenID, price, nftItem.address);
      await new Promise(r => setTimeout(r, 100));

      await nftMarket.connect(addr2).buyNFT(tokenID, nftItem.address, {value: price})
      
      //console.log("Post Buy:\nAddr1: ", await addr1.getBalance(), "\nAddr2", await addr2.getBalance(), "\nAddr3", await addr3.getBalance());

      const oldBal = await addr3.getBalance();
      const withdrawTransact = await nftMarket.connect(addr3).userWithdrawMoney();
      const withdrawReceipt = await transaction.wait();
      const gas = receipt.gasUsed * receipt.effectiveGasPrice;
      //const newBal = (await addr3.getBalance()).add(gas);

      console.log("TESTTESTTESTTESTTESTTEST");
      console.log(oldBal);
      console.log(gas);
      console.log(oldBal.sub(gas));
      console.log(price);
      console.log(await addr3.getBalance());
      expect(oldBal.sub(gas).add(price)).to.eq(await addr3.getBalance());
      //console.log(oldBal.sub(gas).add(price).eq(await addr3.getBalance()));
    })

    // it("should transfer funds to deployer", async() => {
    //   const contractBal = await nftMarket.provider.getBalance(nftMarket.address);
    //   //returns 0 rn fix buy then this will work
    //   console.log("BALBALBAL:", contractBal);

    //   const [addr1, addr2] = await ethers.getSigners()
    //   const initialOwnerBal = await addr1.getBalance();
    //   const transaction = await nftMarket.userWithdrawMoney();
    //   const receipt = await transaction.wait();

      
    //   await new Promise((r) => setTimeout(r, 100));
    //   const gas = receipt.gasUsed * receipt.effectiveGasPrice;
    //   const newBalance = await addr1.getBalance() + gas;
    //   const transferred = newBalance - initialOwnerBal;
    //   //expect(transferred).to.equal(contractBal);
    // })

    // it("should revert if contract has zero ether", async () => {
    //   //const [addr1, addr2] = await ethers.getSigners();
    //   await nftMarket.userWithdrawMoney();
    //   //await nftMarket.userWithdrawMoney();
    //   //await expect(nftMarket.userWithdrawMoney()).to.be.revertedWithCustomError(nftMarket, "ZeroBalance");
    // })
  })
})

