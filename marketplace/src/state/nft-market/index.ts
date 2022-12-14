import { Contract } from "ethers";
import { CreationValues } from "../../modules/CreationPage/CreationForm";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import NFT_MARKET from "../../../EthEnvironment/artifacts/contracts/Marketplace.sol/NFTMarket.json";
import NFT_ITEM from "../../../EthEnvironment/artifacts/contracts/MarketItem.sol/NFTItem.json";
import useSigner from "./signer";
import useOwnedNFTs from "./useOwnedNFTs";
import { NFT } from "./interfaces";


const NFT_MARKET_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string;
const NFT_ITEM_ADDRESS = process.env.NEXT_PUBLIC_NFT_ITEM_ADDRESS as string;

const useNFTMarket = () => {
    const {signer} = useSigner();
    const nftMarket = new Contract(NFT_MARKET_ADDRESS, NFT_MARKET.abi, signer)
    const nftItem = new Contract(NFT_ITEM_ADDRESS, NFT_ITEM.abi, signer)

    const ownedNFTs = useOwnedNFTs();

    const createNFT = async (values: CreationValues) => {
        try {
            const data = new FormData();
            data.append("name", values.name);
            data.append("description", values.description);
            data.append("image", values.image!);

            const response = await fetch('/api/nft-storage', {method: 'POST', body: data});
            if (response.status === 201) {
                const json = await response.json();
                const transaction: TransactionResponse = await nftItem.createNFT(json.uri);
                await transaction.wait();
            }           
        } 
        catch (exception) {
            console.log(exception);
        }
    }

    const listNFT = async (tokenID: string, price: BigNumber) => {
        console.log("here");
        const transApprove = await nftItem.approve(nftMarket.address, tokenID);
        await transApprove.wait();
        console.log("here");
        const transList: TransactionResponse = await nftMarket.listNFT(tokenID, price, nftItem.address);
        await transList.wait();
    }

    const cancelListing = async (tokenID: string) => {
        const transList: TransactionResponse = await nftMarket.cancelListing(tokenID);
        await transList.wait();
    }

    const buyNFT = async (nft: NFT) => {
        const transBuy: TransactionResponse = await nftMarket.buyNFT(nft.id, nftItem.address, {
            value: nft.price
        });
        await transBuy.wait();
    }

    const withdrawMoney = async () => {
        //TODO: FIX FRONTEND
        try {
            const transWithdraw: TransactionResponse = await nftMarket.userWithdrawMoney();
            await transWithdraw.wait();
        }
        catch (exception) {
            console.log(exception);
        }
    }

    return {createNFT, listNFT, cancelListing, buyNFT, withdrawMoney, ...ownedNFTs};
};

export default useNFTMarket;