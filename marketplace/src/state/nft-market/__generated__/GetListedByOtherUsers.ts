/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetListedByOtherUsers
// ====================================================

export interface GetListedByOtherUsers_nftlisteds {
  __typename: "NFTListed";
  id: string;
  price: any;
  from: any;
  to: any;
}

export interface GetListedByOtherUsers {
  nftlisteds: GetListedByOtherUsers_nftlisteds[];
}

export interface GetListedByOtherUsersVariables {
  not_owned_by: string;
}
