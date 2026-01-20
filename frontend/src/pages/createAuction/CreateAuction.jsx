import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useParams } from "react-router-dom";

import './createAuction.css'

export default function CreateAuction({ marketplace, nft }) {
  const {id, tokenId } = useParams()

  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [dataloading, setDataloading] = useState(true)


  const createAuction = async () => {
    try {
      if (!price || !duration) {
        alert("Enter price and duration")
        return
      }

      setLoading(true)

      const weiPrice = ethers.utils.parseEther(price)

      // ✅ STEP 1: Check approval
      const approvedAddress = await nft.getApproved(tokenId)

      if (approvedAddress.toLowerCase() !== marketplace.address.toLowerCase()) {
        console.log("Approving NFT...")

        const approveTx = await nft.approve(marketplace.address, tokenId)
        await approveTx.wait()
      }

      // ✅ STEP 2: Create auction
      const tx = await marketplace.makeAuctionItem(
        nft.address,
        tokenId,
        weiPrice,
        Number(duration) * 60 // minutes → seconds
      )

      await tx.wait()

      alert("Auction created 🎉")
    } catch (err) {
      console.error(err)
      alert("Transaction failed (see console)")
    } finally {
      setLoading(false)
    }
  }

    const loadItem = async () => {
        const itemData = await marketplace.items(id);
        console.log(itemData);
        const uri = await nft.tokenURI(itemData.tokenId);
        const metadata = await fetch(uri).then(res => res.json());
        const totalPrice = await marketplace.getTotalPrice(id);
    
        setItem({
          id,
          seller: itemData.seller,
          totalPrice,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
    
        setDataloading(false);
      };
  
      
        useEffect(() => {
        loadItem();
      },[]);

      if (dataloading || !item) {
           return <h2>Loading Auction Data...</h2>;
  }
  return (
  <div className="createAuction">
    <div class="createAuctio-item">
      <h3>Create Auction</h3>
      <div className="createAuctio-imagebox">
        <img className="createAuctio-image" src={item.image} alt={item.name} />
        
      </div>
      
      <p class="createAuctio-price">${ethers.utils.formatEther(item.totalPrice)} ETH</p>
      <p class="createAuctio-special">Free Acution!</p>
      <label for="size-select">Many money:</label>
      <input className="createAuctio-input"
            placeholder="Start Price (ETH)"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
      <label className="createAuctio-label" for="color-select">Time:</label>
      <input className="createAuctio-input"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
      <label className="createAuctio-label" for="quantity-select">Quantity:</label>
      
	    <button type="button" onClick={createAuction} disabled={loading}>{loading ? "Creating..." : "Create Auction"}</button>
    </div>
  </div>
  )
}
