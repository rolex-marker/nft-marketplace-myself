import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, ShoppingBag, Tag, TrendingUp, Copy, ExternalLink } from 'lucide-react';
import NFTCard from './NFTCard';
import { mockNFTs, mockUser, shortenAddress } from '../mockData';
import { useWallet } from '../WalletContext';
import Toast, { ToastType } from './Toast';

const ProfilePage: React.FC = () => {
  const { address, isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<'created' | 'listed' | 'purchased' | 'offers'>('created');
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
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to view your profile</p>
        </div>
      </div>
    );
  }

  const createdNFTs = mockNFTs.filter((nft) => nft.creator === address);
  const listedNFTs = mockNFTs.filter((nft) => nft.owner === address && nft.status === 'active');
  const purchasedNFTs = mockNFTs.filter((nft) => nft.owner === address && nft.creator !== address);

  const getCurrentNFTs = () => {
    switch (activeTab) {
      case 'created':
        return createdNFTs;
      case 'listed':
        return listedNFTs;
      case 'purchased':
        return purchasedNFTs;
      case 'offers':
        return [];
      default:
        return createdNFTs;
    }
  };

  const currentNFTs = getCurrentNFTs();

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setToast({ message: 'Address copied to clipboard!', type: 'success', visible: true });
    }
  };

  const tabs = [
    { id: 'created' as const, label: 'Created', count: createdNFTs.length, icon: Sparkles },
    { id: 'listed' as const, label: 'Listed', count: listedNFTs.length, icon: ShoppingBag },
    { id: 'purchased' as const, label: 'Purchased', count: purchasedNFTs.length, icon: Tag },
    { id: 'offers' as const, label: 'Offers Made', count: 0, icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-white shadow-2xl overflow-hidden border-4 border-white/20">
                {mockUser.avatar ? (
                  <img 
                    src={mockUser.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-green-500 border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {shortenAddress(address!)}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <button
                    onClick={handleCopyAddress}
                    className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                  >
                    <Copy className="w-4 h-4 text-white" />
                  </button>
                  <a
                    href={`https://etherscan.io/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>
              {mockUser.bio && (
                <p className="text-lg text-white/90 max-w-2xl mb-6">
                  {mockUser.bio}
                </p>
              )}
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold text-white">{mockUser.nftsCreated}</p>
                  <p className="text-sm text-white/80">NFTs Created</p>
                </div>
                <div className="w-px bg-white/20" />
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold text-white">{mockUser.nftsSold}</p>
                  <p className="text-sm text-white/80">NFTs Sold</p>
                </div>
                <div className="w-px bg-white/20" />
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold text-white">{mockUser.totalEarned} ETH</p>
                  <p className="text-sm text-white/80">Total Earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl p-2 border border-gray-200 mb-8 inline-flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50'
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

        {/* Content */}
        {activeTab === 'offers' ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Tag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Offers Yet</h3>
            <p className="text-gray-600">You haven't made any offers on NFTs</p>
          </div>
        ) : currentNFTs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No NFTs in this category
            </h3>
            <p className="text-gray-600">
              {activeTab === 'created' && "You haven't created any NFTs yet"}
              {activeTab === 'listed' && "You don't have any active listings"}
              {activeTab === 'purchased' && "You haven't purchased any NFTs yet"}
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
              >
                <NFTCard nft={nft} />
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

export default ProfilePage;
