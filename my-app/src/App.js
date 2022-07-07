import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, {useEffect, useState } from "react";
import { ethers } from "ethers";
import contractAbi from "./utils/MyEpicNFT.json";

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/square-nfts-8tc1n7h1rz';

function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [nftsMinted, setNftsMinted] = useState(0);
  const [minting, setMinting] = useState(false);

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

    if(chainId !== rinkebyChainId) {
      alert("Change your network to Rinkeby");
    }    

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      console.log("Authorised account detected", accounts[0]);
      setCurrentAccount(accounts[0]);    
      getTotalNFTsMinted();
      setupEventListener();
      } else {
        console.log("No authosrised account found");
      }
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
        <button onClick={mintNFt} className='cta-button connect-wallet-button'>
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
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ?
            (
              renderConnectWalletButton()
            ) :
            (
              renderMintNFTButton()
            )
          }
          {
            nftsMinted > 0 ?
            (
              <p style={{color: "white"}}>{`${nftsMinted}/50 NFTs minted till now.`}</p>
              ) : 
              (
              <p style={{color: "white"}}>{`0/50 NFTs minted till now.`}</p>
            )
          }
        </div>
        <div>
          <div className="footer-container">
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
    </div>
  );
}

export default App;
