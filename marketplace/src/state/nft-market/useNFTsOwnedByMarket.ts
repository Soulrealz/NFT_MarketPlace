import {gql, useQuery} from "@apollo/client";
import { NFT } from "./interfaces";
import { GetNFTsOwnedByMarket, GetNFTsOwnedByMarketVariables, GetNFTsOwnedByMarket_createdNFTs } from "./__generated__/GetNFTsOwnedByMarket";

const NFT_MARKET_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string;

const useNFTsOwnedByMarket = () => {
    const {data} = useQuery<GetNFTsOwnedByMarket, GetNFTsOwnedByMarketVariables>(GET_OWNED_BY_MARKET, {variables: {owner: NFT_MARKET_ADDRESS ?? ""}, skip: !NFT_MARKET_ADDRESS});
    let listedNFTs = data?.createdNFTs.map(formatNFT);

    const mapOfNfts = new Map(
        listedNFTs?.map(object => {
            return [object.id, object.tokenURI];
        })
    );
    return mapOfNfts;
}

const formatNFT = (raw: GetNFTsOwnedByMarket_createdNFTs): NFT => {
    
    return {
        id: raw.id,
        owner: NFT_MARKET_ADDRESS,
        tokenURI: raw.tokenURI,
        price: "0",
    }
}

const GET_OWNED_BY_MARKET = gql
`
    query GetNFTsOwnedByMarket($owner: String!) {
        createdNFTs(where: {owner: $owner}) {
            id        
            tokenURI
        }
    }
`;

export default useNFTsOwnedByMarket;