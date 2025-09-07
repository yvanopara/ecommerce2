import express from "express";
import TelegramBot from "node-telegram-bot-api";

const router = express.Router();

// Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });

// Stocker le dernier message (optionnel)
let lastMessage = null;

// Endpoint pour recevoir un message depuis le front-end et l'envoyer sur Telegram
router.post("/notify", async (req, res) => {
  try {
    const message = req.body.message || "Un visiteur est arrivé !";
    lastMessage = message;

    // Envoi du message sur Telegram
    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);

    console.log("📩 Message envoyé sur Telegram :", message);

    res.json({ status: "ok" });
  } catch (error) {
    console.error("❌ Erreur en envoyant le message Telegram :", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Endpoint pour récupérer le dernier message (optionnel, mobile)
router.get("/message", (req, res) => {
  res.json({ message: lastMessage });
});

export default router;
