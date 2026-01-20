import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import './Marketing.css';
import '../item/item.css';
import '../create/create.css';

export default function Marketing({ marketplace, nft }) {
  const { id, tokenId } = useParams();
  console.log("id>>>>", id)
  console.log("tokenId>>>>", tokenId)
  const [loading, setLoading] = useState(true)
   const [item, setItem] = useState(null)
   const [price, setPrice] = useState(null)
   const [isSubmitting, setIsSubmitting] = useState(false)

   const listAgain = async () => {
  if (isSubmitting) return;
  if (!price) return;

  setIsSubmitting(true);

  try {
    const listingPrice = ethers.utils.parseEther(price.toString());

    // 🔑 APPROVE MARKETPLACE
    const approvalTx = await nft.approve(marketplace.address, tokenId);
    await approvalTx.wait();

    // 🛒 LIST ITEM
    const tx = await marketplace.makeItem(
      nft.address,
      tokenId,
      listingPrice
    );
    await tx.wait();

    alert("NFT listed successfully 🎉");
  } catch (err) {
    console.error(err);
    alert("Listing failed");
  } finally {
    setIsSubmitting(false);
  }
};

  
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
  
      setLoading(false);
    };

    
      useEffect(() => {
      loadItem();
    }, []);
  
    if (loading || !item) {
    return <h2>Loading item...</h2>;
  }
 return (
   <div className="item section__padding">
     <div className="item-image">
       <img src={item.image} alt={item.name} />
     </div>
 
     <div className="item-content">
       <div className="item-content-title">
         <h1>{item.name}</h1>
         <p>
           From{" "}
           <span>
             {ethers.utils.formatEther(item.totalPrice)} ETH
           </span>
         </p>
       </div>
 
       <div className="item-content-creator">
         <p>Creator</p>
         <p>{item.seller}</p>
       </div>
 
       <div className="item-content-detail">
         <p>{item.description}</p>
       </div>
       
        <div className="formGroup">
            <label style={{color : "#fff"}}>Price</label>
            <div className="twoForm">
              <input id="price" name="price" type="text" onChange={e => setPrice(e.target.value)} placeholder='Price'  />
              <select>
                <option value="ETH">ETH</option>
                <option value="BTC">BTC</option>
                <option value="LTC">LTC</option>
              </select>
            </div>
          </div>
 
       <div className="item-content-buy">
         <button
            onClick={listAgain}
           className="primary-btn"
         > {isSubmitting ? "Processing..." : `Marketing as ${price} ETH`}
           
         </button>
         
       </div>
     </div>
   </div>
 );
}