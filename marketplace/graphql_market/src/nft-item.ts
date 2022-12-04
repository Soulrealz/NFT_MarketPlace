import {
  CreatedNFT as CreatedNFTEvent,
  NFTItem
} from "../generated/NFTItem/NFTItem"
import {
  CreatedNFT
} from "../generated/schema"

export function handleCreatedNFT(event: CreatedNFTEvent): void {
  const nft = new CreatedNFT(event.params.tokenID.toString());
  nft.owner = event.params.owner;
  const contract = NFTItem.bind(event.address);
  nft.tokenURI = contract.tokenURI(event.params.tokenID);
  nft.save()
}
