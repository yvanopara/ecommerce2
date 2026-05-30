
import React, {useContext} from 'react';

import './navBar.css';

import {NavLink, useNavigate} from "react-router-dom";

import {Home, Play, Headset} from "lucide-react";

import { assets} from '../../assets/assets';

import { ShopContext} from '../../context/shopContext';

export default function NavBar() {

  const {getCartCount,token} = useContext( ShopContext);

  const navigate = useNavigate();



  const handleProfileClick =
    (e) => {

      if (!token) {

        e.preventDefault();

        navigate(
          '/login'
        );
      }
    };



  return (
    <nav className="bottom-nav">

      <ul>

        {/* ACCUEIL */}
        <li>

          <NavLink
            to="/"
            className={({
              isActive
            }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior:
                  'smooth'
              })
            }
          >

            <Home className="icon" />

            <span>
              Accueil
            </span>

          </NavLink>

        </li>



        {/* MESSAGE */}
        <li>

          <NavLink
            to="/assistance"
            className={({
              isActive
            }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior:
                  'smooth'
              })
            }
          >

            <Headset className="icon" />

            <span>
              Assistance
            </span>

          </NavLink>

        </li>



        {/* SHORTS */}
        <li>

          <NavLink
            to="/video"
            className={({
              isActive
            }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >

            <Play className="icon" />

            <span>
              Shorts
            </span>

          </NavLink>

        </li>



        {/* PANIER */}
        <li>

          <NavLink
            to="/cart"
            className={({
              isActive
            }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >

            <div className="icon-container">

              <img
                className="cart-icon"
                src={
                  assets.cart_icon
                }
                alt=""
              />

              {getCartCount() >
                0 && (
                  <p className="cart-count">
                    {
                      getCartCount()
                    }
                  </p>
                )}

            </div>

            <span>
              Panier
            </span>

          </NavLink>

        </li>



        {/* PROFIL */}
        <li>

          <NavLink
            to="/profil"
            className={({
              isActive
            }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
            onClick={
              handleProfileClick
            }
          >

            <img
              className="profile-icon"
              src={
                assets.profile_icon
              }
              alt=""
            />

            <span>
              Profil
            </span>

          </NavLink>

        </li>

      </ul>

    </nav>
  );
}

