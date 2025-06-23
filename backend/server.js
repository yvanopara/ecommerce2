import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import favoriteRoutes from './routes/favoriteRoutes.js';

// Solution pour __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Connexions DB
connectDB();
connectCloudinary();

// Middlewares
app.use(cors({
  origin: 'https://frontendv-wnur.onrender.com',
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api/product', productRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/favorites', favoriteRoutes);

// Health Check
app.get('/ping', (req, res) => res.send('pong'));

// Configuration pour la production
if (process.env.NODE_ENV === 'production') {
  // Servir les fichiers statiques de React
  app.use(express.static(path.join(__dirname, 'build')));
  
  // Rediriger toutes les requêtes vers index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
} else {
  // Route de test en développement
  app.get('/', (req, res) => {
    res.send('API IS WORKING (Development Mode)');
  });
}

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Démarrer le serveur
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Listening on http://localhost:${port}`);
});