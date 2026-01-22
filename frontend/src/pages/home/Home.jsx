import { useState, useEffect,useCallback } from 'react';
import {Bids, Header, Loading} from '../../components';



const Home = ({ marketplace, nft, account }) => {

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const loadMarketplaceItems = useCallback(async () => {
   
    // Load all unsold items
    const itemCount = await marketplace.itemCount();
    let items = []
    
    for (let i = 1; i <= itemCount; i++) {
       
      const item = await marketplace.items(i)
       await console.log("owner>>>", item);
      if (!item.sold && !item.isAuction) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId);
        
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
          image: metadata.image,
          category: metadata.category,
          availitem: metadata.availitem,
          isAuction: item.isAuction
        })
         
      }
     
    }
    setLoading(false)
    setItems(items)
  }, [marketplace, nft])

  

  useEffect(() => {
    loadMarketplaceItems()
  }, [loadMarketplaceItems])
  if (loading) return (
    <Loading content="Loading Home" />
  )

  return (
    <div>
   <Header />
   <Bids items={items}  account={account}/>
  </div>
  );
};

export default Home;
