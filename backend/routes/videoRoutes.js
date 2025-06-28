import express from "express";
import multer from "multer";
import { uploadVideoController, deleteVideoController, getAllVideosController } from "../controlers/videoController.js";

const routerVideo = express.Router();
const upload = multer({ dest: "uploads/" });

routerVideo.post("/upload", upload.single("video"), uploadVideoController);
routerVideo.delete("/delete/:id", deleteVideoController);
routerVideo.get("/", getAllVideosController);

export default routerVideo;
