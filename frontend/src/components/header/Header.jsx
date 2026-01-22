

import React, { useEffect, useState } from 'react';
import './header.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import verify from '../../assets/verify.png'
import coin from '../../assets/coin.png'
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [topSellers, setTopSellers] = useState([]);

  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/profile/top-sellers");
        setTopSellers(res.data);
      } catch (err) {
        console.error("Failed to fetch top sellers:", err);
      }
    };
    fetchTopSellers();
  }, []);

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide:true,
    responsive: [
      { breakpoint: 1160, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 950, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 750, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 550, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 470, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 400, settings: { slidesToShow: 2, slidesToScroll: 1, variableWidth: true } }
    ]
  };

  return (
    <div className='header section__padding'>
      <div className="header-content">
        <div>
          <h1>Discover, collect, and sell extraordinary NFTs</h1>
          <img className='shake-vertical' src={coin} alt="" />
        </div>
      </div>

      <div className="header-slider">
        <h1>Top Sellers</h1>
        <Slider {...settings} className='slider'>
          {topSellers.map((seller, idx) => (
            <div key={seller._id} className='slider-card'>
              <p className='slider-card-number'>{idx + 1}</p>
              <div className="slider-img">
                <img src={seller.avatar} alt={seller.username} />
                <img src={verify} className='verify' alt="verified" />
              </div>
              <Link to={`/profile/${seller.username}`}>
                <p className='slider-card-name'>{seller.username}</p>
              </Link>
              <p className='slider-card-price'>{(seller.totalSpent + seller.totalBought).toString().slice(0, 5)  || 0} <span>ETH</span></p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Header;

