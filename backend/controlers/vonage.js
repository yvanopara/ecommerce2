// import axios from 'axios';
// import 'dotenv/config';


// // Notification WhatsApp via Vonage (Vodage 😄)
// export const sendNotification = async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ success: false, error: 'Message requis' });
//   }

//   try {
//     await axios.post('https://messages-sandbox.nexmo.com/v1/messages', {
//       from: '14157386102',
//       to: '23793800251', // Ton numéro WhatsApp
//       message_type: 'text',
//       text: message,
//       channel: 'whatsapp'
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       auth: {
//         username: process.env.VONAGE_API_KEY,
//         password: process.env.VONAGE_API_SECRET
//       }
//     });

//     return res.json({ success: true, message: 'Notification envoyée' });
//   } catch (error) {
//     console.error('Erreur Vodage :', error.response?.data || error.message);
//     return res.status(500).json({ success: false, error: 'Échec de l’envoi de la notification' });
//   }
// };
