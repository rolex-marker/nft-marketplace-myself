// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {

    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public itemCount; 

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;

         // 🔥 Auction fields
        bool isAuction;
        uint endTime;
        address highestBidder;
        uint highestBid;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );
    event Cancelled(
        uint itemId,
        address indexed nft,
        uint tokenId,
        address indexed seller
    );
    event AuctionBid(
    uint indexed itemId,
    address indexed bidder,
    uint amount
    );

    constructor(address _feeAccount, uint _feePercent) {
    require(_feeAccount != address(0), "Invalid fee account");
    feeAccount = payable(_feeAccount);
    feePercent = _feePercent;
}


    // Make item to offer on the marketplace
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        itemCount ++;
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false,
            false,
            block.timestamp,
            address(0),
            0
        );
        // emit Offered event
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");
        // pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    function cancelItem(uint _itemId) external nonReentrant {
        Item storage item = items[_itemId];

        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(item.seller == msg.sender, "not item seller");
        require(!item.sold, "item already sold or cancelled");

        item.sold = true;
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        emit Cancelled(
            _itemId,
            address(item.nft),
            item.tokenId,
            msg.sender
        );
    }

    function makeAuctionItem(
        IERC721 _nft,
        uint _tokenId,
        uint _startPrice,
        uint _duration
            ) external nonReentrant {
            require(_startPrice > 0, "Price must be > 0");
            require(_duration > 0, "Duration must be > 0");

            itemCount++;

            _nft.transferFrom(msg.sender, address(this), _tokenId);

            items[itemCount] = Item(
                itemCount,
                _nft,
                _tokenId,
                _startPrice,
                payable(msg.sender),
                false,
                true,
                block.timestamp + _duration,
                address(0),
                0
            );

            emit Offered(
                itemCount,
                address(_nft),
                _tokenId,
                _startPrice,
                msg.sender
            );
    }

    function placeBid(uint _itemId) external payable nonReentrant {
        Item storage item = items[_itemId];

        require(item.isAuction, "Not auction item");
        require(block.timestamp < item.endTime, "Auction ended");
        require(msg.value > item.highestBid, "Bid too low");
        require(!item.sold, "Already finalized");

        // Refund previous bidder
        if (item.highestBidder != address(0)) {
            payable(item.highestBidder).transfer(item.highestBid);
        }

        item.highestBidder = msg.sender;
        item.highestBid = msg.value;

         // ✅ EMIT EVENT
        emit AuctionBid(_itemId, msg.sender, msg.value);
    }

    function finalizeAuction(uint _itemId) external nonReentrant {
        Item storage item = items[_itemId];

        require(item.isAuction, "Not auction item");
        require(block.timestamp >= item.endTime, "Auction not ended");
        require(!item.sold, "Already finalized");

        item.sold = true;

        if (item.highestBidder != address(0)) {
            uint fee = (item.highestBid * feePercent) / 100;

            item.seller.transfer(item.highestBid - fee);
            feeAccount.transfer(fee);

            item.nft.transferFrom(
                address(this),
                item.highestBidder,
                item.tokenId
            );
        } else {
            // No bids → return NFT
            item.nft.transferFrom(
                address(this),
                item.seller,
                item.tokenId
            );
        }
    }




    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent))/100);
    }
}
