import express from "express";
import axios from "axios";

const router = express.Router();

let expoTokens = [];

router.post("/register-token", (req, res) => {
  const { token } = req.body;
  if (token && !expoTokens.includes(token)) {
    expoTokens.push(token);
    console.log("📲 Token enregistré :", token);
  }
  res.json({ success: true });
});

router.post("/send-notification", async (req, res) => {
  const { title, body } = req.body;

  if (expoTokens.length === 0) {
    return res.json({ success: false, message: "Aucun token enregistré" });
  }

  try {
    const messages = expoTokens.map(token => ({
      to: token,
      sound: "default",
      title,
      body,
    }));

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

    console.log("📩 Réponse Expo :", response.data);
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Erreur envoi notification :", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
