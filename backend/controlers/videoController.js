import { uploadVideo, deleteVideo } from "../config/cloudinary.js";
import fs from "fs";
import Video from "../models/VideoModel.js";

// ==========================
// Upload vidéo
// ==========================
export const uploadVideoController = async (req, res) => {
  try {
    const file = req.file;
    const { title, redirectUrl } = req.body;

    // Vérifications
    if (!file) return res.status(400).json({ error: "Aucun fichier fourni" });
    if (!title || !redirectUrl) {
      return res.status(400).json({ error: "Titre et lien de redirection requis" });
    }

    // Upload vers Cloudinary
    const result = await uploadVideo(file.path);

    // Supprime fichier local après upload
    fs.unlinkSync(file.path);

    // Sauvegarde en base
    const newVideo = new Video({
      url: result.secure_url,
      public_id: result.public_id,
      title: title,
      redirectUrl: redirectUrl,
    });

    await newVideo.save();

    res.status(200).json({
      message: "Vidéo uploadée avec succès",
      video: newVideo,
    });
  } catch (error) {
    console.error("Erreur uploadVideoController:", error);
    res.status(500).json({ error: "Erreur lors de l'upload de la vidéo" });
  }
};

// ==========================
// Supprimer vidéo
// ==========================
export const deleteVideoController = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ error: "Vidéo non trouvée" });
    }

    // Supprimer sur Cloudinary
    const result = await deleteVideo(video.public_id);
    if (result.result !== "ok") {
      return res.status(400).json({ error: "Erreur lors de la suppression sur Cloudinary" });
    }

    // Supprimer de la base
    await Video.findByIdAndDelete(id);

    res.status(200).json({ message: "Vidéo supprimée avec succès" });
  } catch (error) {
    console.error("Erreur deleteVideoController:", error);
    res.status(500).json({ error: "Erreur lors de la suppression de la vidéo" });
  }
};

// ==========================
// Récupérer toutes les vidéos
// ==========================
export const getAllVideosController = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Erreur getAllVideosController:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des vidéos" });
  }
};
