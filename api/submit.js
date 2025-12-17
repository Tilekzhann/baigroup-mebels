// api/submit.js
const TelegramBot = require('node-telegram-bot-api');

// Ваши данные
const TELEGRAM_TOKEN = '8527285567:AAHruzB7JKIMf1JyiVQMnFOiBAcCXA1PkC8';
const CHAT_ID = '784064058'; // Ваш Chat ID

// Инициализация бота
const bot = new TelegramBot(TELEGRAM_TOKEN);

module.exports = async (req, res) => {
  // Включить CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, category, message } = req.body;

    // Валидация
    if (!name || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Имя и телефон обязательны' 
      });
    }

    // Определяем категорию
    const categoryNames = {
      'kitchen': 'Кухня',
      'wardrobe': 'Шкаф/гардеробная',
      'office': 'Офисная мебель',
      'other': 'Другое'
    };
    
    const categoryText = categoryNames[category] || category || 'Не указано';

    // Формируем сообщение для Telegram
    const telegramMessage = `
📋 *НОВАЯ ЗАЯВКА С САЙТА BAI GROUP*

👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
🏷️ *Тип мебели:* ${categoryText}
💬 *Сообщение:* ${message || 'Не указано'}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}
🌐 *Источник:* Сайт BAI GROUP
    `;

    // Отправляем в Telegram
    await bot.sendMessage(CHAT_ID, telegramMessage, { 
      parse_mode: 'Markdown' 
    });

    console.log('✅ Заявка отправлена:', { name, phone, category });

    // Ответ успеха
    res.status(200).json({ 
      success: true, 
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.' 
    });

  } catch (error) {
    console.error('❌ Ошибка:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже или свяжитесь напрямую.' 
    });
  }
};