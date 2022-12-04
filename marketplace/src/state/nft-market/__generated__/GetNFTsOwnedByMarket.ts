/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNFTsOwnedByMarket
// ====================================================

export interface GetNFTsOwnedByMarket_createdNFTs {
  __typename: "CreatedNFT";
  id: string;
  tokenURI: string;
}

export interface GetNFTsOwnedByMarket {
  createdNFTs: GetNFTsOwnedByMarket_createdNFTs[];
}

export interface GetNFTsOwnedByMarketVariables {
  owner: string;
}
