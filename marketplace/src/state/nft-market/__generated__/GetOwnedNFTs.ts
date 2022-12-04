/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOwnedNFTs
// ====================================================

export interface GetOwnedNFTs_createdNFTs {
  __typename: "CreatedNFT";
  id: string;
  owner: any;
  tokenURI: string;
}

export interface GetOwnedNFTs {
  createdNFTs: GetOwnedNFTs_createdNFTs[];
}

export interface GetOwnedNFTsVariables {
  owner: string;
}
