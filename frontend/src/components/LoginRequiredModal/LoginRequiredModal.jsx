// LoginRequiredModal.jsx - Version améliorée
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginRequiredModal.css";

export default function LoginRequiredModal({ onClose }) {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <div className="login-modal-overlay" onClick={onClose}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                <div className="login-modal-icon">
                    <span>🔒</span>
                </div>

                <h2>Connexion requise</h2>

                <p>
                    Pour accéder à votre panier et finaliser votre commande vous devez d'abord créer un compte ou vous connecter.
                </p>

                <div className="login-modal-buttons">
                    <button className="login-btn" onClick={handleLogin}>
                        Se connecter
                    </button>

                    <button className="cancel-btn" onClick={onClose}>
                        Continuer sans connexion
                    </button>
                </div>
            </div>
        </div>
    );
}