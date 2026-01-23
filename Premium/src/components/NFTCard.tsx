import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ethers } from "ethers";
import { Clock, Heart, Eye } from 'lucide-react';
import { NFT, shortenAddress } from '../mockData';
// import useCountdown from '../components/functions/useCountdown'
interface NFTCardProps {
  nft: NFT;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {

  const getTimeRemaining = (itemEndTime?: String) => {
    console.log("NFTEndTime>>>", itemEndTime);
    // if (!endTime) return null;
    // const now = new Date().getTime();
    // const end = new Date(endTime).getTime();
    // const diff = end - now;

    // if (diff <= 0) return 'Ended';

    // const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    // const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    // const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    // if (days > 0) return `${days}d ${hours}h`;
    // if (hours > 0) return `${hours}h ${minutes}m`;
    const endTime =
        itemEndTime?.toNumber
          ? itemEndTime.toNumber()
          : Number(itemEndTime);
    
      // const timeLeft = useCountdown(endTime);
      console.log(endTime)
    return itemEndTime.toString().slice(0,5);
  };


  return (
    <Link to={``}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200 group"
      >
        {/* NFT Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-100">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Status Badge */}
          {nft.sold == true && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gray-900/90 backdrop-blur-sm text-white text-sm font-medium">
              Sold
            </div>
          )}
          
          {/* Auction Timer */}
          {nft.isAuction == true && (
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-purple-600/90 backdrop-blur-sm text-white text-sm font-medium flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{getTimeRemaining(nft.endTime)}</span>
            </div>
          )}

          {/* Quick Stats Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span></span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* NFT Name */}
          <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">
            {nft.name}
          </h3>

          {/* Owner */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Owner</span>
            <span className="text-sm font-medium text-gray-900">
              {shortenAddress(nft.seller)}
            </span>
          </div>

          {/* Price / Bid Section */}
          <div className="pt-4 border-t border-gray-100">
            {nft.isAuction == true ? (
              <div>
                <p className="text-xs text-gray-500 mb-1">Current Bid</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                   {ethers.utils.formatEther(nft.totalPrice)}
                  </span>
                  <span className="text-sm text-gray-600">ETH</span>
                </div>
              </div>
            ) : nft.sold == true ? (
              <div>
                <p className="text-xs text-gray-500 mb-1">Sold For</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {ethers.utils.formatEther(nft.totalPrice)}
                  </span>
                  <span className="text-sm text-gray-600">ETH</span>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500 mb-1">Price</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {ethers.utils.formatEther(nft.totalPrice)}
                  </span>
                  <span className="text-sm text-gray-600">ETH</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default NFTCard;
