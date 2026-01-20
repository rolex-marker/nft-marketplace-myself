import { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import { ethers } from 'ethers'

import './Mylisteditem.css'
import '../purchasedItem/purchasedItem1.css'


export default function MyListedItems({ marketplace, nft, account }) {

    const [ loading, setLoading ] = useState(true)
    const [listedItems, setListedItems ] = useState([])
    const [soldItems, setSoldItems] = useState([])

    const loadListedItems = useCallback(async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount()
    let listedItems = []
    let soldItems = []
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx)
      if (i.seller.toLowerCase() !== account.toLowerCase()) continue;
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId);
        const owner = await nft.ownerOf(i.tokenId);
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId)
        // define listed item object
        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          tokenId: i.tokenId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          sold: i.sold
        }
        // Only add to listedItems if not sold/cancelled
          if (!i.sold) {
            listedItems.push(item);
          } else {
            if(owner.toLowerCase() === account.toLowerCase()) soldItems.push(item);
          }   
    }
    setLoading(false)
    setListedItems(listedItems)
    setSoldItems(soldItems)
  }, [marketplace, nft, account]);

  const cancelListing = async (itemId) => {
  if (!marketplace) return;
  try {
    const tx = await marketplace.cancelItem(itemId);
    await tx.wait();
    alert("Listing cancelled successfully 🎉");
    loadListedItems(); // refresh UI
  } catch (err) {
    console.error(err);
    alert("Cancel failed: " + (err?.data?.message || err.message));
  }
};

  useEffect(() => {
    loadListedItems()
  }, [loadListedItems])

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

  return (

    <div className='bids section__padding'>
          <div className="bids-container">
            <div className="bids-container-text">
              <h1>MY MINT ITEMS</h1>
            </div>
    
            {listedItems.length > 0 ? (
              <div className="pursha-container-card">
                                {listedItems.map((item) => (
                                  <div class="pur-card" key={item.itemId.toString()}>
                                    <div class="pur-tilt">
                                     <div class="pur-img"><img src={item.image} alt="Premium Laptop" /></div>
                                     </div>
                                      <div class="pur-info">
                                      <h2 class="pur-title">{item.name}</h2>
                                       <p class="pur-desc">{item.description}</p>
                                
                                         <div class="pur-bottom">
                                       <div class="pur-price">
                                        <span class="pur-new">ETH{ethers.utils.formatEther(item.totalPrice)}</span>
                                        </div>
                                       
                                         <button class="pur-btn" onClick={() => cancelListing(item.itemId)}>
                                        <span>CANCEL</span>
                                       <svg class="pur-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                       <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4"/>
                                       <line x1="3" y1="6" x2="21" y2="6"/>
                                       <path d="M16 10a4 4 0 01-8 0"/>
                                       </svg>
                                  </button>
                                 
                              </div>
                           <div class="pur-meta">
                          </div>
                          </div>
            
                           </div>
                                ))}
                    
                                {/* Static card */}
                               
              </div>
                ) : (
              <main style={{ padding: "1rem 0" }}>
              <h2>No listed assets</h2>
              </main>
                            )}
          </div>
          <div className="bids-container">
            <div className="bids-container-text">
              <h1>MY SOLD ITEMS</h1>
            </div>
    
            {soldItems.length > 0 ? (
            <div className="pursha-container-card">
                                {soldItems.map((item) => (
                                  <div class="pur-card" key={item.itemId.toString()}>
                                    <div class="pur-tilt">
                                     <div class="pur-img"><img src={item.image} alt="Premium Laptop" /></div>
                                     </div>
                                      <div class="pur-info">
                                      <h2 class="pur-title">{item.name}</h2>
                                       <p class="pur-desc">{item.description}</p>
                                
                                         
                                       <div class="pur-price">
                                        <span class="pur-new">ETH{ethers.utils.formatEther(item.totalPrice)}</span>
                                        </div>
                                        <div class="pur-buttonbox">
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
                                        </div>
                           <div class="pur-meta">
                          </div>
                          </div>
            
                           </div>
                                ))}
                    
                                {/* Static card */}
                               
              </div>
            ) : (
            <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
            </main>
            )}
          </div>
          <div className="load-more">
            <button>Load More</button>
          </div>
        </div>
  );

}

