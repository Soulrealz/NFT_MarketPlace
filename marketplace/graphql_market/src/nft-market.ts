import { store } from "@graphprotocol/graph-ts";
import {
  NFTBought as NFTBoughtEvent,
  NFTListed as NFTListedEvent,
  NFTListingCancelled as NFTListingCancelledEvent,
} from "../generated/NFTMarket/NFTMarket"
import {
  CreatedNFT,
  NFTBought,
  NFTListed,
  NFTListingCancelled,
} from "../generated/schema"

export function handleNFTBought(event: NFTBoughtEvent): void {
  const nft = new NFTBought(event.params.tokenID.toString());
  nft.from = event.params.from;
  nft.newOwner = event.params.newOwner;
  nft.save()

  //change owner param of previously emitted event
  let createdEvent = CreatedNFT.load(event.params.tokenID.toString());
  let rewriteEvent = new CreatedNFT(event.params.tokenID.toString());
  if (createdEvent != null) {
    rewriteEvent.owner = event.params.newOwner;
    rewriteEvent.tokenURI = createdEvent.tokenURI;
    rewriteEvent.save();
  }

  //remove listed event
  store.remove('NFTListed', event.params.tokenID.toString())
}

export function handleNFTListed(event: NFTListedEvent): void {
  const nft = new NFTListed(event.params.tokenID.toString());
  nft.price = event.params.price;
  nft.from = event.params.from;  
  nft.to = event.params.to;
  nft.save()

  //change owner param of previously emitted event
  let createdEvent = CreatedNFT.load(event.params.tokenID.toString());
  let rewriteEvent = new CreatedNFT(event.params.tokenID.toString());
  if (createdEvent != null) {
    rewriteEvent.owner = event.params.to;
    rewriteEvent.tokenURI = createdEvent.tokenURI;
    rewriteEvent.save();
  }
}

export function handleNFTListingCancelled(event: NFTListingCancelledEvent): void {
  const nft = new NFTListingCancelled(event.params.tokenID.toString());
  nft.from = event.params.from;
  nft.to = event.params.to;  
  nft.save()

  //change owner param of previously emitted event
  let createdEvent = CreatedNFT.load(event.params.tokenID.toString());
  let rewriteEvent = new CreatedNFT(event.params.tokenID.toString());
  if (createdEvent != null) {
    rewriteEvent.owner = event.params.to;
    rewriteEvent.tokenURI = createdEvent.tokenURI;
    rewriteEvent.save();
  }

  //remove listed event
  store.remove('NFTListed', event.params.tokenID.toString())
}
