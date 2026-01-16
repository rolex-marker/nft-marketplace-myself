// backend/routes/auth.js
import express from 'express';
import { ethers } from 'ethers';
import jwt from "jsonwebtoken";
import { generateNonce, getNonce, deleteNonce } from '../utils/nonceStore.js';

const router = express.Router();

router.get('/nonce/:address', (req, res) => {
  const { address } = req.params;
  const nonce = generateNonce(address);
  res.json({ nonce });
});

router.post('/verify', (req, res) => {
  const { address, signature } = req.body;
  const nonce = getNonce(address);

  if (!nonce) {
    return res.status(400).json({ error: 'Nonce not found' });
  }

  try {
    const recoveredAddress = ethers.utils.verifyMessage(
      `Login nonce: ${nonce}`,
      signature
    );

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Signature invalid' });
    }

    deleteNonce(address);

    // 🔐 CREATE JWT
    const token = jwt.sign(
      { address: address.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      address,
      token,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});


export default router;
