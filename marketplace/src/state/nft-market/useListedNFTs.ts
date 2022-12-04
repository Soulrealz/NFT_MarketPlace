import {gql, useQuery} from "@apollo/client";
import useSigner from "./signer";
import { NFT } from "./interfaces";
import { GetListedNFTs, GetListedNFTsVariables, GetListedNFTs_nftlisteds } from "./__generated__/GetListedNFTs";

const useListedNFTs = () => {
    const {address} = useSigner();
    const {data} = useQuery<GetListedNFTs, GetListedNFTsVariables>(GET_LISTED_NFTS, {variables: {owner: address ?? ""}, skip: !address});

    let listedNFTs = data?.nftlisteds.map(formatNFT);
    return listedNFTs;
}

const formatNFT = (raw: GetListedNFTs_nftlisteds): NFT => {
    return {
        id: raw.id,
        owner: raw.from,
        tokenURI: "0",
        price: raw.price,
    }
}

const GET_LISTED_NFTS = gql
`
    query GetListedNFTs($owner: String!) {
        nftlisteds(where: {from: $owner}) {
            id
            price
            from
            to
          }
    }
`;

export default useListedNFTs;