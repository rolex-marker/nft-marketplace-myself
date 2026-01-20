import { ethers } from 'ethers';
import './bids.css'
import { Link } from 'react-router-dom';


const Bids = ({ items = [], account }) => {

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
              
            <div class="card-container" key={item.itemId.toString()}>
               <Link to="/itemDetail" class="hero-image-container" onClick={() => setItem(item.itemId)}>
                   <img className='bids-card_img' src={item.image} alt={item.name} />
                </Link>
                <main class="main-content">
                  <h1 className='main-content_h1'> {item.name}</h1>
                  <p className='main-content_p'>Category: {item.category} </p>
                  <div class="flex-row">
                    <div class="coin-base">
                      <img src="https://i.postimg.cc/T1F1K0bW/Ethereum.png" alt="Ethereum" class="small-image"/>
                      <h2 className='main-content_h2'>$ {ethers.utils.formatEther(item.totalPrice)} ETH</h2>
                    </div>
                   
                  </div>
                </main>
                <div class="card-attribute">
                  <img src="https://i.postimg.cc/SQBzNQf1/image-avatar.png" alt="avatar" class="small-avatar"/>
                  <p className='main-content_p'>Creator:<span>Jules</span></p>
              </div>
          </div>
            ))}
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


 