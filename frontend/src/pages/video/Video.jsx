import React, { useState, useEffect } from "react";
import axios from "axios";
import "./video.css";
import { backendUrl } from "../../App";

export default function VideoPage() {
  const frenchVideoUrl = "https://res.cloudinary.com/.../video/upload/...fr.mp4";
  const englishVideoUrl = "https://res.cloudinary.com/.../video/upload/...en.mp4";

  const [mainVideo, setMainVideo] = useState(frenchVideoUrl);
  const [videos, setVideos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const token = localStorage.getItem("token");

  const formatRedirectUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  // 🔹 Récupération des vidéos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/video`);
        setVideos(response.data);
      } catch (err) {
        console.error("Erreur récupération vidéos :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // 🔹 Notification au backend Render
  useEffect(() => {
    const notifyVisit = async () => {
      let message = "Un visiteur inconnu a visité la page Vidéo.";

      if (token) {
        try {
          const res = await axios.get(`${backendUrl}/api/user/profile`, {
            headers: { token },
          });

          if (res.data.success && res.data.user) {
            const user = res.data.user;
            message = `L'utilisateur *${user.name} (${user.email})* a visité la page Vidéo.`;
          }
        } catch (error) {
          console.error("Erreur profil utilisateur :", error);
        }
      }

      try {
        await axios.post(
          `${backendUrl}/notify`,
          { message },
          {
            headers: {
              "Content-Type": "application/json",
              token: token || "",
            },
          }
        );
        console.log("Notification envoyée :", message);
      } catch (err) {
        console.error("Erreur envoi notification :", err);
      }
    };

    notifyVisit();
  }, [token]);

  const handleSeeMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, videos.length));
  };

  const handleVideoToggle = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="video-page">
      <div className="hero-section">
        <div className="intro-video-container">
          <h1 className="intro-title">Découvrez nos tutoriels vidéo</h1>
          <p className="intro-subtitle">Apprenez à utiliser notre site comme des experts</p>

          <div className="video-wrapper">
            <video
              src={mainVideo}
              controls
              className="intro-video"
              onClick={handleVideoToggle}
            />
            <div className="video-overlay" style={{ display: isPlaying ? "none" : "flex" }}>
              <button className="play-button" type="button">
                ▶
              </button>
            </div>
          </div>

          <button
            className="switch-lang-btn"
            type="button"
            onClick={() =>
              setMainVideo(mainVideo === frenchVideoUrl ? englishVideoUrl : frenchVideoUrl)
            }
          >
            {mainVideo === frenchVideoUrl ? "English Version" : "Version Française"}
          </button>
        </div>
      </div>

      <div className="tutorials-section">
        <div className="section-header">
          <h2 className="section-title">Tutoriels produits</h2>
          <p className="section-description">
            Parcourez notre bibliothèque de guides pratiques
          </p>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Chargement des tutoriels...</p>
          </div>
        ) : (
          <>
            <div className="video-grid">
              {videos.slice(0, visibleCount).map((videoItem) => (
                <div key={videoItem._id} className="video-card">
                  <div className="video-thumbnail">
                    <video src={videoItem.url} controls className="video-player" />
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">
                      {videoItem.title || "Tutoriel produit"}
                    </h3>
                    {videoItem.redirectUrl && (
                      <a
                        href={formatRedirectUrl(videoItem.redirectUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-link"
                      >
                        Voir le produit →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < videos.length && (
              <button className="see-more-btn" type="button" onClick={handleSeeMore}>
                Voir plus de vidéos →
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
