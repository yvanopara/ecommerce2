import React from 'react';
import { FaGlobe, FaWhatsapp, FaUsers, FaStore } from 'react-icons/fa';
import './socialMedia.css';

const SocialMedia = () => {
  const handleWhatsAppGroup = () => {
    window.open('https://chat.whatsapp.com/LEUGNedYKEV5HrChEIpR7O?mode=ems_copy_t', '_blank');
  };

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/237693800251', '_blank');
  };

  const handleWebsite = () => {
    window.open('https://k-mystore.com', '_blank');
  };

  return (
    <div className="kmystore-links-container">
      <div className="kmystore-card">
        <div className="kmystore-header">
          <div className="kmystore-logo">
            <FaStore className="kmystore-logo-icon" />
          </div>
          <h1 className="kmystore-title">K-MyStore</h1>
          
        </div>
        
        <div className="kmystore-buttons">
          <button className="kmystore-btn kmystore-btn-primary" onClick={handleWebsite}>
            <div className="kmystore-btn-content">
              <FaGlobe className="kmystore-btn-icon" />
              <div className="kmystore-btn-text">
                <span className="kmystore-btn-title">Visiter Notre Site de Vente</span>
                <span className="kmystore-btn-desc">Découvrez nos produits</span>
              </div>
            </div>
            <div className="kmystore-btn-arrow">→</div>
          </button>

          <button className="kmystore-btn kmystore-btn-success" onClick={handleWhatsAppGroup}>
            <div className="kmystore-btn-content">
              <FaUsers className="kmystore-btn-icon" />
              <div className="kmystore-btn-text">
                <span className="kmystore-btn-title">Rejoindre le Groupe Whatsapp</span>
                <span className="kmystore-btn-desc">Communauté exclusive</span>
              </div>
            </div>
            <div className="kmystore-btn-arrow">→</div>
          </button>

          <button className="kmystore-btn kmystore-btn-whatsapp" onClick={handleWhatsAppContact}>
            <div className="kmystore-btn-content">
              <FaWhatsapp className="kmystore-btn-icon" />
              <div className="kmystore-btn-text">
                <span className="kmystore-btn-title">Contact Direct</span>
                <span className="kmystore-btn-desc">Service client dédié(Réponse Instantanée)</span>
              </div>
            </div>
            <div className="kmystore-btn-arrow">→</div>
          </button>
        </div>

        <div className="kmystore-footer">
          <p className="kmystore-footer-text">💫 Votre satisfaction, notre priorité</p>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;