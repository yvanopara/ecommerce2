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

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(backendUrl+"/api/video");
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

  const handleVideoToggle = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="video-page">
      <div className="hero-section">
        <div className="intro-video-container">
          <h1 className="intro-title">Découvrez nos tutoriels vidéo</h1>
          <p className="intro-subtitle">Apprenez à utiliser nos site comme des experts</p>
          
          <div className="video-wrapper">
            <video 
              src={mainVideo} 
              controls 
              className="intro-video"
              onClick={handleVideoToggle}
            />
            <div className="video-overlay" style={{ display: isPlaying ? 'none' : 'flex' }}>
              <button className="play-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                </svg>
              </button>
            </div>
          </div>
          
          <button
            className="switch-lang-btn"
            onClick={() =>
              setMainVideo(mainVideo === frenchVideoUrl ? englishVideoUrl : frenchVideoUrl)
            }
          >
            {mainVideo === frenchVideoUrl ? "English Version" : "Version Française"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="lang-icon">
              <path d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="tutorials-section">
        <div className="section-header">
          <h2 className="section-title">Tutoriels produits</h2>
          <p className="section-description">Parcourez notre bibliothèque de guides pratiques</p>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Chargement des tutoriels...</p>
          </div>
        ) : (
          <>
            <div className="video-grid">
              {videos.slice(0, visibleCount).map((video) => (
                <div key={video._id} className="video-card">
                  <div className="video-thumbnail">
                    <video src={video.url} controls className="video-player" />
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{video.title || "Tutoriel produit"}</h3>
                    {video.duration && <span className="video-duration">{video.duration}</span>}
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < videos.length && (
              <button className="see-more-btn" onClick={handleSeeMore}>
                Voir plus de vidéos
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
                  <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}