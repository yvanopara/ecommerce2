import React, { useState } from 'react';
import './productTabs.css';

export default function ProductTabs({ product }) {

    const [activeTab, setActiveTab] = useState('description');

    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'details', label: 'Détails' },
        { id: 'utilisation', label: 'Utilisation' },
        { id: 'avis', label: 'Avis' }
    ];

    const getContent = () => {
        switch(activeTab) {
            case 'description':
                return product.description || "Aucune description disponible pour ce produit.";
            case 'details':
                return product.details || "Aucun détail technique disponible pour ce produit.";
            case 'utilisation':
                return product.utilisation || "Aucune information d'utilisation disponible pour le moment.";
            case 'avis':
                return null;
            default:
                return "";
        }
    };

    const renderContent = () => {
        if (activeTab === 'avis') {
            return (
                <div className="reviews-placeholder">
                    <div className="reviews-icon">✨</div>
                    <div className="reviews-title">Aucun avis pour le moment</div>
                    <div className="reviews-subtitle">
                        Soyez le premier à partager votre expérience<br />
                        avec ce produit
                    </div>
                </div>
            );
        }

        const content = getContent();
        return (
            <div className="product-text">
                {content.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                        <p key={index}>{paragraph}</p>
                    )
                ))}
            </div>
        );
    };

    return (
        <div className="product-tabs">
            <div className="tabs-header">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {renderContent()}
            </div>
        </div>
    );
}