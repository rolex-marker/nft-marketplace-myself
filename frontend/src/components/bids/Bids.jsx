import { ethers } from 'ethers';
import './bids.css'
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from 'react-router-dom';


const Bids = ({ items = [] }) => {

  const setItem = (itemId) => {
    localStorage.setItem("DetailItemId", itemId.toString());
  };

  return (
    <div className='bids section__padding'>
      <div className="bids-container">
        <div className="bids-container-text">
          <h1>ITEMS</h1>
        </div>

        {items.length > 0 ? (
          <div className="bids-container-card">
            {items.map((item) => (
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
                    <Link to="/itemDetail">
                     <button class="pur-btn" onClick={() => setItem(item.itemId)}>
                            <span>BUY</span>
                           <svg class="pur-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                           <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4"/>
                           <line x1="3" y1="6" x2="21" y2="6"/>
                           <path d="M16 10a4 4 0 01-8 0"/>
                           </svg>
                      </button>
                      </Link>
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
};

export default Bids;


 