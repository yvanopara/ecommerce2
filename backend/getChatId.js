import TelegramBot from 'node-telegram-bot-api';

// Remplace par ton token
const token = '8495193401:AAFYwhHSsuekBVOVfV3Jjwh812bTyVUfPdE';
const bot = new TelegramBot(token, { polling: true });

// Quand tu envoies un message au bot, il affichera ton chat ID
bot.on('message', (msg) => {
  console.log('Ton chat ID est :', msg.chat.id);
  console.log('Nom du chat :', msg.chat.first_name || msg.chat.title);
});
