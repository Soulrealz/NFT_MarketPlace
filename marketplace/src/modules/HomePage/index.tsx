import { listedByNotCurrentUser } from "../../state/nft-market/nftUtilityFunctions";
import NFTCard from "../../components/NFTCard";

const HomePage = () => {
  const listedByOthers = listedByNotCurrentUser();

  return (
    <div className="flex w-full flex-col">      
      <div className="flex flex-wrap">
        {listedByOthers?.map(nft => <NFTCard nft={nft} className="mr-2 mb-2" key={nft.id}/>)}
      </div>
    </div>
  );
};

export default HomePage;
