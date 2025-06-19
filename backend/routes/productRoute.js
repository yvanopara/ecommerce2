import express from 'express';
import multer from 'multer';
import path from 'path';
import { addProduct, listProduct, removeProduct, singleProduct } from '../controlers/productController.js';
import adminAuth from '../middlewares/adminAuth.js';

// Configuration stockage images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'image5', maxCount: 1 },
  { name: 'image6', maxCount: 1 },
  { name: 'image7', maxCount: 1 },
  { name: 'image8', maxCount: 1 },
]), addProduct);

productRouter.get('/list', listProduct);
productRouter.get('/single', singleProduct);
productRouter.post('/remove', adminAuth, removeProduct);

export default productRouter;
