// ListedItemCard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { Link } from 'react-router-dom';

export default function ListedItemCard({ item, marketplace, account, reloadItems }) {
console.log("item>>>",item);
  const [offers, setOffers] = useState([]);
  const [showOffer, setShowoffer] = useState(false);
  let showOffer_flag = false;

  const token = localStorage.getItem("token"); // JWT token for backend auth

  const changeShowOffer = () => {
     showOffer_flag = !showOffer_flag;
     setShowoffer(showOffer_flag);
     console.log("showOffer>>>",showOffer);
  }

  // Load offers for this item
  const loadOffers = async () => {
    if (!marketplace || !item.itemId) return;
    try {
      const data = await marketplace.getOffers(item.itemId);
      // Convert BigNumber to number
      const parsedOffers = data.map(o => ({
        buyer: o.buyer,
        amount: o.amount.toString(),
        accepted: o.accepted
      }));
      setOffers(parsedOffers);
    } catch (err) {
      console.error("Failed to load offers:", err);
    }
  };

  useEffect(() => {
    loadOffers();
  }, [marketplace]);

  // Accept offer
  const acceptOffer = async (index) => {
    if (!marketplace) return;
    try {
      const tx = await marketplace.acceptOffer(item.itemId, index);
      const receipt = await tx.wait();
      alert("Offer accepted successfully 🎉");

      const acceptedOffer = offers[index];
      await axios.post(
          "http://localhost:4000/transactions",
          {
            itemId: item.itemId.toNumber(),
            tokenId: item.tokenId.toNumber(),
            price: ethers.utils.formatEther(acceptedOffer.amount),
            seller: account,
            buyer: acceptedOffer.buyer,
            type: "OFFER",
            txHash: receipt.transactionHash
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Offer transaction recorded in backend ✅");
      reloadItems(); // Refresh items
      loadOffers();
    } catch (err) {
      console.error(err);
      alert("Failed to accept offer: " + (err?.data?.message || err.message));
    }
  };

  return (
    <div className="pur-card">
      <div className="pur-tilt">
        <div className="pur-img">
          <img src={item.image} alt={item.name} />
        </div>
      </div>
      <div className="pur-info">
        {!showOffer &&(<h2 className="pur-title">{item.name}</h2>)}
       {!showOffer && (<p className="pur-desc">{item.description}</p>)}
        {!showOffer &&<div className="pur-price">
          <span className="pur-new">ETH {ethers.utils.formatEther(item.totalPrice)}</span>
        </div>}

        {/* Cancel button */}
        {!item.sold ? (
           <div class="pur-buttonbox">
          <button className="pur-btn" onClick={() => item.cancelListing(item.itemId)}>
            <span>CANCEL</span>
          </button>
          { offers.length > 0 && (<button class="pur-btn" onClick={() => changeShowOffer()}>
                                           <span>OFFER</span>
                                             <svg class="pur-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                             <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4"/>
                                             <line x1="3" y1="6" x2="21" y2="6"/>
                                          <path d="M16 10a4 4 0 01-8 0"/>
                                             </svg>
                                           </button>)}
            </div>
        ) : ( <div class="pur-buttonbox">
           <Link to={`/marketing/${item.itemId}/${item.tokenId}`}>
                                           <button class="pur-btn" >
                                          <span>RELI</span>
                                            <svg class="pur-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4"/>
                                            <line x1="3" y1="6" x2="21" y2="6"/>
                                             <path d="M16 10a4 4 0 01-8 0"/>
                                             </svg>
                                           </button>
            </Link>
            
            <Link to={`/createauction/${item.itemId}/${item.tokenId}`}>
                                           <button class="pur-btn" >
                                           <span>AUCT</span>
                                             <svg class="pur-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                             <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4"/>
                                             <line x1="3" y1="6" x2="21" y2="6"/>
                                          <path d="M16 10a4 4 0 01-8 0"/>
                                             </svg>
                                           </button>
            </Link>
             </div>)}

        {/* Offers Section */}
        {showOffer && (
          <div className="offers-section">
            <h4>Offers:</h4>
            {offers.map((o, idx) => (
              <div key={idx} className="offer-item">
                <span className="offers_span">{offers.length}</span>
                <span>From: {o.buyer.slice(0, 9)}...{o.buyer.slice(-4)}</span>
                <p>Amount: {ethers.utils.formatEther(o.amount)} ETH</p>
                {!o.accepted && (
                  <button className="pur-btn" onClick={() => acceptOffer(idx)}>
                    Accept
                  </button>
                )}
                {o.accepted && <span className="accepted-label">Accepted ✅</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
