import { useState, useEffect, useCallback } from "react";
import { ethers } from 'ethers'
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import './Mylisteditem.css'
import { Row, Col, Card } from 'react-bootstrap'

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
      if (i.seller.toLowerCase() === account) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId)
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
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        }
        listedItems.push(item)
        // Add listed item to sold items array if sold
        if (i.sold) soldItems.push(item)
      }
    }
    setLoading(false)
    setListedItems(listedItems)
    setSoldItems(soldItems)
  }, [marketplace, nft, account]);

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
              <div className="bids-container-card">
                {listedItems.map((item) => (
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
          <div className="bids-container">
            <div className="bids-container-text">
              <h1>MY SOLD ITEMS</h1>
            </div>
    
            {soldItems.length > 0 ? (
              <div className="bids-container-card">
                {soldItems.map((item) => (
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
                   
              </div>
            ) : (
              <main style={{ padding: "1rem 0" }}>
                <h2>No Sold listed assets</h2>
              </main>
            )}
          </div>
    
          <div className="load-more">
            <button>Load More</button>
          </div>
        </div>
  );

}

//<div className="flex justify-center">
    //   {purchases.length > 0 ?
    //     <div className="px-5 container">
    //       <Row xs={1} md={2} lg={4} className="g-4 py-5">
    //         {purchases.map((item, idx) => (
    //           <Col key={idx} className="overflow-hidden">
    //             <Card>
    //               <Card.Img variant="top" src={item.image} />
    //               <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
    //             </Card>
    //           </Col>
    //         ))}
    //       </Row>
    //     </div>
    //     : (
    //       <main style={{ padding: "1rem 0" }}>
    //         <h2>No purchases</h2>
    //       </main>
    //     )}
    // </div>