import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';
import { useWallet } from '../WalletContext';
import Toast, { ToastType } from './Toast';

const CreateNFTPage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    saleType: 'fixed' as 'fixed' | 'auction',
    auctionDuration: '7'
  });
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      setToast({ message: 'Please connect your wallet first', type: 'error', visible: true });
      return;
    }

    if (!imagePreview) {
      setToast({ message: 'Please upload an image', type: 'error', visible: true });
      return;
    }

    setUploading(true);

    // Simulate minting process
    setTimeout(() => {
      setUploading(false);
      setToast({ 
        message: 'NFT minted successfully! Redirecting to marketplace...', 
        type: 'success', 
        visible: true 
      });
      
      setTimeout(() => {
        navigate('/marketplace');
      }, 2000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create NFT</h1>
          <p className="text-gray-600">
            Upload your artwork and mint it as an NFT on the blockchain
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Upload File *
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative rounded-2xl border-2 border-dashed transition-all ${
                dragActive
                  ? 'border-purple-600 bg-purple-50'
                  : imagePreview
                  ? 'border-gray-300 bg-white'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              {imagePreview ? (
                <div className="relative aspect-square rounded-2xl overflow-hidden group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold cursor-pointer hover:bg-gray-100 transition-colors">
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-square cursor-pointer p-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Upload className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Drop your file here, or browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    PNG, JPG, GIF up to 100MB
                  </p>
                  <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium">
                    Choose File
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Info Card */}
            <div className="mt-6 p-6 rounded-2xl bg-blue-50 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Tips for best results</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use high-quality images (recommended: 1000x1000px or higher)</li>
                <li>• Supported formats: PNG, JPG, GIF, WebP</li>
                <li>• Make sure your artwork is original</li>
              </ul>
            </div>
          </div>

          {/* Right: Form Section */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter NFT name"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your NFT"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none resize-none"
                />
              </div>

              {/* Sale Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Sale Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, saleType: 'fixed' })}
                    className={`p-4 rounded-xl border-2 font-medium transition-all ${
                      formData.saleType === 'fixed'
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">💰</div>
                    Fixed Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, saleType: 'auction' })}
                    className={`p-4 rounded-xl border-2 font-medium transition-all ${
                      formData.saleType === 'auction'
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">🔨</div>
                    Auction
                  </button>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {formData.saleType === 'fixed' ? 'Price (ETH) *' : 'Starting Bid (ETH) *'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    ETH
                  </span>
                </div>
              </div>

              {/* Auction Duration */}
              {formData.saleType === 'auction' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Auction Duration
                  </label>
                  <select
                    value={formData.auctionDuration}
                    onChange={(e) => setFormData({ ...formData, auctionDuration: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none"
                  >
                    <option value="1">1 Day</option>
                    <option value="3">3 Days</option>
                    <option value="7">7 Days</option>
                    <option value="14">14 Days</option>
                    <option value="30">30 Days</option>
                  </select>
                </div>
              )}

              {/* Preview Card */}
              {imagePreview && formData.name && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Preview</h4>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="aspect-square rounded-lg overflow-hidden mb-3">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-1">{formData.name}</h5>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{formData.description}</p>
                    {formData.price && (
                      <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {formData.price} ETH
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Minting NFT...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    <span>Mint NFT</span>
                  </>
                )}
              </button>

              {/* Gas Fee Notice */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> You will be prompted to confirm the transaction in your wallet. 
                  Gas fees will be calculated at the time of minting.
                </p>
              </div>
            </form>
          </div>
        </div>
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

export default CreateNFTPage;
