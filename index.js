const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
app.listen(process.env.PORT || 3000);

const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🎬 تحميل من تيك توك (سريع)', url: 'https://t.me/SaveAsBot' }],
                [{ text: '📺 تحميل من يوتيوب (HD)', url: 'https://t.me/Downloadstorybot' }],
                [{ text: '📸 تحميل إنستقرام وبحث', url: 'https://t.me/Biobot' }],
                [{ text: '📢 قناة التحديثات', url: 'https://t.me/ALALIPLUS' }],
                [{ text: '👨‍💻 المطور يامي الرسمي', url: 'https://t.me/yami_official' }]
            ]
        }
    };
    bot.sendMessage(msg.chat.id, "🚀 **مرحباً بك في بوابة يامي للتحميل V3**\n\nلقد قمنا بربط أفضل سيرفرات التحميل العالمية (بدون إعلانات) لخدمتك.\n\nإختر المنصة التي تريد التحميل منها أدناه:", { parse_mode: 'Markdown', ...opts });
});

bot.on('message', (msg) => {
    if (msg.text && msg.text.startsWith('http')) {
        bot.sendMessage(msg.chat.id, "💡 **عزيزي المستخدم:** لضمان أفضل جودة وسرعة، يرجى الضغط على الزر المناسب للمنصة من القائمة أعلاه (أرسل /start لتظهر لك).");
    }
});
