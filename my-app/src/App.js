import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, {useEffect, useState } from "react";
import { ethers } from "ethers";
import contractAbi from "./utils/MyEpicNFT.json";
import {FaEthereum} from "react-icons/fa";
import {BsGithub} from "react-icons/bs";

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/square-nfts-2wub9weyid';

function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [nftsMinted, setNftsMinted] = useState(0);
  const [minting, setMinting] = useState(false);
  const [network, setNetwork] = useState("");

  const contractAddress = "0xCa4743fa40f25905C69D6f521a7aC9803516D7b2";
  const rinkebyChainId = "0x4";

  const checkWalletConnected = async () => {
    const { ethereum } = window;
    if (ethereum) {
      console.log("We found ethereum object", ethereum);
    } else {
      console.log("Get Metamask");
    }
    
    let chainId = await ethereum.request({method: "eth_chainId"});
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
    })
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask ASAP");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      getTotalNFTsMinted();
      // setupEventListener();
    } catch (e) {
      console.error(e);
    }
  }

  const mintNFt = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, contractAbi.abi, signer);

        let nftTxn = await nftContract.makeAnEpicNFT();
        setMinting(true);
        console.log("Mining...");

        await nftTxn.wait();
        setMinting(false);
        getTotalNFTsMinted();
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } 
    } catch (e) {
      console.error(e);
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, contractAbi.abi, signer);

        console.log(parseInt(ethereum.chainId, 16));
        
        nftContract.on("NewNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getTotalNFTsMinted = async () => {
    try {
      const {ethereum} = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, contractAbi.abi, signer);

        let mintedNFTs = await nftContract.getNFTsMinted();
        setNftsMinted(mintedNFTs);
      }
    } catch(e) {
      console.log(e);
    }
  }

  const renderConnectWalletButton = () => {
    return (
      <div>
        <button onClick={connectWallet} className='cta-button connect-wallet-button'>
          Connect Wallet
        </button>
      </div>
    )
  }

  const renderMintNFTButton = () => {
    return (
      <div>
        <button onClick={mintNFt} className="transition ease-in-out delay-150 py-2 px-7 rounded-md bg-indigo-500 hover:bg-cyan-600">
          {
            minting ? "Minting..." : "Mint NFT"
          }
        </button>
      </div>
    )
  }

  useEffect(() => {
    checkWalletConnected();
  }, [])

  return (
    <div className='h-screen bg-slate-900 text-white'>
      <div className='absolute top-0 w-full p-3 flex justify-between items-center'>
        <div className='flex justify-evenly items-center'>
        <h2>My Epic NFTs</h2>
        <a 
          className='transition ease-in-out delay-150 p-2 text-2xl rounded-md bg-slate-800 hover:text-emerald-200'
          href="https://rinkeby.etherscan.io/address/0xA0D169707C050F785E1A3BCDfA0bb1741e86B9D2#code"
          target="_blank"
          rel="noreferrer"
        >
          <FaEthereum />
        </a>
        <a 
          className='transition ease-in-out delay-150 p-2 text-2xl rounded-md bg-slate-800 hover:text-emerald-200'
          href="https://github.com/Im-Soumya/my-nfts"
          target="_blank"
          rel="noreferrer"
        >
          <BsGithub />
        </a>
        </div>
        <div>
          {
            network !== rinkebyChainId ? 
            (
              <p className='text-red-400'>Change your network to Rinkeby</p>
            ) :
            (
              <p>Rinkeby</p>
            )
          }
        </div>
      </div>
      <div className='h-full flex-col justify-center items-center'>
        <h1 className='text-4xl text-center font-semibold py-3 pt-20'>Welcome to My Epic NFT collection</h1>
        <h3 className='text-xl text-center py-3'>Hi, I'm Soumya👋</h3>
        <div className='flex justify-center py-5'>
        {
          currentAccount === "" ? 
          (
            renderConnectWalletButton()
          ) : 
          (
            renderMintNFTButton()
          )
        }
        </div>
      </div>
      <div className="absolute bottom-0">
        <div>
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
        <div className="footer-container">
          <img alt=""/>
          <a
            className='footer-text'
            href={OPENSEA_LINK}
            target="_blank"
            rel="noreferrer"
          >
          🌊 View Collection on OpenSea
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;

// className="header gradient-text"