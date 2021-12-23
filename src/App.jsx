import { useEffect, useMemo, useState } from "react";

// import thirdweb
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule("0x0BA972e0672464C6846837b969CD03a0b9444166")

const App = () => {
  // Use the connectWallet hook thirdweb gives us.
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address);

  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClamiedNFT] = useState(false);
  // isClaiming lets us keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract
    sdk.setProviderOrSigner(signer);
  }, [signer]);
  

  useEffect(() => {
    // If User doesn't have a connected wallet, exit!
    if (!address) {
      return;
    }

    // Check if the user has the DAO NFT by using bundleDropMOdule.balanceOf
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If balance is greater than 0 they have an NFT
        if (balance.gt(0)) {
          setHasClamiedNFT(true);
          console.log("This user has a membership NFT")
        } else {
          setHasClamiedNFT(false);
          console.log("This user does not have a membership NFT.");
        }
      }).catch((error) => {
        setHasClamiedNFT(false);
        console.error("failed to find NFT balance", error);
    })
  }, [address]);


  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to MutualAidDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
    bundleDropModule.claim("0", 1).catch((err) => {
      console.error("failed to claim", err);
      setIsClaiming(false);
    })
    .finally(() => {
      // Stop loading state.
      setIsClaiming(false);
      // Set claim state.
      setHasClamiedNFT(true);
      // Show user their fancy new NFT!
      console.log(
        'Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0'
      )
    })
  }
  
  // This is the case where we have the user's address
  // which means they've connected their wallet to our site!
  return (
    <div className="landing">
      <h1>👀 wallet connected, now what!</h1>
    </div>);
};

export default App;
