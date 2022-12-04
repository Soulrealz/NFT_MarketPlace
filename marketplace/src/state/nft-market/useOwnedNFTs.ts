import {gql, useQuery} from "@apollo/client";
import { NFT } from "./interfaces";
import useSigner from "./signer";
import { GetOwnedNFTs, GetOwnedNFTsVariables, GetOwnedNFTs_createdNFTs } from "./__generated__/GetOwnedNFTs";

const useOwnedNFTs = () => {
    const {address} = useSigner();
    const {data} = useQuery<GetOwnedNFTs, GetOwnedNFTsVariables>(GET_OWNER_NFTS, {variables: {owner: address ?? ""}, skip: !address});

    let ownedNFTs = data?.createdNFTs.map(formatNFT);
    return {ownedNFTs};
}

const formatNFT = (raw: GetOwnedNFTs_createdNFTs): NFT => {
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

export default useOwnedNFTs;