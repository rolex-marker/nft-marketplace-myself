export async function loadAuctionItems(marketplace, nft) {
  const itemCount = await marketplace.itemCount()
  let auctions = []

  for (let i = 1; i <= itemCount; i++) {
    const item = await marketplace.items(i)
    const uri = await nft.tokenURI(item.tokenId);
    const metadata = await fetch(uri).then(res => res.json());

    if (item.isAuction && !item.sold) {
      auctions.push({
        itemId: item.itemId.toNumber(),
        nft: item.nft,
        tokenId: item.tokenId.toNumber(),
        price: item.price,
        seller: item.seller,
        endTime: item.endTime.toNumber(),
        highestBid: item.highestBid,
        highestBidder: item.highestBidder,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
      })
    }
  }

  return auctions
}
