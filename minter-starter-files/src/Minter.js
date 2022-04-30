import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mint } from "./utils/interact.js";
const Minter = (props,accounts) => {


  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const isConnected = Boolean(walletAddress.length>0);
  const [buttonState,setButtonState] = useState(Boolean);


  const networkChanged = chainId => {
    if(chainId== '0x4'){
      setButtonState(false);
      setStatus("👆🏽 Press here if you want a caveman");
    }
    else{
      setButtonState(true);
      setStatus('Wrong Network');
    }
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", networkChanged);
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);

        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });

      if(window.ethereum.networkVersion == '4'){
        setButtonState(false);
        setStatus("👆🏽 Press here if you want a caveman");
      }

      else
      {
        setButtonState(true);
        setStatus('Wrong Network');
      }


    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  useEffect(async () => {
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status); 
    setButtonState(buttonState);
    addWalletListener();
}, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { status } = await mint(1);
    setStatus(status);
};


  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">🍺 Cavemen Minter 🍺</h1>
      <p>
        Me Swypes, Me big Belly, Me want Beer, Mint here
      </p>
      {isConnected ? (
      <button hidden={buttonState} id="mintButton" onClick={onMintPressed} >
        Mint NFT
      </button>
      
      ) : (
        <p>Please connect Metamask</p>
      ) }
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;

