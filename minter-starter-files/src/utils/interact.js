require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contractABI = require('../contract-abi.json')
const contractAddress = "0xd5f82cD39a6252d66F8975Df7A4993687a5b1a87";
const siglist = require("../signatures.json");



export const mint = async (mintAmount) => {
    window.contract = await new web3.eth.Contract(contractABI.abi, contractAddress);
    const account = web3.utils.toChecksumAddress(window.ethereum.selectedAddress);
    const signature = siglist[account];
    
    if (!signature){
      return {
        success:false,
        status :"You are not part of the cave Get Outta here"
      }
    }
    //set up your Ethereum transaction
    const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    'data': window.contract.methods.mint(mintAmount,signature).encodeABI()//make call to NFT smart contract 
};

//sign the transaction via Metamask
try {
const txHash = await window.ethereum
    .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
    });
return {
    success: true,
    status: "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txHash
}
} catch (error) {
return {
    success: false,
    status: "😥 Something went wrong: " + error.message
} 

}
    
}

export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "👆🏽 Press here if you want a caveman",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  }; 

  export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "👆🏽  Press here if you want a caveman",
            network : window.ethereum.networkVersion, 
          };
        } else {
          return {
            address: "",
            status: "🦊 Connect to Metamask using the top right button.",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };