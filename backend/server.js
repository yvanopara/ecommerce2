import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import favoriteRoutes from './routes/favoriteRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

// App configuration
const app = express();
const port = process.env.PORT || 5000; // Use PORT from .env or default to 5000

// Connect to the database pour testé mon serveurr
connectDB();
connectCloudinary();

// Middleware
app.use(express.json()); // Parse incoming requests with JSON payloadstytytytrrtrttyt dfdf
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data


const allowedOrigins = [
  'http://localhost:3000',
  'https://ecommerce2-production-a5f7.up.railway.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));



// API endpoints
app.use('/api/product', productRouter);
// app.use("/images", express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
 app.use('/api/order', orderRouter);
 app.use('/api/favorites', favoriteRoutes);
// app.use('/api/twilio', twilioRouter);

// Default route
app.get('/', (req, res) => {
    res.send('API IS WORKING');
});


// Ces lignes sont nécessaires avec ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir les fichiers React buildés (frontend/build)
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Pour toutes les routes non reconnues (React gère le reste)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});


// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on http://localhost:${port}`);
});app.get("/ping", (req, res) => {
  res.send("pong");
});

