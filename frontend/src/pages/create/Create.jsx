import { useState } from 'react'
import { ethers } from "ethers"
import axios from 'axios' // make HTTP requests to Pinata

import './create.css'
import Image from '../../assets/Image.png'

// const PINATA_API_KEY = process.env.REACT_APP_PINATA_KEY
// const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET
const PINATA_API_KEY = 'ad6c656a7f0cc603a4ef';
const PINATA_SECRET_API_KEY = 'd6cd229b6cfa3e565146eeebc37bb3c14375176dd128e7f5c05ebdc830c637f8';



const Create = ({ marketplace, nft }) => {

const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Upload image to Pinata
  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
           maxBodyLength: Infinity,
            timeout: 120000, // ⬅️ 2 minutes
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY
          }
        }
      )

      const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
      console.log("IPFS URL:", url)
      setImage(url)

    } catch (error) {
      console.log("ipfs image upload error:", error)
    }
  }

  // Upload metadata to Pinata
  const createNFT = async () => {

    if (isSubmitting) return

     setIsSubmitting(true)

     try {
    if (!image || !price || !name || !description) return

    try {
      const metadata = {
        name,
        description,
        image,
        price
      }

      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        metadata,
        {
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY
          }
        }
      )

      const uri = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
      await mintThenList(uri)
    alert("NFT created successfully 🎉")

    } catch (error) {
      console.log("ipfs metadata upload error:", error)
    }  } catch (err) {
    console.error(err)
  } finally {
    setIsSubmitting(false)
  }
  }

  // Mint NFT and list on marketplace
  const mintThenList = async (uri) => {
    await (await nft.mint(uri)).wait()
    const id = await nft.tokenCount()
    await (await nft.setApprovalForAll(marketplace.address, true)).wait()
    const listingPrice = ethers.utils.parseEther(price.toString())
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }

  return (
    <div className='create section__padding'>
      <div className="create-container">
        <h1>Create new Item</h1>
        <p className='upload-file'>Upload File</p>
        <div className="upload-img-show">
            <h3>JPG, PNG, GIF, SVG, WEBM, MP3, MP4. Max 100mb.</h3>
            <img src={Image} alt="banner" />
            <p>Drag and Drop File</p>
        </div>
        <form className='writeForm' autoComplete='off'>
          
          <div className="formGroup">
            <label>Upload</label>
            <input id="file" name="file" type="file" required onChange={uploadToIPFS} className='custom-file-input'
          />
          </div>
          <div className="formGroup">
            <label>Name</label>
            <input id="name" name="name" type="text" onChange={e => setName(e.target.value)} placeholder='Item Name' autoFocus={true} />
          </div>
          <div className="formGroup">
            <label>Description</label>
            <textarea id="description" name="descripton" type="text" onChange={e => setDescription(e.target.value)} rows={4}
          placeholder='Decription of your item' 
          ></textarea>
          </div>
          <div className="formGroup">
            <label>Price</label>
            <div className="twoForm">
              <input id="price" name="price" type="text" onChange={e => setPrice(e.target.value)} placeholder='Price'  />
              <select>
                <option value="ETH">ETH</option>
                <option value="BTC">BTC</option>
                <option value="LTC">LTC</option>
              </select>
            </div>
          </div>
          <div className="formGroup">
            <label>Category</label>
            <select >
               <option>Art</option>
               <option>Photography</option>
               <option>Sports</option>
               <option>Collectibles</option>
               <option>Trading Cards</option>
               <option>Utility</option>
            </select>
          </div>
          <div className="formGroup">
            <label>Available Items</label>
            <input id="create" name="create" type="text" placeholder='No of Items'/>
                </div>
              <button
              type="button"
              disabled={isSubmitting}
              onClick={createNFT}
              className='writeButton'
            >
              {isSubmitting ? "Processing..." : "Create & List NFT!"}
            </button>
        </form>
      </div>
    </div>
   
  )
};

export default Create;
