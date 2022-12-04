import useListedByOthers from "./useListedByOtherUsers";
import useListedNFTs from "./useListedNFTs";
import useNFTsOwnedByMarket from "./useNFTsOwnedByMarket";

export function listedNFTsWithURI() {
    const listedNFTs = useListedNFTs();
    const marketOwned = useNFTsOwnedByMarket();

    if (listedNFTs != null) {
        for (let i: number = 0; i < listedNFTs.length; i++) {
            listedNFTs[i].tokenURI = marketOwned.get(listedNFTs[i].id);
        }
    }
    return listedNFTs;
}

export function listedByNotCurrentUser() {
    const listedNFTs = useListedByOthers();
    const marketOwned = useNFTsOwnedByMarket();

    if (listedNFTs != null) {
        for (let i: number = 0; i < listedNFTs.length; i++) {
            listedNFTs[i].tokenURI = marketOwned.get(listedNFTs[i].id);            
        }
    }
    return listedNFTs;
}