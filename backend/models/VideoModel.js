import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  url: { type: String, required: true },           // URL Cloudinary
  public_id: { type: String, required: true },     // ID Cloudinary pour suppression
  title: { type: String, required: true },         // Titre de la vidéo
  redirectUrl: { type: String, required: true },   // Lien de redirection externe
  createdAt: { type: Date, default: Date.now },    // Date d'upload
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
