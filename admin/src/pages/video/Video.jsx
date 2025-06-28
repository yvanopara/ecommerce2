import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./video.css";
import { backendUrl } from "../../App";

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(backendUrl+"/api/video");
      setVideos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Sélectionne un fichier vidéo !");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    setLoading(true);
    try {
      await axios.post(backendUrl+"/api/video/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      fetchVideos();
      toast.success("✅ Vidéo ajoutée avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur lors de l'upload !");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;

    try {
      await axios.delete(`${backendUrl}/api/video/delete/${id}`);
      fetchVideos();
      toast.success("✅ Vidéo supprimée avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur lors de la suppression !");
    }
  };

  return (
    <div className="admin-videos">
      <h2>Gestion des vidéos</h2>

      <form onSubmit={handleUpload} className="upload-form">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Upload..." : "Uploader une vidéo"}
        </button>
      </form>

      <div className="video-list">
        {videos.map((video) => (
          <div key={video._id} className="video-item">
            <video src={video.url} controls className="video-admin" />
            <button onClick={() => handleDelete(video._id)}>Supprimer</button>
          </div>
        ))}
      </div>

      {/* === Container Toastify === */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
