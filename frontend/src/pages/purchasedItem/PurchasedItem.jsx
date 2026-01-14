import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import './purchasedItem1.css'
import './purchasedItem.css'
import { Link } from 'react-router-dom';

export default function MyPurchases({ marketplace, nft, account }) {
    const [ loading, setLoading ] = useState(true);
    const [ purchases, setPurchases ] = useState([]);

    const loadPurchasedItems =  useCallback(async () => {
        
        // const filter = marketplace.filters.Bought(null, null, null, null, null, account);
        // const results = await marketplace.queryFilter(filter)
        const events = await marketplace.queryFilter("Bought");
        const results = events.filter(e => e.args.buyer.toLowerCase() === account.toLowerCase());

        const purchases = await Promise.all(results.map(async i => {
            i = i.args;
            const uri = await nft.tokenURI(i.tokenId);
            const response = await fetch(uri);
            const metadata = await response.json();
            console.log('purchases',metadata)

            // const totalPrice = await marketplace.getTotalPrice(i.itemId);
            let totalPrice;
                try {
                  totalPrice = await marketplace.getTotalPrice(i.itemId);
                } catch {
                  totalPrice = i.price;
                }

            let purchasedItem = {
                totalPrice,
                price: i.price,
                itemId: i.itemId,
                tokenId: i.tokenId,
                name: metadata.name,
                description: metadata.description,
                image: metadata.image
            }
            return purchasedItem;
        }))
        setLoading(false);
        setPurchases(purchases);
        console.log('purchases',purchases)
    },[marketplace, nft, account]);

    useEffect(() => {
        loadPurchasedItems()
    }, [loadPurchasedItems]);

    if(loading) return (
        <main style = {{ padding: "lrem 0"}}>
            <h2>Loading...</h2>
        </main>
    )
    return (
    <div className='pursha section__padding'>
              <div className="pursha-container">
                <div className="pursha-container-text">
                  <h1>MY Purchased Items</h1>
                </div>
        
                {purchases.length > 0 ? (
                  <div className="pursha-container-card">
                    {purchases.map((item) => (
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
                            <Link to={`/marketing/${item.itemId}/${item.tokenId}`}>
                             <button class="pur-btn" >
                            <span>list</span>
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