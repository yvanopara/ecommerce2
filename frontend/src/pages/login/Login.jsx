// Login.jsx - Version améliorée
import React, { useContext, useEffect, useState } from "react";
import "./login.css";
import { ShopContext } from "../../context/shopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [currentState, setCurrentState] = useState("Connection");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // LOGIN / REGISTER
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (currentState.toLowerCase().includes("cree")) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("phone", phone);
        if (profileImage) {
          formData.append("profileImage", profileImage);
        }

        const response = await axios.post(
          `${backendUrl}/api/user/register`,
          formData
        );

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("🎉 Compte créé avec succès !");
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("👋 Bienvenue ! Connexion réussie");
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // GOOGLE LOGIN
  const handleGoogle = async (credentialResponse) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/google`, {
        credential: credentialResponse.credential,
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success("🔑 Connexion Google réussie !");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la connexion Google");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Gestion de l'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isRegister = currentState !== "Connection";

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Header avec illustration */}
          <div className="login-header">
            <div className="login-icon">
              {isRegister ? "📝" : "👋"}
            </div>
            <h1 className="login-heading">{currentState}</h1>
            <p className="login-subtitle">
              {isRegister
                ? "Créez votre compte en quelques secondes"
                : "Heureux de vous revoir !"}
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="login-form">
            {/* Image de profil - uniquement pour l'inscription */}
            {isRegister && (
              <div className="profile-image-container">
                <div className="profile-image-wrapper">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profil"
                      className="profile-image-preview"
                    />
                  ) : (
                    <div className="profile-image-placeholder">
                      <span>📸</span>
                    </div>
                  )}
                  <label className="profile-image-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="profile-image-input"
                    />
                    <span className="upload-icon">✏️</span>
                  </label>
                </div>
                <p className="image-hint">Ajoutez une photo de profil</p>
              </div>
            )}

            {/* Champs du formulaire */}
            <div className="form-fields">
              {isRegister && (
                <>
                  <div className="input-group">
                    <label className="input-label">
                      <span className="label-icon">👤</span>
                      Nom complet
                    </label>
                    <input
                      type="text"
                      className="login-input"
                      placeholder="Votre nom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">
                      <span className="label-icon">📱</span>
                      Téléphone
                    </label>
                    <input
                      type="text"
                      className="login-input"
                      placeholder="06 12 34 56 78 (optionnel)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">📧</span>
                  Email
                </label>
                <input
                  type="email"
                  className="login-input"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">🔒</span>
                  Mot de passe
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-input password-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            </div>

            {/* Lien de bascule connexion/inscription */}
            <div className="login-footer">
              <p className="footer-text">
                {isRegister
                  ? "Vous avez déjà un compte ?"
                  : "Pas encore de compte ?"}
              </p>
              <button
                type="button"
                className="toggle-link"
                onClick={() =>
                  setCurrentState(isRegister ? "Connection" : "Creez un compte")
                }
              >
                {isRegister ? "Connectez-vous" : "Créez un compte"}
              </button>
            </div>

            {/* Bouton principal */}
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  {isRegister ? "✨ Créer mon compte" : "🚀 Se connecter"}
                </>
              )}
            </button>

            {/* Séparateur */}
            <div className="divider">
              <span className="divider-line"></span>
              <span className="divider-text">ou</span>
              <span className="divider-line"></span>
            </div>

            {/* Google Login */}
            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogle}
                onError={() => toast.error("Erreur Google")}
                theme="outline"
                size="large"
                shape="pill"
                text={isRegister ? "signup_with" : "signin_with"}
              />
            </div>
          </form>
        </div>

        {/* Side decoration - seulement sur grand écran */}
        <div className="login-decoration">
          <div className="decoration-content">
            <div className="decoration-icon">🛍️</div>
            <h2>Bienvenue sur notre boutique</h2>
            <p>Découvrez des produits exceptionnels et profitez d'une expérience d'achat unique.</p>
            <div className="decoration-features">
              <div className="feature-item">
                <span>✅</span> Livraison rapide
              </div>
              <div className="feature-item">
                <span>💳</span> Paiement sécurisé
              </div>
              <div className="feature-item">
                <span>🛡️</span> Garantie satisfait
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}