// backend/utils/nonceStore.js
const nonces = new Map();

export function generateNonce(address) {
  const nonce = Math.floor(Math.random() * 1000000).toString();
  nonces.set(address.toLowerCase(), nonce);
  return nonce;
}

export function getNonce(address) {
  return nonces.get(address.toLowerCase());
}

export function deleteNonce(address) {
  nonces.delete(address.toLowerCase());
}
