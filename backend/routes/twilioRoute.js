import express from 'express'
import { sendTwilioMessage } from '../controlers/twilio.js';






const twilioRouter = express.Router();

twilioRouter.post('/notify',sendTwilioMessage)

export default twilioRouter;
//jespere aue cava 
