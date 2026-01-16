import { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

export const useAuth = () => {
  const [accountState, setaccountState] = useState(null);

  const loginWithMetaMask = async () => {
    if (!window.ethereum) {
      alert('Install MetaMask');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    // 1️⃣ Request nonce from backend
    const { data } = await axios.get(`http://localhost:4000/auth/nonce/${address}`);
    const nonce = data.nonce;

    // 2️⃣ Ask user to sign the message
    const signature = await signer.signMessage(`Login nonce: ${nonce}`);

    // 3️⃣ Send signature to backend
    const verify = await axios.post('http://localhost:4000/auth/verify', {
      address,
      signature,
    });

   if (verify.data.success) {
  localStorage.setItem("token", verify.data.token);
  setaccountState(address);
} else {
      console.log('Login failed');
    }
  };

  return { accountState, loginWithMetaMask };
};
