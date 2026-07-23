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

        {/* ===== LOGO AVEC BRILLANT ===== */}
        <div 
          className="logo-wrapper" 
          onClick={() => navigate('/')}
          role="button"
          aria-label="Accueil"
        >
          <div className="logo-container">
            <img 
              className="logo-image" 
              src={assets.logo} 
              alt="logo" 
            />
            {/* Effet de brillant visible sur le logo */}
            <div className="logo-shine"></div>
            <div className="logo-shine-2"></div>
          </div>
        </div>
        {/* ===== FIN LOGO AVEC BRILLANT ===== */}
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
        <img 
          className='search-image' 
          onClick={() => { setShowSearch(true); navigate('/collection') }} 
          src={assets.search_icon} 
          alt='Rechercher' 
        />
        <div className="profile-component">
          <img 
            onClick={() => token ? null : navigate('/login')} 
            className="profile-icon" 
            src={assets.profile_icon} 
            alt="Profil" 
          />
          {token && (
            <div className="dropdown-menu">
              <p onClick={() => navigate('/profil')}>Mon profil</p>
              <hr />
              <p onClick={() => navigate('/orders')}>Mes commandes</p>
              <hr />
              <p onClick={logOut}>Déconnexion</p>
            </div>
          )}
        </div>

        <Link className='cart-link' to='/cart'>
          <img className="cart-icon" src={assets.cart_icon} alt='Panier' />
          <p className="cart-count">{getCartCount()}</p>
        </Link>
      </div>
    </div>
  );
}