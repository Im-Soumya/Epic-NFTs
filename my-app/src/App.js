import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractAbi from "./utils/MyEpicNFT.json";
import { FaEthereum } from "react-icons/fa";
import { BsGithub } from "react-icons/bs";
import { GiLaserBurst } from "react-icons/gi";
import { SiHiveBlockchain } from "react-icons/si";
import Error from "./Error";

const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK =
  "https://testnets.opensea.io/collection/square-nfts-pdth5qblrp";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [nftsMinted, setNftsMinted] = useState(0);
  const [minting, setMinting] = useState(false);
  const [network, setNetwork] = useState("");

  const contractAddress = "0xc769De7961231A7c7b9eE2984fF0A7373b9Ce352";
  const rinkebyChainId = "0x4";

  const checkWalletConnected = async () => {
    const { ethereum } = window;
    if (ethereum) {
      console.log("We found ethereum object", ethereum);
    } else {
      console.log("Get Metamask");
    }

    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);
    setNetwork(chainId);

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      console.log("Authorised account detected", accounts[0]);
      setCurrentAccount(accounts[0]);
      getTotalNFTsMinted();
      setupEventListener();
    } else {
      console.log("No authosrised account found");
    }

    ethereum.on("chainChanged", (chainId) => {
      console.log(chainId);
      setNetwork(chainId);
    });
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask ASAP");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      if (network === rinkebyChainId) {
        getTotalNFTsMinted();
      }
      // setupEventListener();
    } catch (e) {
      console.error(e);
    }
  };

  const mintNFt = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          contractAddress,
          contractAbi.abi,
          signer
        );

        let nftTxn = await nftContract.makeAnEpicNFT();
        setMinting(true);
        console.log("Mining...");

        await nftTxn.wait();
        setMinting(false);
        getTotalNFTsMinted();
        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          contractAddress,
          contractAbi.abi,
          signer
        );

        console.log(parseInt(ethereum.chainId, 16));

        nftContract.on("NewNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalNFTsMinted = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          contractAddress,
          contractAbi.abi,
          signer
        );

        let mintedNFTs = await nftContract.getNFTsMinted();
        setNftsMinted(mintedNFTs);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const renderConnectWalletButton = () => {
    return (
      <div>
        <button
          onClick={connectWallet}
          className="py-3 px-51 text-lg font-semibold rounded-md bg-gradient-to-r from-purple-600 via-red-500 to-orange-500 background-animate"
        >
          Connect Wallet
        </button>
      </div>
    );
  };

  const renderMintNFTButton = () => {
    return (
      <div>
        <button
          onClick={mintNFt}
          className="py-3 px-20 text-lg font-semibold rounded-md bg-gradient-to-r from-purple-600 via-red-500 to-orange-500 background-animate"
        >
          {minting ? "Minting..." : "Mint NFT"}
        </button>
      </div>
    );
  };

  useEffect(() => {
    checkWalletConnected();
  }, []);

  return (
    <div className="h-screen bg-slate-900 text-white">
      <div>
        <div className="hidden absolute top-0 w-full py-4 px-7 justify-between items-center md:flex">
          <div className="flex justify-evenly items-center">
            <a className="p-2 text-3xl text-amber-300">
              <GiLaserBurst />
            </a>
            <h2 className="mr-8 font-semibold text-lg">My Epic NFTs</h2>
            <a
              className="transition ease-in-out delay-150 p-2 mr-3 text-2xl rounded-md bg-slate-800 hover:text-emerald-300"
              href="https://rinkeby.etherscan.io/address/0xc769De7961231A7c7b9eE2984fF0A7373b9Ce352#code"
              target="_blank"
              rel="noreferrer"
            >
              <FaEthereum />
            </a>
            <a
              className="transition ease-in-out delay-150 p-2 text-2xl rounded-md bg-slate-800 hover:text-emerald-300"
              href="https://github.com/Im-Soumya/my-nfts"
              target="_blank"
              rel="noreferrer"
            >
              <BsGithub />
            </a>
          </div>
          <div>
            {network !== rinkebyChainId ? (
              <span className="flex items-center">
                <SiHiveBlockchain className="mr-2 text-xl text-emerald-200" />
                <p className="text-rose-600">Change your network to Rinkeby</p>
              </span>
            ) : (
              <span className="flex items-center">
                <SiHiveBlockchain className="mr-2 text-xl text-emerald-200" />
                <p>Rinkeby</p>
              </span>
            )}
          </div>
        </div>
        <div className="hidden h-full flex-col justify-center items-center md:flex">
          <h1 className="text-6xl text-center font-semibold py-3 pt-36 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">
            Welcome to My Epic NFT collection
          </h1>
          <h3 className="text-2xl text-center pt-5 pb-4">
            Each Unique. Each Beautiful. Discover one for yourself.
          </h3>
          <div className="flex justify-center text-md pt-6 pb-1">
            {nftsMinted > 0 ? (
              <p>{`${nftsMinted}/25 NFTs minted till now`}</p>
            ) : (
              <p>0/25 NFTs minted till now</p>
            )}
          </div>
          <div className="flex justify-center py-5">
            {currentAccount === ""
              ? renderConnectWalletButton()
              : renderMintNFTButton()}
          </div>
          <div className="flex justify-center">
            <a
              className="py-3 px-9 text-lg font-semibold rounded-md bg-gradient-to-r from-purple-600 via-red-500 to-orange-500 background-animate"
              href={OPENSEA_LINK}
              target="_blank"
              rel="noreferrer"
            >
              🌊 View Collection
            </a>
          </div>
        </div>
        <div className="hidden absolute bottom-0 w-full justify-center items-center md:flex">
          <div className="transition ease-in-out delay-150 flex justify-center items-center mr-4 hover:-translate-y-1 hover:underline">
            <img
              alt="Twitter Logo"
              className="object-contain w-9 h-9"
              src={twitterLogo}
            />
            <a
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`built on @${TWITTER_HANDLE}`}</a>
          </div>
          <div className="transition ease-in-out delay-150 flex justify-center items-center hover:-translate-y-1 hover:underline">
            <img
              alt="Twitter Logo"
              className="object-contain w-9 h-9"
              src={twitterLogo}
            />
            <a
              href="https://twitter.com/iamsoumyass"
              target="_blank"
              rel="noreferrer"
            >
              built by @iamsoumyass
            </a>
          </div>
        </div>
      </div>
      <Error />
    </div>
  );
}

export default App;
