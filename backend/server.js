import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';

import { connectDB } from './config/db.js';
import connectCloudinary from './config/cloudinary.js';

// Routes importées
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import routerVideo from './routes/videoRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import twilioRouter from './routes/twilioRoute.js';
import notifyRoute from './routes/notifyRoute.js';
import adminRouter from './routes/adminRoute.js';
import messageRouter from './routes/messageRoute.js';

const app = express();
const port = process.env.PORT || 5000;

// serveur HTTP pour socket.io
const server = http.createServer(app);

// SOCKET.IO
export const io = new Server(server, {
  cors: {
    origin: [
      'https://frontendv-wnur.onrender.com',
      'https://backend2-58eq.onrender.com',
      'https://ecommerce2-4jwd.onrender.com',
      'http://localhost:3000',
      'https://admin2-1hs9.onrender.com',
      'http://localhost:5173',
      'https://k-mystore.com'
    ],
    credentials: true
  }
});

// 📦 Connexions DB et services
connectDB();
connectCloudinary();

// 🌍 CORS
const allowedOrigins = [
  'https://frontendv-wnur.onrender.com',
  'https://backend2-58eq.onrender.com',
  'https://ecommerce2-4jwd.onrender.com',
  'http://localhost:3000',
  'https://admin2-1hs9.onrender.com',
  'http://localhost:5173',
  'https://k-mystore.com'
];

app.use(cors({
  origin: function (origin, callback) {

    // autorise postman
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 📑 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==========================
// SOCKET.IO EVENTS
// ==========================

io.on('connection', (socket) => {

  console.log('✅ Socket connecté :', socket.id);

  // rejoindre une room privée user-admin
  socket.on('join_room', (roomId) => {

    socket.join(roomId);

    console.log(`📦 Joined room: ${roomId}`);
  });

  // envoyer message temps réel
  socket.on('send_message', (data) => {

    io.to(data.roomId).emit(
      'receive_message',
      data
    );

    console.log('📨 Message envoyé:', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket déconnecté:', socket.id);
  });
});
  

// 🚏 Routes API
app.use('/api/product', productRouter);
app.use('/api/user', userRouter);
app.use('/api/message', messageRouter);
app.use('/api/admin', adminRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/user/favorites', favoritesRoutes);
app.use('/api/twilio', twilioRouter);
app.use('/api/video', routerVideo);
app.use(notifyRoute);


// 🏥 Health Check
app.get('/ping', (req, res) => {
  res.send('pong');
});


// 🧪 Route test
app.get('/', (req, res) => {
  res.send('API IS WORKING (Development Mode)');
});


// ❌ Gestion des erreurs
app.use((err, req, res, next) => {

  console.error(err.stack);

  res.status(500).json({
    error: 'Internal Server Error'
  });
});


// 🚀 Démarrage serveur
server.listen(port, '0.0.0.0', () => {

  console.log(
    `✅ Server running in ${process.env.NODE_ENV || 'development'} mode`
  );

  console.log(
    `✅ Listening on http://localhost:${port}`
  );

  console.log('✅ Socket.IO ready');
});