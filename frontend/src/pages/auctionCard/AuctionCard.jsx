import { ethers } from "ethers";
import axios from "axios";
import useCountdown from "../users/useCountdown";
import { useState } from "react";
import "./auctionCard.css";

export default function AuctionCard({ item, marketplace, account }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const endTime =
    item.endTime?.toNumber
      ? item.endTime.toNumber()
      : Number(item.endTime);

  const timeLeft = useCountdown(endTime);
  const auctionEnded = timeLeft <= 0;

  const isOwner =
    item.seller &&
    account &&
    item.seller.toLowerCase() === account.toLowerCase();

  const isHighestBidder =
    item.highestBidder &&
    item.highestBidder !== ethers.constants.AddressZero &&
    account &&
    item.highestBidder.toLowerCase() === account.toLowerCase();

  const token = localStorage.getItem("token");

  const highestBidFormatted = item.highestBid
    ? ethers.utils.formatEther(item.highestBid)
    : "0";
  const priceFormatted = item.price ? ethers.utils.formatEther(item.price) : "0";

  const placeBid = async () => {
    if (isSubmitting) return;

    const bid = prompt("Enter bid amount (ETH)");
    if (!bid) return;

    setIsSubmitting(true);
    try {
      const tx = await marketplace.placeBid(item.itemId, {
        value: ethers.utils.parseEther(bid),
      });
      await tx.wait();
      alert("Bid placed successfully 🎉");
    } catch (err) {
      console.error(err);
      alert("Bid failed: " + (err?.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalizeAuction = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const tx = await marketplace.finalizeAuction(item.itemId);
      const receipt = await tx.wait();

      alert("Auction finalized successfully 🎉");

      if (token) {
        await axios.post(
          "http://localhost:4000/transactions",
          {
            itemId: item.itemId,
            tokenId: item.tokenId,
            price: highestBidFormatted,
            seller: item.seller,
            buyer: item.highestBidder,
            type: "AUCTION",
            txHash: receipt.transactionHash,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Auction transaction recorded ✅");
      }
    } catch (err) {
      console.error("Auction finalization failed:", err);
      alert("Auction finalization failed: " + (err?.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auction-card">
      <div id="auction-container">
        <div className="auction-product-details">
          <h1>{item.name}</h1>
          <span className="auction-hint-star star">
            <i className="fa fa-star" aria-hidden="true"></i>
            <i className="fa fa-star" aria-hidden="true"></i>
            <i className="fa fa-star" aria-hidden="true"></i>
            <i className="fa fa-star" aria-hidden="true"></i>
            <i className="fa fa-star-o" aria-hidden="true"></i>
          </span>

          <ul style={{ listStyle: "none" }}>
            <li className="auction-li">
              <strong>Highest Bid : </strong>
              <span className="auction-li_span">{highestBidFormatted}</span> ETH
            </li>
            <li className="auction-li">
              <strong> Time Left: </strong>
              <span className="auction-li_span">
                {auctionEnded ? "Auction Ended" : `${timeLeft}s`}
              </span>
            </li>
            <li className="auction-li">
              <strong> Previous Value: </strong>
              <span className="auction-li_span">{priceFormatted} ETH</span>
            </li>
            {isOwner && (
              <li className="auction-li">
                <span className="auction-li_span">You are the seller</span>
              </li>
            )}
            {isHighestBidder && (
              <li className="auction-li">
                <span className="auction-li_span">You are highest bidder</span>
              </li>
            )}
          </ul>

          <div className="auction-control">
            {!auctionEnded && !isOwner && (
              <button
                className="auction-btn"
                onClick={placeBid}
                disabled={isSubmitting}
              >
                <span className="price">$ETH</span>
                <span className="shopping-cart">
                  <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                </span>
                <span className="buy">Place Bid</span>
              </button>
            )}

            {auctionEnded && (
              <button
                className="auction-btn"
                onClick={finalizeAuction}
                disabled={isSubmitting}
              >
                <span className="auction-buy">Finalize Auction</span>
              </button>
            )}
          </div>
        </div>

        <div className="auction-product-image">
          <img src={item.image} alt={item.name} />
          <div className="auction-info">
            <h2>Description</h2>
            <p className="auction-information">
              Auctions are live, the clock is ticking, and every bid raises
              the stakes. Outbid your rivals before time runs out — or lose
              your chance forever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
