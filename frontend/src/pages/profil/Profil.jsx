import React, { useContext, useEffect, useState } from 'react';
import './profil.css';
import { ShopContext } from '../../context/shopContext';
import axios from 'axios';
import { 
  FaBoxOpen, 
  FaHeart, 
  FaHeadset, 
  FaUserCircle, 
  FaCheckCircle,
  FaInfoCircle,
  FaArrowRight,
  FaSignOutAlt
} from 'react-icons/fa';

export default function Profil() {
  const { backendUrl, token, setToken } = useContext(ShopContext);
  const [userData, setUserData] = useState({ name: '', email: '' });

  // ------------------------------
  // Charge les informations de l'utilisateur
  // ------------------------------
  const loadUserData = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token },
      });

      if (response.data.success) {
        setUserData({
          name: response.data.user.name,
          email: response.data.user.email,
        });
      }
    } catch (error) {
      console.error("Erreur récupération profil :", error);
    }
  };

  // ------------------------------
  // Déconnexion
  // ------------------------------
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  // ------------------------------
// Envoie un message au backendE
  // ------------------------------
  const notifyVisit = async () => {
    let message = "Un visiteur inconnu est sur la page Profil.";

    if (token) {
      try {
        const response = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { token },
        });
        if (response.data.success) {
          const user = response.data.user;
          message = `L'utilisateur *${user.name} (${user.email})* est en train de visiter la page Profil.`;
        }
      } catch (error) {
        console.error("Erreur récupération profil pour notification :", error);
      }
    }

    try {
      await axios.post("http://localhost:5000/notify", { message }, {
        headers: {
          'Content-Type': 'application/json',
          token: token || '',
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification :", error);
    }
  };

  // ------------------------------
  // useEffect principal
  // ------------------------------
  useEffect(() => {
    loadUserData();
    notifyVisit();
  }, [token, backendUrl]);

  // ------------------------------
  // Cartes du profil
  // ------------------------------
  const cardItems = [
    {
      icon: <FaBoxOpen className="profil-card-icon" />,
      text: "Mes Commandes",
      action: () => window.location.href = '/orders',
      color: "#4f46e5"
    },
    {
      icon: <FaHeart className="profil-card-icon" />,
      text: "Mes Favoris",
      action: () => window.location.href = '/favorites',
      color: "#ec4899"
    },
    {
      icon: <FaHeadset className="profil-card-icon" />,
      text: "Support Client",
      action: () => window.open(
        `https://wa.me/237693800251?text=${encodeURIComponent(
          "Bonjour, j'ai besoin d'aide pour mon compte."
        )}`,
        "_blank"
      ),
      color: "#06b6d4"
    },
    {
      icon: <FaInfoCircle className="profil-card-icon" />,
      text: "À propos",
      action: () => window.location.href = '/about',
      color: "#10b981"
    },
    {
      icon: <FaSignOutAlt className="profil-card-icon" />,
      text: "Déconnexion",
      action: handleLogout,
      color: "#ef4444"
    }
  ];

  return (
    <div className="profil-container">
      {/* Header Profil */}
      <div className="profil-header">
        <div className="profil-avatar">
          <FaUserCircle className="profil-icon" />
          <FaCheckCircle className="profil-status" title="Connecté" />
        </div>

        <div className="profil-info">
          <h2>{userData.name || 'Utilisateur'}</h2>
          <p>{userData.email || 'Email inconnu'}</p>
        </div>
      </div>

      {/* Actions / Cartes */}
      <div className="profil-actions">
        {cardItems.map((item, index) => (
          <div
            key={index}
            className="profil-card"
            onClick={item.action}
            style={{ borderLeft: `4px solid ${item.color}` }}
          >
            <div className="profil-card-content">
              <div className="profil-card-icon-wrapper" style={{ color: item.color }}>
                {item.icon}
              </div>
              <p>{item.text}</p>
            </div>
            <FaArrowRight className="profil-card-arrow" />
          </div>
        ))}
      </div>
    </div>
  );
}
