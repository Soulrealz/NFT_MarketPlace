import {gql, useQuery} from "@apollo/client";
import { NFT } from "./interfaces";
import useSigner from "./signer";
import { GetListedNFTs, GetListedNFTsVariables, GetListedNFTs_nftlisteds } from "./__generated__/GetListedNFTs";
import { GetOwnedNFTs, GetOwnedNFTsVariables, GetOwnedNFTs_createdNFTs } from "./__generated__/GetOwnedNFTs";

// const useListedNFTs = () => {
//     const {address} = useSigner();
//     const {data} = useQuery<GetListedNFTs, GetListedNFTsVariables>(GET_LISTED_NFTS, {variables: {owner: address ?? ""}, skip: !address});

//     return data;
// }

const useOwnedNFTs = () => {
    const {address} = useSigner();
    const {data} = useQuery<GetOwnedNFTs, GetOwnedNFTsVariables>(GET_OWNER_NFTS, {variables: {owner: address ?? ""}, skip: !address});

    let ownedNFTs = data?.createdNFTs.map(addPriceFieldToNFT);
    return {ownedNFTs};
}



const addPriceFieldToNFT = (raw: GetOwnedNFTs_createdNFTs): NFT => {
    return {
        id: raw.id,
        owner: raw.owner,
        tokenURI: raw.tokenURI,
        price: "0",
    }
}


const GET_OWNER_NFTS = gql
`
    query GetOwnedNFTs($owner: String!) {
        createdNFTs(where: {owner: $owner}) {
            id
            owner
            tokenURI
          }
    }
`;
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
`

export default useOwnedNFTs;