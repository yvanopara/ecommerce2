import express from "express";
import axios from "axios";

const router = express.Router();

let expoTokens = [];
let lastMessage = null;

// Enregistrer un token Expo
router.post("/register-token", (req, res) => {
  const { token } = req.body;
  if (token && !expoTokens.includes(token)) {
    expoTokens.push(token);
    console.log("📲 Token enregistré :", token);
  }
  res.json({ success: true });
});

// Envoyer une notification à tous les tokens
async function sendPushNotificationToAll(message) {
  if (expoTokens.length === 0) return;

  const messages = expoTokens.map((token) => ({
    to: token,
    sound: "default",
    title: "Nouveau visiteur",
    body: message,
    data: { message },
  }));

  try {
    const response = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      messages,
      {
        headers: {
          "Accept": "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      }
    );
    console.log("📩 Notifications envoyées :", response.data);
  } catch (error) {
    console.error("Erreur envoi notification :", error.response?.data || error.message);
  }
}

// Quand le site web envoie un message
router.post("/notify", async (req, res) => {
  const message = req.body.message || "Un visiteur est arrivé !";
  lastMessage = message;
  console.log("Message reçu :", message);

  // Envoi notification push
  await sendPushNotificationToAll(message);

  res.send({ status: "ok" });
});

// Quand le mobile veut lire le message (optionnel)
router.get("/message", (req, res) => {
  res.send({ message: lastMessage });
});

export default router;
