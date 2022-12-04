import useNFTMarket from "../../state/nft-market";


const WithdrawPage = () => {
    //TODO: FIX FRONTEND
    const {withdrawMoney} = useNFTMarket();
    try {
        withdrawMoney();
    }
    catch (exception) {
        console.log(exception);
    }
    return (
        <div className="flex flex-wrap">
            Withdrawing
        </div>
    )
}

export default WithdrawPage;