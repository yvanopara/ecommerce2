import React, { useContext } from 'react';
import './navBar.css';
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { assets } from '../../assets/assets';
import { ShopContext } from '../../context/shopContext';

export default function NavBar() {
  const { getCartCount, token } = useContext(ShopContext);
  const navigate = useNavigate(); // hook pour naviguer

  const handleProfileClick = (e) => {
    if (!token) {
      e.preventDefault(); // empêche la navigation normale
      navigate('/login');
    }
  };

  return (
    <nav className="bottom-nav">
      <ul>
        <li>
          <NavLink to="/" className="nav-link">
            <FaHome className="icon" />
            <span>Accueil</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/cart" className="nav-link">
            <img className="cart-icon" src={assets.cart_icon} alt='' />
            {getCartCount() > 0 && (
              <p className="cart-count">{getCartCount()}</p>
            )}
            <span>Panier</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/profil" className="nav-link" onClick={handleProfileClick}>
            <img className="profile-icon" src={assets.profile_icon} alt="" />
            <span>Profil</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
