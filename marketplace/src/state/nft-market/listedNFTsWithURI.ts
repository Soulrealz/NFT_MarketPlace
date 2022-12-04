import useListedNFTs from "./useListedNFTs";
import useNFTsOwnedByMarket from "./useNFTsOwnedByMarket";

const NFT_MARKET_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string;

export function listedNFTsWithURI() {
    const listedNFTs = useListedNFTs();
    const marketOwned = useNFTsOwnedByMarket();

    if (listedNFTs != null) {
        for (let i: number = 0; i < listedNFTs?.length; i++) {
            listedNFTs[i].tokenURI = marketOwned.get(listedNFTs[i].id);
        }
    }
    return listedNFTs;
}
