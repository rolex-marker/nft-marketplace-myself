
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

import './App.css';
import { Navbar, Footer, Loading } from './components';
import { Home, Profile, Item, Create, Login, Register, Mylisteditem, PurchasedItem, Marketing, Auctions, CreateAuction } from './pages';
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
          <Loading content="Connect with Metamask"/>
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
            <Route path="/createauction/:id/:tokenId" element={<CreateAuction marketplace={marketplace} nft={nft} account={account} />} />
            <Route path="/auctions" element={<Auctions marketplace={marketplace} nft={nft} account={account} />}/>
          </Routes>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;









