/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetListedNFTs
// ====================================================

export interface GetListedNFTs_nftlisteds {
  __typename: "NFTListed";
  id: string;
  price: any;
  from: any;
  to: any;
}

export interface GetListedNFTs {
  nftlisteds: GetListedNFTs_nftlisteds[];
}

export interface GetListedNFTsVariables {
  owner: string;
}
