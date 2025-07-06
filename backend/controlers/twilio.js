import twilio from 'twilio'; // Import Twilio library
import dotenv from "dotenv";



const accountSid = process.env.TWILIO_ACCOUNT_SIDD; 
const authToken = process.env.TWILIO_AUTH_TOKENN;
const client = twilio(accountSid, authToken);
const sendTwilioMessage = async (req, res) => {  // Renamed the function
    const { message } = req.body;  // Extract message from the body


    // Send the message via Twilio ggfgfsgf
    client.messages
        .create({
            body: message,  // Message to send
            from: 'whatsapp:+14155238886',  // Replace with your Twilio number
            to: 'whatsapp:+23793800251'     // Replace with recipient's number
        })
        .then(() => {
            console.log('Notification sent successfully!');
            res.status(200).send('Notification sent.');
        })
        .catch((err) => {
            console.error('Error sending notification:', err);
            res.status(500).send('Error sending notification.');
        });
};

export { sendTwilioMessage };
