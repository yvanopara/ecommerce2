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



const app = express();
const port = process.env.PORT || 5000;

// Connexions DB
connectDB();
connectCloudinary();

// Middlewares
const allowedOrigins = [
  'https://frontendv-wnur.onrender.com',
  'http://localhost:3000',
  'https://admin2-1hs9.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // autorise les outils comme Postman (origin peut être undefined)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api/product', productRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);


// Health Check
app.get('/ping', (req, res) => res.send('pong'));

// Configuration pour la production

  // Route de test en développement
  app.get('/', (req, res) => {
    res.send('API IS WORKING (Development Mode)');
  });


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