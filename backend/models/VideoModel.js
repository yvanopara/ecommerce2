import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  url: { type: String, required: true },           // URL publique Cloudinary
  public_id: { type: String, required: true },     // ID Cloudinary pour suppression
  createdAt: { type: Date, default: Date.now },    // Date d'upload
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
