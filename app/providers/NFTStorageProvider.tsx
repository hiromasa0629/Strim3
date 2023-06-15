import { NFTStorage } from "nft.storage";
import { ReactNode, createContext, useContext } from "react";

interface MeetingMachineProviderProps {
  children: ReactNode;
}

const NFTStorageClientContext = createContext<NFTStorage>(
  new NFTStorage({ token: "" })
);

const NFTStorageProvider = (props: MeetingMachineProviderProps) => {
  const { children } = props;

  return (
    <NFTStorageClientContext.Provider
      value={
        new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_API || "" })
      }
    >
      {children}
    </NFTStorageClientContext.Provider>
  );
};

export const useNFTStorage = () => useContext(NFTStorageClientContext);

export default NFTStorageProvider;
