import React, { useContext } from 'react';
import './navBar.css';
import { NavLink, useNavigate } from "react-router-dom";

import { FaHome } from "react-icons/fa";
import { Home, LayoutDashboard, Landmark, MapPin } from "lucide-react";
import { assets } from '../../assets/assets';
import { ShopContext } from '../../context/shopContext';

export default function NavBar() {
  const { getCartCount, token } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleProfileClick = (e) => {
    if (!token) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <nav className="bottom-nav">
      <ul>
        <li>
          <NavLink 
            to="/" 
            className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
          >
            <Home className="icon" />
            <span>Accueil</span>
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/cart" 
            className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
          >
            <div className="icon-container">
              <img className="cart-icon" src={assets.cart_icon} alt='' />
              {getCartCount() > 0 && (
                <p className="cart-count">{getCartCount()}</p>
              )}
            </div>
            <span>Panier</span>
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/profil" 
            className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
            onClick={handleProfileClick}
          >
            <img className="profile-icon" src={assets.profile_icon} alt="" />
            <span>Profil</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}