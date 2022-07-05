import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractAbi from "./utils/MyEpicNFT.json";

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

function App() {

  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0x400F0f00FAD5d29b8Df3f760fd302CED925F56db";

  const checkWalletConnected = async () => {
    const { ethereum } = window;
    if (ethereum) {
      console.log("We found ethereum object", ethereum);
    } else {
      console.log("Get Metamask");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      console.log("Authorised account detected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } else {
      console.log("No authosrised account found");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask ASAP");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts !== 0) {
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No authorised account found");
      }
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
        console.log("Mining...");

        await nftTxn.wait();
        console.log("Mined...");

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        alert("Get Metamask");
        return;
      }
    } catch (e) {
      console.error(e);
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

  const renderMintButton = () => {
    return (
      <div>
        <button onClick={mintNFt} className='cta-button connect-wallet-button'>
          Mint NFT
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
              renderMintButton()
            )
          }
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
}

export default App;
