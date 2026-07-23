// Profil.jsx - Version restructurée avec SVG icons et design professionnel
import React, { useContext, useEffect, useState } from 'react';
import './profil.css';
import { ShopContext } from '../../context/shopContext';
import axios from 'axios';
import { 
  FaUserCircle, 
  FaCheckCircle,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaEdit,
  FaCamera,
  FaSignOutAlt,
  FaArrowRight
} from 'react-icons/fa';
import { toast } from 'react-toastify';

// SVG Icons personnalisés
const SvgIcons = {
  Orders: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  Favorites: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  ),
  Support: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      <path d="M8 10h.01M12 10h.01M16 10h.01"/>
    </svg>
  ),
  Shop: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  About: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

export default function Profil() {
  const { backendUrl, token, setToken } = useContext(ShopContext);
  const [userData, setUserData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    profileImage: '',
    createdAt: '',
    favorites: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // ------------------------------
  // Charge les informations de l'utilisateur
  // ------------------------------
  const loadUserData = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token },
      });

      if (response.data.success) {
        const user = response.data.user;
        setUserData({
          name: user.name || 'Utilisateur',
          email: user.email || 'Email inconnu',
          phone: user.phone || 'Non renseigné',
          profileImage: user.profileImage || '',
          createdAt: user.createdAt || user.updatedAt || new Date().toISOString(),
          favorites: user.favorites || []
        });
        setEditName(user.name || '');
        setEditPhone(user.phone || '');
        if (user.profileImage) {
          setPreviewImage(user.profileImage);
        }
      }
    } catch (error) {
      console.error("Erreur récupération profil :", error);
      toast.error("Erreur lors du chargement du profil");
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------
  // Mise à jour du profil
  // ------------------------------
  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editName);
      formData.append('phone', editPhone);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          headers: { 
            token,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      if (response.data.success) {
        const updatedUser = response.data.user;
        setUserData(prev => ({
          ...prev,
          name: updatedUser.name || prev.name,
          phone: updatedUser.phone || prev.phone,
          profileImage: updatedUser.profileImage || prev.profileImage
        }));
        if (updatedUser.profileImage) {
          setPreviewImage(updatedUser.profileImage);
        }
        setIsEditing(false);
        toast.success('✅ Profil mis à jour avec succès !');
      } else {
        toast.error(response.data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error("Erreur mise à jour :", error);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  // ------------------------------
  // Gestion de l'image de profil
  // ------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ------------------------------
  // Déconnexion
  // ------------------------------
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    toast.info('👋 À bientôt !');
    window.location.href = '/';
  };

  // ------------------------------
  // Envoie un message au backend
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
  // Formatage de la date
  // ------------------------------
  const formatDate = (dateString) => {
    if (!dateString) return 'Membre récent';
    try {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return `Membre depuis ${date.toLocaleDateString('fr-FR', options)}`;
    } catch {
      return 'Membre récent';
    }
  };

  // Nombre de favoris
  const favoritesCount = userData.favorites?.length || 0;

  // ------------------------------
  // Actions du profil - Nouvelle structure
  // ------------------------------
  const menuActions = [
    {
      id: 'orders',
      label: 'Mes Commandes',
      description: 'Suivez vos achats',
      icon: SvgIcons.Orders,
      action: () => window.location.href = '/orders',
      color: '#4f46e5',
      gradient: 'linear-gradient(135deg, #4f46e5, #6366f1)'
    },
    {
      id: 'favorites',
      label: 'Mes Favoris',
      description: `${favoritesCount} article${favoritesCount > 1 ? 's' : ''} enregistré${favoritesCount > 1 ? 's' : ''}`,
      icon: SvgIcons.Favorites,
      action: () => window.location.href = '/favorites',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
      badge: favoritesCount
    },
    {
      id: 'support',
      label: 'Support Client',
      description: 'Aide et assistance',
      icon: SvgIcons.Support,
      action: () => window.open(
        `https://wa.me/237693800251?text=${encodeURIComponent(
          "Bonjour, j'ai besoin d'aide pour mon compte."
        )}`,
        "_blank"
      ),
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)'
    },
    {
      id: 'shop',
      label: 'Ma Boutique',
      description: 'Gérez vos produits',
      icon: SvgIcons.Shop,
      action: () => window.location.href = '/shop',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
    },
    {
      id: 'about',
      label: 'À propos',
      description: 'Informations générales',
      icon: SvgIcons.About,
      action: () => window.location.href = '/about',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)'
    },
    {
      id: 'logout',
      label: 'Déconnexion',
      description: 'Quitter votre compte',
      icon: SvgIcons.Logout,
      action: handleLogout,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
      isDanger: true
    }
  ];

  if (isLoading) {
    return (
      <div className="profil-page">
        <div className="profil-container">
          <div className="profil-loading">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profil-page">
      <div className="profil-container">
        {/* Header Profil avec image et informations */}
        <div className="profil-header">
          <div className="profil-avatar-wrapper">
            <div className="profil-avatar">
              {previewImage ? (
                <img src={previewImage} alt="Profil" className="profil-avatar-img" />
              ) : (
                <FaUserCircle className="profil-icon" />
              )}
              <div className="profil-status-badge">
                <FaCheckCircle className="profil-status" title="Connecté" />
              </div>
              {isEditing && (
                <label className="profil-avatar-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="profil-avatar-input"
                  />
                  <FaCamera className="upload-icon" />
                </label>
              )}
            </div>
          </div>

          <div className="profil-info">
            {isEditing ? (
              <div className="profil-edit-form">
                <div className="edit-field">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nom complet"
                    className="edit-input"
                    required
                  />
                </div>
                <div className="edit-field">
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Téléphone"
                    className="edit-input"
                  />
                </div>
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleUpdateProfile}>
                    <FaCheckCircle /> Enregistrer
                  </button>
                  <button className="cancel-btn" onClick={() => {
                    setIsEditing(false);
                    setEditName(userData.name);
                    setEditPhone(userData.phone);
                    setProfileImage(null);
                    setPreviewImage(userData.profileImage || null);
                  }}>
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="profil-name-container">
                  <h2>{userData.name}</h2>
                  <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                    <FaEdit /> Modifier
                  </button>
                </div>
                <div className="profil-details">
                  <div className="detail-item">
                    <FaEnvelope className="detail-icon" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="detail-item">
                    <FaPhone className="detail-icon" />
                    <span>{userData.phone}</span>
                  </div>
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <span>{formatDate(userData.createdAt)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Statistiques utilisateur */}
        <div className="profil-stats">
          <div className="stat-item">
            <div className="stat-number">0</div>
            <div className="stat-label">Commandes</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">{favoritesCount}</div>
            <div className="stat-label">Favoris</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">⭐</div>
            <div className="stat-label">Membre</div>
          </div>
        </div>

        {/* Menu Actions - Nouveau design professionnel */}
        <div className="profil-menu">
          <h3 className="profil-menu-title">Navigation</h3>
          <div className="profil-menu-grid">
            {menuActions.map((item) => (
              <div
                key={item.id}
                className={`profil-menu-item ${item.isDanger ? 'danger' : ''}`}
                onClick={item.action}
              >
                <div className="menu-item-icon" style={{ color: item.color }}>
                  <item.icon />
                </div>
                <div className="menu-item-content">
                  <h4 className="menu-item-label">{item.label}</h4>
                  <p className="menu-item-description">{item.description}</p>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="menu-item-badge" style={{ background: item.gradient }}>
                    {item.badge}
                  </span>
                )}
                <div className="menu-item-arrow" style={{ color: item.color }}>
                  <FaArrowRight />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="profil-footer">
          <p className="footer-text">
            <span className="footer-dot"></span>
            Votre espace personnel
          </p>
          <p className="footer-version">Version 2.0</p>
        </div>
      </div>
    </div>
  );
}