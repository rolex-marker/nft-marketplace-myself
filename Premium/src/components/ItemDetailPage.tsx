import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Gavel, 
  Tag, 
  Clock, 
  Eye, 
  Heart, 
  Share2,
  CheckCircle,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { mockNFTs, mockOffers, mockTransactions, shortenAddress } from '../mockData';
import { useWallet } from '../WalletContext';
import PlaceBidModal from './modals/PlaceBidModal';
import MakeOfferModal from './modals/MakeOfferModal';
import Toast, { ToastType } from './Toast';

const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isConnected, address } = useWallet();
  const [showBidModal, setShowBidModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false
  });

  const nft = mockNFTs.find((n) => n.id === id);
  const offers = mockOffers.filter((o) => o.nftId === id);
  const isOwner = address && nft && address === nft.owner;

  if (!nft) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">NFT Not Found</h2>
          <Link to="/marketplace" className="text-purple-600 hover:text-purple-700">
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const getTimeRemaining = (endTime?: Date) => {
    if (!endTime) return null;
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Auction Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const handleBuyNow = () => {
    if (!isConnected) {
      setToast({ message: 'Please connect your wallet first', type: 'error', visible: true });
      return;
    }
    setToast({ message: 'Purchase successful! NFT transferred to your wallet.', type: 'success', visible: true });
  };

  const handlePlaceBid = (amount: number) => {
    setToast({ 
      message: `Bid of ${amount} ETH placed successfully!`, 
      type: 'success', 
      visible: true 
    });
  };

  const handleMakeOffer = (amount: number) => {
    setToast({ 
      message: `Offer of ${amount} ETH submitted successfully!`, 
      type: 'success', 
      visible: true 
    });
  };

  const handleAcceptOffer = (offerId: string) => {
    setToast({ 
      message: 'Offer accepted! Transaction processing...', 
      type: 'success', 
      visible: true 
    });
  };

  const timeRemaining = getTimeRemaining(nft.auctionEndTime);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/marketplace" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Marketplace</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: NFT Image */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-xl"
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full aspect-square object-cover"
              />
              
              {/* Quick Actions Overlay */}
              <div className="absolute top-6 right-6 flex space-x-3">
                <button className="p-3 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white transition-all shadow-lg">
                  <Heart className="w-5 h-5 text-gray-700" />
                </button>
                <button className="p-3 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white transition-all shadow-lg">
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Views</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{nft.views}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Favorites</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{nft.favorites}</p>
              </div>
            </div>
          </div>

          {/* Right: NFT Details */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div>
              <div className="inline-flex px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
                {nft.category}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{nft.name}</h1>
              <p className="text-lg text-gray-600">{nft.description}</p>
            </div>

            {/* Owner & Creator */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Owner</span>
                <span className="font-semibold text-gray-900">{shortenAddress(nft.owner)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Creator</span>
                <span className="font-semibold text-gray-900">{shortenAddress(nft.creator)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Token ID</span>
                <span className="font-mono text-sm text-gray-900">{nft.tokenId}</span>
              </div>
            </div>

            {/* Auction Timer */}
            {nft.saleType === 'auction' && nft.status === 'active' && timeRemaining !== 'Auction Ended' && (
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Auction ends in</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {typeof timeRemaining === 'object' && (
                    <>
                      <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                        <div className="text-3xl font-bold">{timeRemaining.days}</div>
                        <div className="text-sm text-white/80">Days</div>
                      </div>
                      <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                        <div className="text-3xl font-bold">{timeRemaining.hours}</div>
                        <div className="text-sm text-white/80">Hours</div>
                      </div>
                      <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                        <div className="text-3xl font-bold">{timeRemaining.minutes}</div>
                        <div className="text-sm text-white/80">Mins</div>
                      </div>
                      <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                        <div className="text-3xl font-bold">{timeRemaining.seconds}</div>
                        <div className="text-sm text-white/80">Secs</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Price / Bid */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              {nft.saleType === 'auction' ? (
                <>
                  <p className="text-sm text-gray-600 mb-2">Current Bid</p>
                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {nft.highestBid?.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-600">ETH</span>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-2">Price</p>
                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {nft.price?.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-600">ETH</span>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              {nft.status === 'active' && !isOwner && (
                <div className="grid grid-cols-1 gap-3">
                  {nft.saleType === 'fixed' && (
                    <button
                      onClick={handleBuyNow}
                      className="flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Buy Now</span>
                    </button>
                  )}
                  {nft.saleType === 'auction' && (
                    <button
                      onClick={() => setShowBidModal(true)}
                      className="flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all"
                    >
                      <Gavel className="w-5 h-5" />
                      <span>Place Bid</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowOfferModal(true)}
                    className="flex items-center justify-center space-x-2 px-6 py-4 rounded-xl border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all"
                  >
                    <Tag className="w-5 h-5" />
                    <span>Make Offer</span>
                  </button>
                </div>
              )}

              {nft.status === 'sold' && (
                <div className="flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-gray-100 text-gray-600 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  <span>Sold</span>
                </div>
              )}
            </div>

            {/* Offers Section */}
            {offers.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Offers ({offers.length})</span>
                </h3>
                <div className="space-y-3">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {offer.amount} ETH
                        </p>
                        <p className="text-sm text-gray-600">
                          from {shortenAddress(offer.buyer)}
                        </p>
                      </div>
                      {isOwner && offer.status === 'pending' && (
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:shadow-lg transition-all"
                        >
                          Accept
                        </button>
                      )}
                      {offer.status !== 'pending' && (
                        <span className="text-sm text-gray-500 capitalize">{offer.status}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transaction History */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Transaction History</h3>
              <div className="space-y-4">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 capitalize">{tx.type}</p>
                      <p className="text-sm text-gray-600">
                        {tx.from && `From ${shortenAddress(tx.from)}`}
                        {tx.to && ` to ${shortenAddress(tx.to)}`}
                      </p>
                      {tx.amount && (
                        <p className="text-sm font-semibold text-purple-600">{tx.amount} ETH</p>
                      )}
                    </div>
                    <a
                      href={`https://etherscan.io/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PlaceBidModal
        isOpen={showBidModal}
        onClose={() => setShowBidModal(false)}
        currentBid={nft.highestBid || 0}
        nftName={nft.name}
        onPlaceBid={handlePlaceBid}
      />

      <MakeOfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        nftName={nft.name}
        currentPrice={nft.price}
        onMakeOffer={handleMakeOffer}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default ItemDetailPage;
