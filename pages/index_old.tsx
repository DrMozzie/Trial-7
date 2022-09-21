// import {
//   ChainId,
//   useClaimedNFTSupply,
//   useContractMetadata,
//   useNetwork,
//   useUnclaimedNFTSupply,
//   useActiveClaimCondition,
//   useClaimNFT,
//   useSignatureDrop,
// } from '@thirdweb-dev/react';
// import { useNetworkMismatch } from '@thirdweb-dev/react';
// import { useAddress, useMetamask } from '@thirdweb-dev/react';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import type { NextPage } from 'next';
import { useState } from 'react';
import styles from '../styles/Theme.module.css';
import { Allowed } from '../list';

const contractInfo = {
  address: '',
  abi: []
};

const WEI_MULTI = 1000000000;

const fetcher = (url) => fetch(url).then((r) => r.json());

const Home: NextPage = () => {


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
      <video className={styles.background} autoPlay loop muted playsInline src='/background.mp4' />
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
