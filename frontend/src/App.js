
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

import './App.css';
import { Navbar, Footer, Loading } from './components';
import { Home, Profile, Item, Create, Login, Register, Mylisteditem, PurchasedItem, Marketing } from './pages';
import { Routes, Route } from "react-router-dom";

import MarketplaceAbi from './contractsData/Marketplace.json';
import MarketplaceAddress from './contractsData/Marketplace-address.json';
import NFTAbi from './contractsData/NFT.json';
import NFTAddress from './contractsData/NFT-address.json';

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);  // Connected wallet/account
  const [marketplace, setMarketplace] = useState({});
  const [nft, setNFT] = useState({});
  const [form, setForm] = useState({
    username: "",
    bio: "",
    avatar: "",
  });

  const loginWithMetaMask = async () => {
    if (!window.ethereum) {
      alert('Install MetaMask');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // 1️⃣ Request nonce from backend
      const { data } = await axios.get(`http://localhost:4000/auth/nonce/${address}`);
      const nonce = data.nonce;

      // 2️⃣ Ask user to sign the message
      const signature = await signer.signMessage(`Login nonce: ${nonce}`);

      // 3️⃣ Verify signature with backend
      const verify = await axios.post('http://localhost:4000/auth/verify', {
        address,
        signature,
      });

      if (verify.data.success) {
        localStorage.setItem("token", verify.data.token);
        setAccount(address);
        console.log('Login success:', address);
        loadContracts(signer); 
         axios.get("http://localhost:4000/profile", {
      headers: { Authorization: `Bearer ${verify.data.token}` },
       }).then(res => {
       if (res.data) {
        setForm(res.data);
        console.log(res.data)
      }
    });
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('MetaMask login error:', error);
    }
  };


  const loadContracts = async (signer) => {
    try {
      const marketplaceContract = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
      const nftContract = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);

      setMarketplace(marketplaceContract);
      setNFT(nftContract);
      setLoading(false);

      console.log('Contracts loaded:', marketplaceContract, nftContract);
    } catch (error) {
      console.error('Error loading contracts:', error);
    }
  };

  const reloadUserinfor = () => {
     axios.get("http://localhost:4000/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
       }).then(res => {
       if (res.data) {
        setForm(res.data);
        console.log(res.data)
      }
    });
  }

  
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => window.location.reload());
      window.ethereum.on('accountsChanged', () => window.location.reload());
    }
  }, []);

  return (
    <div>
      <Navbar loginWithMetaMask={loginWithMetaMask} account={account} form={form}/>
      <div>
        {loading ? (
          <Loading />
        ) : (
          <Routes>
            <Route path="/" element={<Home marketplace={marketplace} nft={nft} account={account} />} />
            <Route path="/itemDetail" element={<Item marketplace={marketplace} nft={nft} account={account} />} />
            <Route path="/create" element={<Create marketplace={marketplace} nft={nft} account={account} />} />
            <Route path="/profile" element={<Profile marketplace={marketplace} nft={nft} account={account} formFir = {form} reloadUserinfor = {reloadUserinfor}/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mylisteditem" element={<Mylisteditem marketplace={marketplace} nft={nft} account={account} />} />
            <Route path="/purchasedItem" element={<PurchasedItem marketplace={marketplace} nft={nft} account={account} />} />
            <Route path="/marketing/:id/:tokenId" element={<Marketing marketplace={marketplace} nft={nft} account={account} />} />
          </Routes>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;









// import { useState } from 'react';
// import { ethers } from 'ethers';
// import { Spinner } from 'react-bootstrap';

// import './App.css';
// import {Navbar,Footer, Loading} from './components'
// import {Home, Profile, Item, Create, Login, Register, Mylisteditem, PurchasedItem, Marketing} from './pages'
// import { Routes, Route } from "react-router-dom";
// import { useAuth } from './pages/users/useAuth';


// import MarketplaceAbi from './contractsData/Marketplace.json';
// import MarketplaceAddress from './contractsData/Marketplace-address.json';
// import NFTAbi from './contractsData/NFT.json';
// import NFTAddress from './contractsData/NFT-address.json';


// function App() {

//   const [loading, setLoading] = useState(true);
//   const [account, setAccount] = useState(null);
//   const [nft, setNFT] = useState({});
//   const [marketplace, setMarketplace] = useState({});

//   const { accountState, loginWithMetaMask } = useAuth();


// const HARDHAT_CHAIN_ID = "0x7A69"; // 31337 in hex

// const web3Handler = async () => {
//   if (!window.ethereum) {
//     alert("Please install MetaMask");
//     return;
//   }

//   // Request wallet connection
//   const accounts = await window.ethereum.request({
//     method: "eth_requestAccounts",
//   });
//   console.log(accounts)
  

//   // Get current chain
//   const currentChainId = await window.ethereum.request({
//     method: "eth_chainId",
//   });

//   // If NOT Hardhat → switch
//   if (currentChainId !== HARDHAT_CHAIN_ID) {
//     try {
//       await window.ethereum.request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId: HARDHAT_CHAIN_ID }],
//       });
//     } catch (switchError) {
//       // If Hardhat is not added → add it
//       if (switchError.code === 4902) {
//         await window.ethereum.request({
//           method: "wallet_addEthereumChain",
//           params: [
//             {
//               chainId: HARDHAT_CHAIN_ID,
//               chainName: "Hardhat Localhost",
//               rpcUrls: ["http://127.0.0.1:8545"],
//               nativeCurrency: {
//                 name: "ETH",
//                 symbol: "ETH",
//                 decimals: 18,
//               },
//             },
//           ],
//         });
//       } else {
//         console.error(switchError);
//         return;
//       }
//     }
//   }

//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   const signer = provider.getSigner();
//   console.log(signer);

//   loadContracts(signer);

//   // Reload on chain/account change
//   window.ethereum.on("chainChanged", () => window.location.reload());
//   window.ethereum.on("accountsChanged", () => window.location.reload());
// };
//   const loadContracts = async (signer) => {
//     // Get deployed copies of contracts
//     console.log("abi is correct", MarketplaceAbi.abi.map(f => f.name));
//     const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
//     console.log(marketplace);
//     setMarketplace(marketplace);
//     const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
//     console.log(nft);
//     setNFT(nft);
//     setLoading(false)
//   }

//   return (
//     <div>
//       <Navbar loginWithMetaMask={loginWithMetaMask} account={account}/>
//       <div>
//         {loading ? (
//           <Loading />
//             // <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
//             //   <Spinner animation="border" style={{ display: 'flex' }} />
//             //   <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
//             // </div>
//           ) : (
//           <Routes>
//             <Route path="/" element={<Home marketplace={marketplace} nft={nft}/>} />
//             <Route path="/itemDetail" element={<Item marketplace={marketplace} nft={nft} />} />
//             <Route path="/create" element={<Create marketplace={marketplace} nft={nft}/> } />
//             <Route path="/profile/:id" element={<Profile />} />
//             <Route path="/login" element={ <Login />} />
//             <Route path="/register" element={ <Register />} />
//             <Route path="/mylisteditem" element={ <Mylisteditem marketplace={marketplace} nft={nft} account={account}/>} />
//             <Route path="/purchasedItem" element={ <PurchasedItem marketplace={marketplace} nft={nft} account={account}/>} />
//             <Route path="/marketing/:id/:tokenId" element={ <Marketing marketplace={marketplace} nft={nft}/>} />
//           </Routes>
//           )}
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default App;






