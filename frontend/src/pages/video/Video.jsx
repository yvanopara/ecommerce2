import React, { useState, useEffect } from "react";
import axios from "axios";
import "./video.css";
import { backendUrl } from "../../App";

export default function VideoPage() {
  const [videos, setVideos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/video");
        setVideos(response.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleSeeMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, videos.length));
  };

  return (
    <div className="video-page">
      <div className="hero-section">
        <h1 className="intro-title">Tutoriels Produits</h1>
        <p className="intro-subtitle">
          Découvrez nos guides vidéo pour mieux utiliser nos produits
        </p>
      </div>

      <div className="tutorials-section">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Chargement des vidéos...</p>
          </div>
        ) : (
          <>
            <div className="video-grid">
              {videos.slice(0, visibleCount).map((video) => (
                <div key={video._id} className="video-card">
                  <div className="video-thumbnail">
                    <video 
                      src={video.url} 
                      controls 
                      className="video-player" 
                      poster={video.thumbnailUrl}
                    />
                  </div>
                  <div className="video-info">
                    <h3>{video.title}</h3>
                    {video.duration && (
                      <span className="video-duration">{video.duration}</span>
                    )}
                    {video.redirectUrl && (
                      <a
                        href={video.redirectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="product-link"
                      >
                        <span>Voir le produit</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M10 6H6V18H18V14" stroke="currentColor" strokeWidth="2"/>
                          <path d="M14 4H20V10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M20 4L10 14" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < videos.length && (
              <button className="see-more-btn" onClick={handleSeeMore}>
                Voir plus de tutoriels
                <svg className="arrow-icon" width="18" height="18" viewBox="0 0 24 24">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}