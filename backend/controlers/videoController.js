
import { uploadVideo, deleteVideo } from "../config/cloudinary.js";
import fs from "fs";
import Video from "../models/VideoModel.js";

export const uploadVideoController = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Aucun fichier fourni" });

    const result = await uploadVideo(file.path);
    fs.unlinkSync(file.path); // supprime fichier local

    // Sauvegarde en base
    const newVideo = new Video({
      url: result.secure_url,
      public_id: result.public_id,
    });

    await newVideo.save();

    res.status(200).json({
      message: "Vidéo uploadée avec succès",
      video: newVideo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'upload de la vidéo" });
  }
};

export const deleteVideoController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID reçu pour suppression:", id);

    const video = await Video.findById(id);
    if (!video) {
      console.log("Vidéo non trouvée pour ID:", id);
      return res.status(404).json({ error: "Vidéo non trouvée" });
    }

    console.log("Suppression Cloudinary pour:", video.public_id);
    const result = await deleteVideo(video.public_id);
    console.log("Résultat suppression Cloudinary:", result);

    if (result.result !== "ok") {
      return res.status(400).json({ error: "Erreur lors de la suppression sur Cloudinary" });
    }

    await Video.findByIdAndDelete(id);
    console.log("Vidéo supprimée de la base:", id);

    res.status(200).json({ message: "Vidéo supprimée avec succès" });
  } catch (error) {
    console.error("Erreur dans deleteVideoController:", error);
    res.status(500).json({ error: "Erreur lors de la suppression de la vidéo", details: error.message });
  }
};

export const getAllVideosController = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 }); // les plus récentes d'abord
    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des vidéos" });
  }
};
