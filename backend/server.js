import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';


// App configuration
const app = express();
const port = process.env.PORT || 5000; // Use PORT from .env or default to 5000

// Connect to the database pour testé mon serveurr
connectDB();
connectCloudinary();

// Middleware
app.use(express.json()); // Parse incoming requests with JSON payloadstytytytrrtrttyt dfdf
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cors());

// API endpoints
app.use('/api/product', productRouter);
// app.use("/images", express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
 app.use('/api/order', orderRouter);
// app.use('/api/twilio', twilioRouter);

// Default route
app.get('/', (req, res) => {
    res.send('API IS WORKING');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on http://localhost:${port}`);
});