import express from 'express';
import { sendNotification  } from '../controlers/vonage.js';


const router = express.Router();

// Route POST /api/notify-visit
router.post('/api/notify', sendNotification );

export default router;
