import { useState } from "react";
import { useEthers, useGasPrice } from "@usedapp/core";
import { default as CountdownTimer } from "react-countdown";
import { fromUnixTime } from "date-fns";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { toast } from "react-toastify";
import { range, isEmpty } from "lodash";
import useSWR from "swr";

const contractAddress = "0xf6629357431c6ff9f698cd3a560af19fd9699982";

const abi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "ApprovalCallerNotOwnerNorApproved", type: "error" },
  { inputs: [], name: "ApprovalQueryForNonexistentToken", type: "error" },
  { inputs: [], name: "ApproveToCaller", type: "error" },
  { inputs: [], name: "BalanceQueryForZeroAddress", type: "error" },
  { inputs: [], name: "InvalidQueryRange", type: "error" },
  { inputs: [], name: "MintERC2309QuantityExceedsLimit", type: "error" },
  { inputs: [], name: "MintToZeroAddress", type: "error" },
  { inputs: [], name: "MintZeroQuantity", type: "error" },
  { inputs: [], name: "OwnerQueryForNonexistentToken", type: "error" },
  { inputs: [], name: "OwnershipNotInitializedForExtraData", type: "error" },
  { inputs: [], name: "TransferCallerNotOwnerNorApproved", type: "error" },
  { inputs: [], name: "TransferFromIncorrectOwner", type: "error" },
  { inputs: [], name: "TransferToNonERC721ReceiverImplementer", type: "error" },
  { inputs: [], name: "TransferToZeroAddress", type: "error" },
  { inputs: [], name: "URIQueryForNonexistentToken", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "toTokenId",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
    ],
    name: "ConsecutiveTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "addressToMinted",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "explicitOwnershipOf",
    outputs: [
      {
        components: [
          { internalType: "address", name: "addr", type: "address" },
          { internalType: "uint64", name: "startTimestamp", type: "uint64" },
          { internalType: "bool", name: "burned", type: "bool" },
          { internalType: "uint24", name: "extraData", type: "uint24" },
        ],
        internalType: "struct IERC721A.TokenOwnership",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
    ],
    name: "explicitOwnershipsOf",
    outputs: [
      {
        components: [
          { internalType: "address", name: "addr", type: "address" },
          { internalType: "uint64", name: "startTimestamp", type: "uint64" },
          { internalType: "bool", name: "burned", type: "bool" },
          { internalType: "uint24", name: "extraData", type: "uint24" },
        ],
        internalType: "struct IERC721A.TokenOwnership[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isLive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isRevealed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "merkleRoot",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "uint256", name: "_allowance", type: "uint256" },
      { internalType: "bytes32[]", name: "_proof", type: "bytes32[]" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_baseURI", type: "string" }],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_hiddenURI", type: "string" }],
    name: "setHiddenURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "_isLive", type: "bool" }],
    name: "setIsLive",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "_isRevealed", type: "bool" }],
    name: "setIsRevealed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "_merkleRoot", type: "bytes32" }],
    name: "setMerkleRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "team",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "tokensOfOwner",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "stop", type: "uint256" },
    ],
    name: "tokensOfOwnerIn",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const providerUrl =
  "https://eth-mainnet.alchemyapi.io/v2/tOFqeqwCfpkcg19ElpoKvQ5Z_W8u3F0p";

const nftGetters = async (method, ...params) => {
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract[method](...params);
};

const WEI_MULTI = 1000000000;

const fetcher = (url) => fetch(url).then((r) => r.json());

