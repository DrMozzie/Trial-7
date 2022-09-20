import {
  ChainId,
  useClaimedNFTSupply,
  useContractMetadata,
  useNetwork,
  useUnclaimedNFTSupply,
  useActiveClaimCondition,
  useClaimNFT,
  useSignatureDrop,
} from '@thirdweb-dev/react';
import { useNetworkMismatch } from '@thirdweb-dev/react';
import { useAddress, useMetamask } from '@thirdweb-dev/react';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import type { NextPage } from 'next';
import { useState } from 'react';
import styles from '../styles/Theme.module.css';
import { Allowed } from '../list';



// Put Your NFT Drop Contract address from the dashboard here
// test one" 0x322067594DBCE69A9a9711BC393440aA5e3Aaca1
const myNftDropContractAddress = '0x826A53B19De6eeb2A6A1Bc617F932a2DF31933Dd';
const Home: NextPage = () => {
  const nftDrop = useSignatureDrop(myNftDropContractAddress);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const isOnWrongNetwork = useNetworkMismatch();
  const claimNFT = useClaimNFT(nftDrop);
  const [, switchNetwork] = useNetwork();
  const sup = Allowed(); 

  // The amount the user claims
let [quantity, setQuantity] = useState(1); // default to 1
quantity = sup; 

  // Load contract metadata
  const { data: contractMetadata } = useContractMetadata(
    myNftDropContractAddress,
  );

  // Load claimed supply and unclaimed supply
  const { data: unclaimedSupply } = useUnclaimedNFTSupply(nftDrop);
  const { data: claimedSupply } = useClaimedNFTSupply(nftDrop);

  // Load the active claim condition
  const { data: activeClaimCondition } = useActiveClaimCondition(nftDrop);


  // Check if there's NFTs left on the active claim phase
  const isNotReady =
    activeClaimCondition &&
    sup === 0;
    // check here using previous code 

  // Check if there's any NFTs left
  const isSoldOut = unclaimedSupply?.toNumber() === 0;
  
  // Check to see if address can still mint (look at previous contract)

  // Check price
  const price = parseUnits(
    activeClaimCondition?.currencyMetadata.displayValue || '0',
    activeClaimCondition?.currencyMetadata.decimals,
  );

  // Multiply depending on quantity
  const priceToMint = price.mul(quantity);

  // Loading state while we fetch the metadata
  if (!nftDrop || !contractMetadata) {
    return <div className={styles.container}>Loading...</div>;
  }
  
  // Function to mint/claim an NFT
  const mint = async () => {
    if (isOnWrongNetwork) {
      switchNetwork && switchNetwork(ChainId.Rinkeby);
      return;
    }

    claimNFT.mutate(
      { to: address as string, quantity },
      {
        onSuccess: () => {
          alert(`Successfully minted NFT${quantity > 1 ? 's' : ''}!`);
        },
        onError: (err: any) => {
          console.error(err);
          alert(err?.message || 'Something went wrong');
        },
      },
    );
  };

  return (
    
    <div className={styles.top}> 
      <div className={styles.header}> 
    <ul className={styles.headerline}>
      <a className={styles.homelink} href="https://www.valeriagames.com/"><img className={styles.homelogo} src="/home.png" alt="" /></a>
      <a className={styles.headerlinks} href="https://discord.gg/HsaJUH3K"><img src="/discord.webp" alt="" /></a>
      <a className={styles.headerlinks} href="https://opensea.io/collection/valeriagames"><img src="/opensea.webp" alt="" /></a>
      <a className={styles.headerlinks} href="https://twitter.com/ValeriaStudios"><img src="/twitter.webp" alt="" /></a>
     <a className={styles.headerlinks} href="https://www.youtube.com/channel/UCusrkhDypLaThlwfrYVRfqA"><img src="/twitter.webp" alt="" /></a>
    </ul>
    </div>
    
    <div className={styles.container}>
      <video className={styles.background} autoPlay loop muted playsInline src='/background.mp4'> 
      </video>
      <div className={styles.mintInfoContainer}>
        <div className={styles.imageSide}>
          {/* Image Preview of NFTs 
          <img
            className={styles.image}
            src={contractMetadata?.image}
            alt={`${contractMetadata?.name} preview image`}
          /> */}
          <p> </p> 
          {!address && (
            <img className={styles.image} src="/Champion.png" alt="" />
          )}
          
          {address && sup == 0 && (
          <img className={styles.image} src="/zero.png" alt="" />
           )}
          {address && sup > 0 && sup <= 4 && (
            <img className={styles.image} src="/Champion.png" alt="" />
          )}
           {address && sup > 4 && sup <= 9 && (
            <img className={styles.image} src="/Veteran.png" alt="" />
          )}
            {address && sup > 9 && sup <= 24 && (
            <img className={styles.image} src="/Elite.png" alt="" />
          )}
            {address && sup > 24 && sup <= 49 && (
            <img className={styles.image} src="/Master.png" alt="" />
          )}
          {address && sup > 49 && sup <= 99 && (
            <img className={styles.image} src="/Legendary.png" alt="" />
          )}
           {address && sup >= 100 && (
            <img className={styles.image} src="/King.png" alt="" />
          )}


          {/* Amount claimed so far */}
          <div className={styles.mintCompletionArea}>
            <div className={styles.mintAreaLeft}>
              <p>Claimed</p>
            </div>
            <div className={styles.mintAreaRight}>
              {claimedSupply && unclaimedSupply ? (
                <p>
                  {/* Claimed supply so far */}
                  <b>{claimedSupply?.toNumber()}</b>
                </p>
              ) : (
                // Show loading state if we're still loading the supply
                <p>Loading...</p>
              )}
            </div>
          </div>
          {/* Show claim button or connect wallet button */}
          {address ? (
            // Sold out or show the claim button
            isSoldOut ? (
              <div>
                <h2>Sold Out</h2>
              </div>
            ) : isNotReady ? (
              <div>
                <h2>Not ready to be minted yet</h2>
              </div>
            ) : (
              <>
                <p>Quantity</p>
                <div className={styles.quantityContainer}>
                  <button
                    className={`${styles.quantityControlButton}`}
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity <= sup}
                  >
                    -
                  </button>

                  <h4>{quantity}</h4>

                  <button
                    className={`${styles.quantityControlButton}`}
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={
                      quantity >=
                      1
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className={`${styles.mainButton} ${styles.spacerTop} ${styles.spacerBottom}`}
                  onClick={mint}
                  disabled={claimNFT.isLoading}
                >
                  {claimNFT.isLoading
                    ? 'Minting...'
                    : `Mint${quantity > 1 ? ` ${quantity}` : ''}${
                        activeClaimCondition?.price.eq(0)
                          ? ' (Free)'
                          : activeClaimCondition?.currencyMetadata.displayValue
                          ? ` (${formatUnits(
                              priceToMint,
                              activeClaimCondition.currencyMetadata.decimals,
                            )} ${
                              activeClaimCondition?.currencyMetadata.symbol
                            })`
                          : ''
                      }`}
                </button>
              </>
            )
          ) : (
            <div className={styles.buttons}>
              <button
                className={styles.mainButton}
                onClick={connectWithMetamask}
              >
                Connect MetaMask
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
