import { useState, useEffect,useCallback } from 'react';
import {Bids, Header, } from '../../components';



const Home = ({ marketplace, nft }) => {

  

  console.log(marketplace);
  console.log(nft);

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const loadMarketplaceItems = useCallback(async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      console.log(itemCount);
      const item = await marketplace.items(i)
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    setLoading(false)
    setItems(items)
    console.log(items)
  }, [marketplace, nft])

  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    loadMarketplaceItems()
  }

  useEffect(() => {
    loadMarketplaceItems()
  }, [loadMarketplaceItems])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

  return (
    <div>
   <Header />
   <Bids items={items} buyMarketItem={buyMarketItem}  />
  </div>
  );
};

export default Home;
