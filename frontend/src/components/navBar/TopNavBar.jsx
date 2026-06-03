import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './topNavBar.css';
import { ShopContext } from '../../context/shopContext';
import Sidebar from '../SideBar/SideBar';

export default function TopNavBar() {
  const [visible, setVisible] = useState(false);
  const [menu, setMenu] = useState('home');
  const [ouvert, setOuvert] = useState(false);

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext)

  const logOut = () => {
    localStorage.removeItem('token')
    setToken('')
    navigate('/login')
  }


  return (
    <div className='topNavBar'>
      <div className="left-side">
        <button
          className="bouton-toggle"
          style={{
            zIndex: 1001,
            position: 'relative',
            background: 'none',
            border: 'none',
            fontSize: '28px',
            color: 'black',
            cursor: 'pointer',
          }}
          onClick={() => setOuvert(!ouvert)}
        >
          {ouvert ? <FaTimes /> : <FaBars />}
        </button>

        {/* <img onClick={() => navigate('/')} className='logo-image' src={assets.logo} alt='logo' /> */}
        <p onClick={() => navigate('/')} className='logoNamee' ><span className='rotatink-k'>k</span>-MyStore</p>
      </div>

      {ouvert && (
        <div>
          <Sidebar setOuvert={setOuvert} />

        </div>

      )}


      <ul className='navbar-menu'>

        <Link
          to='/'
          onClick={() => setMenu('home')}
          className={menu === 'home' ? 'active' : ''}
        >
          HOME
        </Link>

        <Link
          to='/collection'
          onClick={() => setMenu('collection')}
          className={menu === 'collection' ? 'active' : ''}
        >
          COLLECTIONS
        </Link>

        <Link
          to='/about'
          onClick={() => setMenu('about')}
          className={menu === 'about' ? 'active' : ''}
        >
          ABOUT
        </Link>

        <Link
          to='/contact'
          onClick={() => setMenu('contact')}
          className={menu === 'contact' ? 'active' : ''}
        >
          CONTACT
        </Link>

      </ul>



      <div className='right-div'>
        <img className='search-image' onClick={() => { setShowSearch(true); navigate('/collection') }} src={assets.search_icon} alt='' />
        <div className="profile-component">
          <img onClick={() => token ? null : navigate('/login')} className="profile-icon" src={assets.profile_icon} alt="" />
          {/* Dropdown Menu */}
          {
            token &&
            <div className="dropdown-menu">
              <p onClick={() => navigate('/profil')}>Mon profil</p>
              <hr />
              <p onClick={() => navigate('/orders')}>Mes commandes</p>
              <hr />
              <p onClick={logOut}>Déconnexion</p>
            </div>
          }


        </div>

        <Link className='cart-link' to='/cart'>
          <img className="cart-icon" src={assets.cart_icon} alt='' />
          <p className="cart-count">{getCartCount()}</p>
        </Link>

      </div>
    </div>
  );
}