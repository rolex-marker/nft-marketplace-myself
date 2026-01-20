import { ethers } from "ethers"
import useCountdown from "../users/useCountdown"
import "./auctionCard.css"

export default function AuctionCard({ item, marketplace, account }) {
  const endTime =
    item.endTime?.toNumber
      ? item.endTime.toNumber()
      : Number(item.endTime)

  const timeLeft = useCountdown(endTime)
  const auctionEnded = timeLeft <= 0

  const isOwner =
    item.seller &&
    account &&
    item.seller.toLowerCase() === account.toLowerCase()

  const isHighestBidder =
    item.highestBidder &&
    item.highestBidder !== ethers.constants.AddressZero &&
    account &&
    item.highestBidder.toLowerCase() === account.toLowerCase()

  const placeBid = async () => {
    const bid = prompt("Enter bid amount (ETH)")
    if (!bid) return

    await marketplace.placeBid(item.itemId, {
      value: ethers.utils.parseEther(bid)
    })
  }

  const finalizeAuction = async () => {
    await marketplace.finalizeAuction(item.itemId)
  }

  return (
    <div className="auction-card">
    <div id="auction-container">	
	  <div class="auction-product-details">
		
    <h1>{item.name}</h1>
    <span class="auction-hint-star star">
      <i class="fa fa-star" aria-hidden="true"></i>
      <i class="fa fa-star" aria-hidden="true"></i>
      <i class="fa fa-star" aria-hidden="true"></i>
      <i class="fa fa-star" aria-hidden="true"></i>
      <i class="fa fa-star-o" aria-hidden="true"></i>
    </span>
		
			<ul style={{listStyle: "none"}}>
		<li className="auction-li"><strong>Highest Bid : </strong><span className="auction-li_span">{ethers.utils.formatEther(item.highestBid || 0)} </span>ETH</li>
		<li  className="auction-li"><strong> Time Left: </strong><span className="auction-li_span">{auctionEnded ? "Auction Ended" : `${timeLeft}s`}</span></li>
		<li className="auction-li"><strong> Previous Value: </strong>$<span className="auction-li_span"> {ethers.utils.formatEther(item.price)}</span> ETH</li>
		<li className="auction-li"><strong> {isOwner && <p><span className="auction-li_span">You are the seller</span></p>} </strong></li>
		<li className="auction-li"><strong> {isHighestBidder && <p><span className="auction-li_span">You are highest bidder</span></p>}
 </strong></li>

		
	</ul>

		
		
<div class="auction-control">

    {!auctionEnded && !isOwner && (
        <button class="auction-btn" onClick={placeBid}>
	 <span class="price">$ETH</span>
   <span class="shopping-cart"><i class="fa fa-shopping-cart" aria-hidden="true"></i></span>
   <span class="buy">Place Bid</span>
 </button>
      )}
   {auctionEnded && (
        <button class="auction-btn" onClick={finalizeAuction}>
           <span class="auction-buy">Finalize Auction</span>
          
        </button>
      )}
	
	
	
</div>
			
</div>
	
<div class="auction-product-image">
	
	<img src={item.image} alt={item.name}/>
	

<div class="auction-info">
	<h2> Description</h2>
	
  <p class="auction-information"> Auctions are live, the clock is ticking, and every bid raises the stakes. Outbid your rivals before time runs out — or lose your chance forever.

Will you claim the NFT, or watch it go to someone else?</p>
</div>
</div>

</div>
    </div>
  )
}