const Home = () => {
  const { activateBrowserWallet, account, deactivate, chainId } = useEthers();
  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);

  const { data: proofResponse } = useSWR(
    account ? `/api/proof?address=${account}` : null,
    fetcher,
    {
      refreshInterval: 30000,
    }
  );

  const { data: isLive } = useSWR("isLive", nftGetters, {
    refreshInterval: 10000,
  });

  const { data: merkleRoot } = useSWR("merkleRoot", nftGetters, {
    refreshInterval: 30000,
  });

  const { data: totalSupply, mutate: refreshSupply } = useSWR(
    "totalSupply",
    nftGetters,
    {
      refreshInterval: 10000,
    }
  );

  const { proof, hexRoot, allowanceLookup } = proofResponse || {};
  const gasPrice = useGasPrice();
  const gasEstimate = ((gasPrice ? gasPrice / WEI_MULTI : 0) * 1.2).toFixed(4);

  const userMax = parseInt(allowanceLookup?.[account?.toLowerCase()] || 0, 10);

  const canMint =
    isLive &&
    merkleRoot !==
      "0x0000000000000000000000000000000000000000000000000000000000000000";

  const isEligibleToMint = !isEmpty(proof) && canMint && hexRoot === merkleRoot;

  const onMint = async (amount) => {
    try {
      setIsMinting(true);

      const providerOptions = {
        /* See Provider Options Section */
      };

      const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions, // required
      });

      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const transaction = await contract.mint(amount, userMax, proof, {
        gasLimit:
          amount > 5 ? 300000 + amount * 30000 : amount === 1 ? 160000 : 250000,
        maxFeePerGas: ethers.utils.parseUnits(gasEstimate, "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei"),
      });

      toast.info(
        <a
          className="mr-2"
          target="_blank"
          rel="external nofollow noopener noreferrer"
          href={`https://etherscan.io/tx/${transaction.hash}`}
        >
          Click to view transaction
        </a>,
        { autoClose: false, closeButton: true }
      );

      await toast.promise(transaction.wait(), {
        pending: `Minting...`,
        success: "Successfully minted!",
        error: "Error minting NFT",
      });

      refreshSupply();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsMinting(false);
    }
  };

  const liveAt = 1663786800;

  return (
    <div className="relative flex flex-col h-full w-full overflow auto font-primary text-white bg-dark">
      <section className="relative flex flex-col w-full h-[100vh] items-center justify-center">
        <header
          className="flex-shrink-0 text-white absolute px-10 md:px-20 top-0 left-0 w-full flex flex-row items-center justify-between h-[90px] items-center justify-center z-[100]"
          style={{
            backgroundImage:
              "linear-gradient(0deg,rgba(0,0,0,.5) 50%,rgba(0,0,0,.5) 50%)",
          }}
        >
          <a className="cursor-pointer" href="https://www.valeriagames.com/">
            <img className="w-[40px] h-[60px]" src="/home.png" alt="" />
          </a>
          <ul className="flex flex-row items-center justify-end space-x-8 text-2xl">
            <a
              className="cursor-pointer"
              href="https://discord.gg/HsaJUH3K"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/discord.png" alt="" />
            </a>
            <a
              className="cursor-pointer"
              href="https://opensea.io/collection/valeriagames"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/opensea.png" alt="" />
            </a>
            <a
              className="cursor-pointer"
              href="https://twitter.com/ValeriaStudios"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/twitter.png" alt="" />
            </a>
            <a
              className="cursor-pointer"
              href="https://www.youtube.com/channel/UCusrkhDypLaThlwfrYVRfqA"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/youtube.png" alt="" />
            </a>
          </ul>
        </header>
        <div className="relative flex flex-col items-center justify-center z-[1] w-full h-full">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            src="/background.mp4"
          />
        </div>
        <div className="absolute flex flex-col h-[100vh] top-[70px] md:top-0 w-full items-center justify-center z-[99] space-y-6 pb-10">
          {account ? (
            <div
              className="flex flex-col w-full rounded-xl h-[580px] max-w-[360px] mx-auto p-8 items-center justify-center space-y-8"
              style={{
                backgroundImage:
                  "linear-gradient(0deg,rgba(0,0,0,.5) 50%,rgba(0,0,0,.5) 50%)",
              }}
            >
              <img className="rounded-xl w-full" src="/hiddenvc.gif" />
              <div className="flex flex-row w-full items-center justify-between text-xl uppercase font-bold">
                <span>Claimed:</span>
                <span>{totalSupply?.toString() || 0}</span>
              </div>
              <div className="flex flex-col justify-start space-y-2">
                {gasEstimate && (
                  <span className="font-black uppercase text-sm text-center w-full">
                    Gas: {gasEstimate} gwei
                  </span>
                )}
                <CountdownTimer
                  date={new Date(fromUnixTime(liveAt))}
                  renderer={({ completed, hours, minutes, days, seconds }) => {
                    if (completed && isLive) {
                      return (
                        <div className="flex flex-row items-center justify-center space-x-4 w-full">
                          {isEligibleToMint ? (
                            <>
                              <select
                                onChange={(e) => {
                                  setMintAmount(e.target.value || 1);
                                }}
                                value={mintAmount}
                                className="px-2 rounded-xl text-base hover:opacity-100 opacity-95 cursor-pointer font-primary bg-main text-white h-[42px] text-center"
                                style={{
                                  backgroundImage:
                                    "linear-gradient(to left,#fff 0,#6828b1 101.52%)",
                                }}
                              >
                                {range(1, userMax + 1).map((index) => (
                                  <option key={index} value={index}>
                                    {index}
                                  </option>
                                ))}
                              </select>
                              <button
                                className="tracking-wider uppercase rounded-xl text-sm font-black hover:opacity-100 opacity-95 cursor-pointer font-primary text-white h-[42px] px-6 text-center hover:scale-[103%] transition ease-in duration-100"
                                onClick={() => {
                                  onMint(mintAmount);
                                }}
                                disabled={isMinting}
                                style={{
                                  backgroundImage:
                                    "linear-gradient(to left,#fff 0,#6828b1 101.52%)",
                                }}
                              >
                                {isMinting ? "Processing..." : `Mint`}
                              </button>
                            </>
                          ) : (
                            <p className="text-sm font-black uppercase">
                              You are not eligible to mint
                            </p>
                          )}
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex flex-col space-y-4 text-base text-center w-full">
                          <span className="uppercase text-white text-base font-black">
                            Mint opens in {days}d {hours}h {minutes}m {seconds}s
                          </span>
                        </div>
                      );
                    }
                  }}
                />
              </div>
              <button
                className="flex-shrink-0 uppercase font-header text-white w-full h-[55px] rounded-full font-bold tracking-wider hover:scale-[103%] transition ease-in duration-100"
                onClick={() => {
                  deactivate();
                }}
                style={{
                  backgroundImage:
                    "linear-gradient(to left,#fff 0,#6828b1 101.52%)",
                }}
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div
              className="flex flex-col w-full rounded-xl h-[520px] max-w-[360px] mx-auto p-8 items-center justify-center space-y-8"
              style={{
                backgroundImage:
                  "linear-gradient(0deg,rgba(0,0,0,.5) 50%,rgba(0,0,0,.5) 50%)",
              }}
            >
              <img className="rounded-xl w-full" src="/hiddenvc.gif" />
              <div className="flex flex-row w-full items-center justify-between text-xl uppercase font-bold">
                <span>Claimed:</span>
                <span>{totalSupply?.toString() || 0}</span>
              </div>
              <button
                className="flex-shrink-0 uppercase font-header text-white w-full h-[55px] rounded-full font-bold tracking-wider hover:scale-[103%] transition ease-in duration-100"
                onClick={() => {
                  activateBrowserWallet();
                }}
                style={{
                  backgroundImage:
                    "linear-gradient(to left,#fff 0,#6828b1 101.52%)",
                }}
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
