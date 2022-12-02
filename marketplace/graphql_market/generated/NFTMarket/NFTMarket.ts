// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class NFTBought extends ethereum.Event {
  get params(): NFTBought__Params {
    return new NFTBought__Params(this);
  }
}

export class NFTBought__Params {
  _event: NFTBought;

  constructor(event: NFTBought) {
    this._event = event;
  }

  get tokenID(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class NFTListed extends ethereum.Event {
  get params(): NFTListed__Params {
    return new NFTListed__Params(this);
  }
}

export class NFTListed__Params {
  _event: NFTListed;

  constructor(event: NFTListed) {
    this._event = event;
  }

  get tokenID(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get price(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get from(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[3].value.toAddress();
  }
}

export class NFTListingCancelled extends ethereum.Event {
  get params(): NFTListingCancelled__Params {
    return new NFTListingCancelled__Params(this);
  }
}

export class NFTListingCancelled__Params {
  _event: NFTListingCancelled;

  constructor(event: NFTListingCancelled) {
    this._event = event;
  }

  get tokenID(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class NFTMarket extends ethereum.SmartContract {
  static bind(address: Address): NFTMarket {
    return new NFTMarket("NFTMarket", address);
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class BuyNFTCall extends ethereum.Call {
  get inputs(): BuyNFTCall__Inputs {
    return new BuyNFTCall__Inputs(this);
  }

  get outputs(): BuyNFTCall__Outputs {
    return new BuyNFTCall__Outputs(this);
  }
}

export class BuyNFTCall__Inputs {
  _call: BuyNFTCall;

  constructor(call: BuyNFTCall) {
    this._call = call;
  }

  get tokenID(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get item(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class BuyNFTCall__Outputs {
  _call: BuyNFTCall;

  constructor(call: BuyNFTCall) {
    this._call = call;
  }
}

export class CancelListingCall extends ethereum.Call {
  get inputs(): CancelListingCall__Inputs {
    return new CancelListingCall__Inputs(this);
  }

  get outputs(): CancelListingCall__Outputs {
    return new CancelListingCall__Outputs(this);
  }
}

export class CancelListingCall__Inputs {
  _call: CancelListingCall;

  constructor(call: CancelListingCall) {
    this._call = call;
  }

  get tokenID(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CancelListingCall__Outputs {
  _call: CancelListingCall;

  constructor(call: CancelListingCall) {
    this._call = call;
  }
}

export class ListNFTCall extends ethereum.Call {
  get inputs(): ListNFTCall__Inputs {
    return new ListNFTCall__Inputs(this);
  }

  get outputs(): ListNFTCall__Outputs {
    return new ListNFTCall__Outputs(this);
  }
}

export class ListNFTCall__Inputs {
  _call: ListNFTCall;

  constructor(call: ListNFTCall) {
    this._call = call;
  }

  get tokenID(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get price(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get item(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class ListNFTCall__Outputs {
  _call: ListNFTCall;

  constructor(call: ListNFTCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class UserWithdrawMoneyCall extends ethereum.Call {
  get inputs(): UserWithdrawMoneyCall__Inputs {
    return new UserWithdrawMoneyCall__Inputs(this);
  }

  get outputs(): UserWithdrawMoneyCall__Outputs {
    return new UserWithdrawMoneyCall__Outputs(this);
  }
}

export class UserWithdrawMoneyCall__Inputs {
  _call: UserWithdrawMoneyCall;

  constructor(call: UserWithdrawMoneyCall) {
    this._call = call;
  }
}

export class UserWithdrawMoneyCall__Outputs {
  _call: UserWithdrawMoneyCall;

  constructor(call: UserWithdrawMoneyCall) {
    this._call = call;
  }
}