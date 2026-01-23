import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Clock, XCircle } from 'lucide-react';
import NFTCard from './NFTCard';
import { mockNFTs } from '../mockData';
import { useWallet } from '../WalletContext';
import Toast, { ToastType } from './Toast';

const MyListedItemsPage: React.FC = () => {
  const { address, isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'ended'>('active');
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to view your listed items</p>
        </div>
      </div>
    );
  }

  const myNFTs = mockNFTs.filter((nft) => nft.owner === address || nft.creator === address);
  const activeNFTs = myNFTs.filter((nft) => nft.status === 'active');
  const soldNFTs = myNFTs.filter((nft) => nft.status === 'sold');
  const endedNFTs = myNFTs.filter((nft) => nft.status === 'ended');

  const handleCancelListing = (nftId: string) => {
    setToast({ 
      message: 'Listing cancelled successfully!', 
      type: 'success', 
      visible: true 
    });
  };

  const getCurrentNFTs = () => {
    switch (activeTab) {
      case 'active':
        return activeNFTs;
      case 'sold':
        return soldNFTs;
      case 'ended':
        return endedNFTs;
      default:
        return activeNFTs;
    }
  };

  const currentNFTs = getCurrentNFTs();

  const tabs = [
    { id: 'active' as const, label: 'Active', count: activeNFTs.length, icon: Clock },
    { id: 'sold' as const, label: 'Sold', count: soldNFTs.length, icon: CheckCircle },
    { id: 'ended' as const, label: 'Ended', count: endedNFTs.length, icon: XCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">My Listed Items</h1>
              <p className="text-gray-600">Manage your NFT listings</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Total Listed</p>
              <p className="text-3xl font-bold text-gray-900">{myNFTs.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Active Listings</p>
              <p className="text-3xl font-bold text-gray-900">{activeNFTs.length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Total Sold</p>
              <p className="text-3xl font-bold text-gray-900">{soldNFTs.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-sm font-bold ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* NFT Grid */}
        {currentNFTs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {activeTab} items
            </h3>
            <p className="text-gray-600">
              {activeTab === 'active' 
                ? "You don't have any active listings yet"
                : activeTab === 'sold'
                ? "You haven't sold any NFTs yet"
                : "No ended auctions"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentNFTs.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <NFTCard nft={nft} />
                
                {/* Action Buttons */}
                {activeTab === 'active' && (
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={() => handleCancelListing(nft.id)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all"
                    >
                      Cancel Listing
                    </button>
                  </div>
                )}

                {/* Status Badge */}
                {activeTab === 'sold' && (
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold shadow-lg">
                    ✓ Sold
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default MyListedItemsPage;
