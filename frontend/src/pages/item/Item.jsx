// import { ethers } from 'ethers';
// import './item.css'
// import { useState, useEffect } from 'react';


// const Item = ({marketplace, nft, account}) => {

//   console.log(marketplace);
//    const itemId = localStorage.getItem("DetailItemId");
  
//     const [loading, setLoading] = useState(true)
//     const [item, setItem] = useState(null)
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [seller, setSeller] = useState(null);

//     const phurchase = async(itemId) => {
//       if (isSubmitting) return

//       const totalPrice = await marketplace.getTotalPrice(item.itemId);
//       setIsSubmitting(true)
//       try{
//         await (await marketplace.purchaseItem(itemId, {
//               value: totalPrice,
//             })).wait()
            
//             alert("NFT Buy successfully 🎉")
//       } catch(err) {
//        console.error(err)
//       } finally {
        
//       setIsSubmitting(false)
//       }
//     }

//   const loadItem = async () => {
//     const itemData = await marketplace.items(itemId);
//     const uri = await nft.tokenURI(itemData.tokenId);
//     const metadata = await fetch(uri).then(res => res.json());
//     const totalPrice = await marketplace.getTotalPrice(itemId);

//     setItem({
//       itemId,
//       seller: itemData.seller,
//       totalPrice,
//       name: metadata.name,
//       description: metadata.description,
//       image: metadata.image,
//     });
//     console.log("seller>>>>",itemData.seller);
//     console.log("account>>>>", account);
//     setSeller(itemData.seller);
//     setLoading(false);
//   };

 

//     useEffect(() => {
//     loadItem();
//   }, []);

//   if (loading || !item) {
//   return <h2>Loading item...</h2>;
// }

// return (
//   <div className="item section__padding">
//     <div className="item-image">
//       <img src={item.image} alt={item.name} />
//     </div>

//     <div className="item-content">
//       <div className="item-content-title">
//         <h1>{item.name}</h1>
//         <p>
//           From{" "}
//           <span>
//             {ethers.utils.formatEther(item.totalPrice)} ETH
//           </span>
//         </p>
//       </div>

//       <div className="item-content-creator">
//         <p>Creator</p>
//         <p>{item.seller}</p>
//       </div>

//       <div className="item-content-detail">
//         <p>{item.description}</p>
//       </div>

//       <div className="item-content-buy">
//         { seller === account ? "":(<button
//           onClick={() =>
//             phurchase(item.itemId)
//           }
//           className="primary-btn"
//         >
//           Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
//         </button>) }
        
//       </div>
//     </div>
//   </div>
// );

// };

// export default Item;

import axios from "axios";
import { ethers } from 'ethers';
import './item.css'
import { useState, useEffect } from 'react';

const Item = ({ marketplace, nft, account }) => {

  const itemId = localStorage.getItem("DetailItemId");
  const token = localStorage.getItem("token");
  
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seller, setSeller] = useState(null);

  // ---------- Purchase NFT ----------
  const phurchase = async (itemId) => {
  if (isSubmitting) return;

  setIsSubmitting(true);
  try {
    const totalPrice = await marketplace.getTotalPrice(item.itemId);

    // 1️⃣ Execute purchase
    const tx = await marketplace.purchaseItem(itemId, {
      value: totalPrice,
    });

    // 2️⃣ Wait for confirmation
    const receipt = await tx.wait();

    // 3️⃣ Send transaction to backend
    

    await axios.post(
      "http://localhost:4000/transactions/",
      {
        itemId: item.itemId,
        tokenId: item.tokenId || null,
        price: ethers.utils.formatEther(totalPrice),
        seller: item.seller,
        buyer: account,
        type: "BUY",
        txHash: receipt.transactionHash,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("NFT bought successfully 🎉");

  } catch (err) {
    console.error(err);
    alert("Purchase failed: " + (err?.data?.message || err.message));
  } finally {
    setIsSubmitting(false);
  }
};


  // ---------- Make Offer ----------
  const makeOffer = async () => {
    if (!marketplace || !item) return;
    const offerAmount = prompt("Enter your offer amount (ETH):");
    if (!offerAmount) return;

    setIsSubmitting(true);
    try {
      await (await marketplace.makeOffer(item.itemId, {
        value: ethers.utils.parseEther(offerAmount)
      })).wait();

      alert(`Offer of ${offerAmount} ETH submitted successfully 🎉`);
    } catch(err) {
      console.error(err);
      alert("Offer failed: " + (err?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Load NFT Data ----------
  const loadItem = async () => {
    try {
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
      setSeller(itemData.seller);
    } catch (err) {
      console.error("Failed to load item:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItem();
  }, []);

  if (loading || !item) return <h2>Loading item...</h2>;

  const isOwner = seller.toLowerCase() === account?.toLowerCase();

  return (
    <div className="item section__padding">
      <div className="item-image">
        <img src={item.image} alt={item.name} />
      </div>

      <div className="item-content">
        <div className="item-content-title">
          <h1>{item.name}</h1>
          <p>
            Price: <span>{ethers.utils.formatEther(item.totalPrice)} ETH</span>
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
          {/* Buy button */}
          {!isOwner && (
            <button
              onClick={() => phurchase(item.itemId)}
              className="primary-btn"
              disabled={isSubmitting}
            >
              Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
            </button>
          )}

          {/* Make Offer button */}
          {!isOwner && (
            <button
              onClick={makeOffer}
              className="secondary-btn"
              disabled={isSubmitting}
              style={{ marginLeft: '10px' }}
            >
              Make Offer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;
