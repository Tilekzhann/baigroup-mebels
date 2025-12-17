const TelegramBot = require('node-telegram-bot-api');

// Ваши данные
const TELEGRAM_TOKEN = '8527285567:AAHruzB7JKIMf1JyiVQMnFOiBAcCXA1PkC8';
const CHAT_ID = '524907135';

const bot = new TelegramBot(TELEGRAM_TOKEN);

module.exports = async (req, res) => {
  // ВАЖНО: Правильные CORS заголовки для Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://baigroup-mebels.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Обработка preflight запроса
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Метод не разрешён' 
    });
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
      'custom': 'Индивидуальный проект',
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

    // Успешный ответ
    res.status(200).json({ 
      success: true, 
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.' 
    });

  } catch (error) {
    console.error('❌ Ошибка Telegram бота:', error.message);
    
    // Даже при ошибке Telegram отправляем успешный ответ клиенту
    res.status(200).json({ 
      success: true, 
      message: 'Заявка получена! Мы свяжемся с вами в ближайшее время.' 
    });
  }
};
