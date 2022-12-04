import {gql, useQuery} from "@apollo/client";
import useSigner from "./signer";
import { NFT } from "./interfaces";
import { GetListedByOtherUsers, GetListedByOtherUsersVariables, GetListedByOtherUsers_nftlisteds } from "./__generated__/GetListedByOtherUsers";

const useListedByOthers = () => {
    const {address} = useSigner();
    const {data} = useQuery<GetListedByOtherUsers, GetListedByOtherUsersVariables>(GET_LISTED_BY_OTHER_USER, {variables: {not_owned_by: address ?? ""}, skip: !address});

    let listedNFTs = data?.nftlisteds.map(formatNFT);
    return listedNFTs;
}

const formatNFT = (raw: GetListedByOtherUsers_nftlisteds): NFT => {
    return {
        id: raw.id,
        owner: raw.from,
        tokenURI: "0",
        price: raw.price,
    }
}

const GET_LISTED_BY_OTHER_USER = gql
`
    query GetListedByOtherUsers($not_owned_by: String!) {
        nftlisteds(where: {from_not: $not_owned_by}) {
            id
            price
            from
          }
    }
`

export default useListedByOthers;