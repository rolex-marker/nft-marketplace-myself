import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Row, Col, Card } from "react-bootstrap";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import './purchasedItem.css'

export default function MyPurchases({ marketplace, nft, account }) {
    const [ loading, setLoading ] = useState(true);
    const [ purchases, setPurchases ] = useState([]);
    const loadPurchasedItems =  useCallback(async () => {
        
        const filter = marketplace.filters.Bought(null, null, null, null, null, account);
        const results = await marketplace.queryFilter(filter)

        const purchases = await Promise.all(results.map(async i => {
            i = i.args;
            const uri = await nft.tokenURI(i.tokenId);
            const response = await fetch(uri);
            const metadata = await response.json();
            const totalPrice = await marketplace.getTotalPrice(i.itemId);

            let purchasedItem = {
                totalPrice,
                price: i.price,
                itemId: i.itemId,
                name: metadata.name,
                description: metadata.description,
                image: metadata.image
            }
            return purchasedItem;
        }))
        setLoading(false);
        setPurchases(purchases);
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
    <div className='bids section__padding'>
              <div className="bids-container">
                <div className="bids-container-text">
                  <h1>MY Purchased Items</h1>
                </div>
        
                {purchases.length > 0 ? (
                  <div className="bids-container-card">
                    {purchases.map((item) => (
                      <div className="card-column" key={item.itemId.toString()}>
                        <div className="bids-card">
                          <div className="bids-card-top">
                            <img src={item.image} alt={item.name} />
                              <p >
                                {item.name}
                              </p>
                          </div>
                          <div className="bids-card-bottom">
                            <p>{ethers.utils.formatEther(item.totalPrice)} <span>ETH</span></p>
                            <p><AiFillHeart /> 92</p>
                          </div>
                        </div>
                        <div className="bid-like">
                          <AiOutlineHeart />
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