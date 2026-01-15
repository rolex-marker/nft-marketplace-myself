
import React, { useState } from 'react';
import './navbar.css';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../../assets/logo.png';
import { Link } from "react-router-dom";

const Menu = () => (
  <>
    <Link to="/"><p>Explore</p></Link>
    <Link to="/purchasedItem"><p>MY ITEMS</p></Link>
    <Link to="/mylisteditem"><p>MY HISTORY</p></Link>
    <Link to="/create"><p>MINT CREATE</p></Link>
  </>
);

const Navbar = ({ loginWithMetaMask, account }) => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className='navbar'>
      {/* Left side */}
      <div className="navbar-links">
        <div className="navbar-links_logo">
          <img src={logo} alt="logo" />
          <Link to="/">
            <h1>CryptoKet</h1>
          </Link>
        </div>

        <div className="navbar-links_container">
          <input type="text" placeholder='Search Item Here' />
          <Menu />
        </div>
      </div>

      {/* Right side */}
      <div className="navbar-sign">
        {account ? (
          <button type="button" className="primary-btn">
            {account.slice(0, 6)}...{account.slice(-4)}
          </button>
        ) : (
          <button
            onClick={loginWithMetaMask}
            type="button"
            className="secondary-btn"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Mobile menu */}
      <div className="navbar-menu">
        {toggleMenu ? (
          <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
        ) : (
          <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />
        )}

        {toggleMenu && (
          <div className="navbar-menu_container scale-up-center">
            <div className="navbar-menu_container-links">
              <Menu />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;




// import React,{ useState} from 'react'
// import './navbar.css'
// import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
// import logo from '../../assets/logo.png'
// import {  Link } from "react-router-dom";

// const Menu = () => (
//   <>
//      <Link to="/"><p>Explore</p> </Link>
//      <Link to="/purchasedItem"><p>MY ITEMS</p> </Link>
//      <Link to="/mylisteditem"><p>MY HISTORY</p> </Link>
//      <Link to="/create"><p>MINT CREATE</p> </Link>
//   </>
//  )

//  const Navbar = ({ loginWithMetaMask, account }) => {
//   const [toggleMenu,setToggleMenu] = useState(false)
//    const [user,setUser] = useState(false)

//   const handleLogout = () => {
//     setUser(false);
//   }

//   return (
//     <div className='navbar'>
//       <div className="navbar-links">
//         <div className="navbar-links_logo">
//           <img src={logo} alt="logo" />
//           <Link to="/"> 
//             <h1>CryptoKet</h1>
//           </Link>
//         </div>
//         <div className="navbar-links_container">
//           <input type="text" placeholder='Search Item Here' autoFocus={true} />
//          <Menu />
//          {user && <Link to="/"><p onClick={handleLogout}>Logout</p></Link> }
        
//         </div>
//       </div>
//       <div className="navbar-sign">
     

//        {account ? (
//               <>
//                 <Link to="/home"> 
//                 <button type='button' className='primary-btn' > {account.slice(0, 5) + '...' + account.slice(38, 42)}</button>
//                </Link> 
//               </>
//             ): (
//               <> 
//                 <button onClick={loginWithMetaMask} type='button' className='secondary-btn'>Connect Wallet</button>
//               </>
//             )}
       

       
//       </div>
//       <div className="navbar-menu">
//         {toggleMenu ? 
//         <RiCloseLine  color="#fff" size={27} onClick={() => setToggleMenu(false)} /> 
//         : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
//         {toggleMenu && (
//           <div className="navbar-menu_container scale-up-center" >
//             <div className="navbar-menu_container-links">
//              <Menu />
//             </div>
//             <div className="navbar-menu_container-links-sign">
           
//             </div>
//             </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Navbar