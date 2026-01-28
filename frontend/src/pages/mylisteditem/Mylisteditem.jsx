
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

import { Loading } from '../../components';
import { ListedItemCard } from "../../pages";

import './Mylisteditem.css';
import '../purchasedItem/purchasedItem1.css';

export default function MyListedItems({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [listedItems, setListedItems] = useState([]);
  const [myownItems, setMyownItems] = useState([]);

  const loadListedItems = useCallback(async () => {
    if (!marketplace || !nft || !account) return;

    setLoading(true); // start loading

    const itemCount = await marketplace.itemCount();
    let listed = [];
    let myOwn = [];
    const ownedTokenIds = new Set();

    for (let idx = 1; idx <= itemCount; idx++) {
      const i = await marketplace.items(idx);
      const uri = await nft.tokenURI(i.tokenId);
      const owner = await nft.ownerOf(i.tokenId);
      const metadata = await fetch(uri).then(res => res.json());
      const totalPrice = await marketplace.getTotalPrice(i.itemId);

      const item = {
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        tokenId: i.tokenId,
        seller: i.seller,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        sold: i.sold
      };

      // 🔵 My active listings
      if (i.seller.toLowerCase() === account.toLowerCase() && !i.sold) {
        listed.push(item);
      }

      // 🟢 NFTs I currently own
      if (owner.toLowerCase() === account.toLowerCase() && !ownedTokenIds.has(i.tokenId.toString())) {
        myOwn.push(item);
        ownedTokenIds.add(i.tokenId.toString());
      }
    }

    setListedItems(listed);
    setMyownItems(myOwn);
    setLoading(false); // finish loading
  }, [marketplace, nft, account]);

  // ---------- call the loader on mount ----------
  useEffect(() => {
    loadListedItems();
  }, [loadListedItems]);

  const cancelListing = async (itemId) => {
    if (!marketplace) return;
    try {
      const tx = await marketplace.cancelItem(itemId);
      await tx.wait();
      alert("Listing cancelled successfully 🎉");
      loadListedItems(); // refresh after cancel
    } catch (err) {
      console.error(err);
      alert("Cancel failed: " + (err?.data?.message || err.message));
    }
  };

  if (loading) return <Loading content="My Listed Items Loading..." />;

  return (
    <div className="bids section__padding">
      <div className="bids-container">
        <div className="bids-container-text">
          <h1>MY LISTED ITEMS</h1>
        </div>
        {listedItems.length > 0 ? (
          <div className="pursha-container-card">
            {listedItems.map(item => (
              <ListedItemCard
                key={item.itemId.toString()}
                item={{ ...item, cancelListing }}
                marketplace={marketplace}
                account={account}
                reloadItems={loadListedItems}
              />
            ))}
          </div>
        ) : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
      </div>

      {/* My Owned NFTs */}
      <div className="bids-container">
        <div className="bids-container-text">
          <h1>MY OWN ITEMS</h1>
        </div>
        {myownItems.length > 0 ? (
          <div className="pursha-container-card">
            {myownItems.map(item => (
              <ListedItemCard
                key={item.itemId.toString()}
                item={item}
                marketplace={marketplace}
                account={account}
                reloadItems={loadListedItems}
              />
            ))}
          </div>
        ) : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No owned assets</h2>
          </main>
        )}
      </div>
    </div>
  );
}

