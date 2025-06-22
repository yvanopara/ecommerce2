import express from 'express';
import { addToFavorites, getFavorites, removeFromFavorites } from '../controlers/favoriteController.js';

const favoriteRoutes = express.Router();

favoriteRoutes.post('/:userId/:productId', addToFavorites);
favoriteRoutes.delete('/:userId/:productId', removeFromFavorites);
favoriteRoutes.get('/:userId', getFavorites);

export default favoriteRoutes;
