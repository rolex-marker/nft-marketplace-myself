import { ethers } from 'ethers';
import './item.css'
import creator from '../../assets/seller2.png'
import { useState, useEffect } from 'react';


const Item = ({marketplace, nft}) => {

  console.log(marketplace);
   const itemId = localStorage.getItem("DetailItemId");
  
    const [loading, setLoading] = useState(true)
    const [item, setItem] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const phurchase = async(itemId, totalPrice) => {
      if (isSubmitting) return

      setIsSubmitting(true)
      try{
        await (await marketplace.purchaseItem(itemId, {
              value: totalPrice,
            })).wait()
            alert("NFT Buy successfully 🎉")
      } catch(err) {
       console.error(err)
      } finally {
      setIsSubmitting(false)
      }
    }

  const loadItem = async () => {
    const itemData = await marketplace.items(itemId);
    const uri = await nft.tokenURI(itemData.tokenId);
    const metadata = await fetch(uri).then(res => res.json());
    const totalPrice = await marketplace.getTotalPrice(itemId);

    setItem({
      itemId,
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

      <div className="item-content-buy">
        <button
          onClick={() =>
            phurchase(item.itemId, item.totalPrice)
          }
          className="primary-btn"
        >
          Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
        </button>
        
      </div>
    </div>
  </div>
);

};

export default Item;
