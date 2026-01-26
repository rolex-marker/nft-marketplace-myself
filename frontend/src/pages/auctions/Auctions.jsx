import { useEffect, useState, useCallback } from "react"
import AuctionCard from "../auctionCard/AuctionCard"
import { loadAuctionItems } from "../users/loadMarketplaceItems";

import './auctions.css'

export default function Auctions({ marketplace, nft, account }) {
  const [auctions, setAuctions] = useState([])

  console.log("Infinite>>>>")

  const load = useCallback(async () => {
    if (!marketplace) return
    const items = await loadAuctionItems(marketplace, nft)
    setAuctions(items)
  }, [marketplace, nft])

  // Initial load
  useEffect(() => {
    load()
  }, [load])

  // 🔥 Event listener (SAFE)
  useEffect(() => {
    if (!marketplace) return

    const handleBid = (itemId, bidder, amount) => {
      console.log(
        "Bid placed:",
        itemId.toString(),
        bidder,
        amount.toString()
      )
      load()
    }

    marketplace.on("AuctionBid", handleBid)

    return () => {
      marketplace.off("AuctionBid", handleBid)
    }
  }, [marketplace, load])

  return (
    <div>

      {auctions.length === 0 && <div className="auction-no"><h1>No found Auctions</h1></div>}

      {auctions.map(item => (
        <AuctionCard
          key={item.itemId}
          item={item}
          marketplace={marketplace}
          account={account}
          nft={nft}
        />
      ))}
    </div>
  )
}
