// get-chat-id.js
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('8527285567:AAHruzB7JKIMf1JyiVQMnFOiBAcCXA1PkC8', {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log(`Ваш Chat ID: ${chatId}`);
  console.log(`Имя: ${msg.chat.first_name} ${msg.chat.last_name || ''}`);
  bot.sendMessage(chatId, `Ваш Chat ID: ${chatId}`);
  bot.stopPolling();
});