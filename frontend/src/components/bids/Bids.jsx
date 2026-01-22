// import { ethers } from 'ethers';
// import './bids.css'
// import { Link } from 'react-router-dom';


// const Bids = ({ items = [], account }) => {

//   const setItem = (itemId) => {
//     localStorage.setItem("DetailItemId", itemId.toString());
//   };

//   return (
//     <div className='bids section__padding'>
//       <div className="bids-container">
//         <div className="bids-container-text">
//           <h1>ITEMS</h1>
//         </div>

//         {items.length > 0 ? (
//           <div className="bids-container-card">
//             {items.map((item) => (
              
//             <div class="card-container" key={item.itemId.toString()}>
//                <Link to="/itemDetail" class="hero-image-container" onClick={() => setItem(item.itemId)}>
//                    <img className='bids-card_img' src={item.image} alt={item.name} />
//                 </Link>
//                 <main class="main-content">
//                   <h1 className='main-content_h1'> {item.name}</h1>
//                   <p className='main-content_p'>Category: {item.category} </p>
//                   <div class="flex-row">
//                     <div class="coin-base">
//                       <img src="https://i.postimg.cc/T1F1K0bW/Ethereum.png" alt="Ethereum" class="small-image"/>
//                       <h2 className='main-content_h2'>$ {ethers.utils.formatEther(item.totalPrice)} ETH</h2>
//                     </div>
                   
//                   </div>
//                 </main>
//                 <div class="card-attribute">
//                   <img src="https://i.postimg.cc/SQBzNQf1/image-avatar.png" alt="avatar" class="small-avatar"/>
//                   <p className='main-content_p'>Creator:<span>Jules</span></p>
//               </div>
//           </div>
//             ))}
//         </div>
//         ) : (
//           <main style={{ padding: "1rem 0" }}>
//             <h2>No listed assets</h2>
//           </main>
//         )}

       
//       </div>

//       <div className="load-more">
//         <button>Load More</button>
//       </div>
//     </div>
//   );
// };

// export default Bids;


 import { ethers } from "ethers";
import "./bids.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../../api/users";

const Bids = ({ items = [] }) => {
  const [creators, setCreators] = useState({});

  const setItem = (itemId) => {
    localStorage.setItem("DetailItemId", itemId.toString());
  };

  // 🔥 Load creator profiles (cached)
  useEffect(() => {
    async function loadCreators() {
      const uniqueAddresses = [
        ...new Set(items.map(i => i.seller?.toLowerCase()))
      ];

      const profiles = {};
      for (const addr of uniqueAddresses) {
        if (!addr) continue;
        try {
          profiles[addr] = await getUser(addr);
        } catch {
          profiles[addr] = null;
        }
      }
      setCreators(profiles);
    }

    if (items.length) loadCreators();
  }, [items]);

  return (
    <div className="bids section__padding">
      <div className="bids-container">
        <div className="bids-container-text">
          <h1>ITEMS</h1>
        </div>

        {items.length > 0 ? (
          <div className="bids-container-card">
            {items.map((item) => {
              const creator = creators[item.seller?.toLowerCase()];

              return (
                <div className="card-container" key={item.itemId.toString()}>
                  <Link
                    to="/itemDetail"
                    className="hero-image-container"
                    onClick={() => setItem(item.itemId)}
                  >
                    <img
                      className="bids-card_img"
                      src={item.image}
                      alt={item.name}
                    />
                  </Link>

                  <main className="main-content">
                    <h1 className="main-content_h1">{item.name}</h1>
                    <p className="main-content_p">
                      Category: {item.category || "NFT"}
                    </p>

                    <div className="flex-row">
                      <div className="coin-base">
                        <img
                          src="https://i.postimg.cc/T1F1K0bW/Ethereum.png"
                          alt="Ethereum"
                          className="small-image"
                        />
                        <h2 className="main-content_h2">
                          {ethers.utils.formatEther(item.totalPrice)} ETH
                        </h2>
                      </div>
                    </div>
                  </main>

                  {/* 🔥 CREATOR SECTION */}
                  <div className="card-attribute">
                    <img
                      src={creator?.avatar}
                      alt="avatar"
                      className="small-avatar"
                    />
                    <p className="main-content_p">
                      Creator:
                      <span>
                        {creator?.username ||
                          item.seller.slice(0, 6) + "..." +
                          item.seller.slice(-4)}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
      </div>
    </div>
  );
};

export default Bids;
