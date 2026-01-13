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
                    <Link to="/itemDetail">
                      <p onClick={() => setItem(item.itemId)}>
                        {item.name}
                      </p>
                    </Link>
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
};

export default Bids;


 