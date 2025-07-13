import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./video.css";
import { backendUrl } from "../../App";

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/video");
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
    if (!file || !title || !redirectUrl) {
      toast.error("Remplis tous les champs et choisis une vidéo !");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("redirectUrl", redirectUrl);

    setLoading(true);
    try {
      await axios.post(backendUrl + "/api/video/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      setTitle("");
      setRedirectUrl("");
      fetchVideos();
      toast.success("✅ Vidéo ajoutée !");
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload échoué !");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer la vidéo ?")) return;
    try {
      await axios.delete(`${backendUrl}/api/video/delete/${id}`);
      fetchVideos();
      toast.success("✅ Vidéo supprimée !");
    } catch (err) {
      console.error(err);
      toast.error("❌ Suppression échouée !");
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
        <input
          type="text"
          placeholder="Titre de la vidéo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lien du produit"
          value={redirectUrl}
          onChange={(e) => setRedirectUrl(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Upload..." : "Uploader"}
        </button>
      </form>

      <div className="video-list">
        {videos.map((video) => (
          <div key={video._id} className="video-item">
            <video src={video.url} controls className="video-admin" />
            <h4>{video.title}</h4>
            <p>
              <a href={video.redirectUrl} target="_blank" rel="noreferrer">
                {video.redirectUrl}
              </a>
            </p>
            <button onClick={() => handleDelete(video._id)}>Supprimer</button>
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
