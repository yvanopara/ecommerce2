import express from "express";

import { addFavorite, getFavorites, removeFavorite } from "../controlers/favoritesController.js";
import authUser from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", authUser, addFavorite);
router.post("/remove", authUser, removeFavorite);
router.post("/list", authUser, getFavorites);

export default router;
