import {
  NFTBought as NFTBoughtEvent,
  NFTListed as NFTListedEvent,
  NFTListingCancelled as NFTListingCancelledEvent,
} from "../generated/NFTMarket/NFTMarket"
import {
  NFTBought,
  NFTListed,
  NFTListingCancelled,
} from "../generated/schema"

export function handleNFTBought(event: NFTBoughtEvent): void {
  const nft = new NFTBought(event.params.tokenID.toString());
  nft.from = event.params.from;
  nft.newOwner = event.params.newOwner;
  nft.save()
}

export function handleNFTListed(event: NFTListedEvent): void {
  const nft = new NFTListed(event.params.tokenID.toString());
  nft.price = event.params.price;
  nft.from = event.params.from;  
  nft.save()
}

export function handleNFTListingCancelled(
  event: NFTListingCancelledEvent
): void {
  const nft = new NFTListingCancelled(event.params.tokenID.toString());
  nft.from = event.params.from;
  nft.to = event.params.to;  
  nft.save()
}
