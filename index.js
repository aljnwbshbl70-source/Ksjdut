const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

// --- سيرفر لمنع توقف ريندر ---
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Yami Downloader is Active! 🚀'));
app.listen(port, () => console.log(`✅ Server is live on port ${port}`));

// --- إعدادات البوت ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY'; // توكنك الجديد
const adminId = '7061804635'; // آي دي يامي
const bot = new TelegramBot(token, { polling: true });

console.log("🤖 بوت التحميل بدأ العمل...");

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🚀 أهلاً بك في بوت يامي للتحميل!\n\nأرسل لي أي رابط من (TikTok, Instagram, YouTube, FB) وسأرسل لك الفيديو فوراً.");
});

bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text && text.startsWith('http')) {
        bot.sendMessage(chatId, "⏳ جاري جلب الفيديو... فضلاً انتظر قليلًا");

        try {
            // استخدام API خارجي سريع ومجاني
            const response = await axios.get(`https://api.vreden.my.id/api/downloadall?url=${encodeURIComponent(text)}`);
            const data = response.data.result;

            if (data && data.url) {
                bot.sendVideo(chatId, data.url, { 
                    caption: "✅ تم التحميل بنجاح بواسطة بوت يامي",
                    reply_to_message_id: msg.message_id
                });
            } else if (data && data.data && data.data[0].url) {
                 bot.sendVideo(chatId, data.data[0].url, { 
                    caption: "✅ تم التحميل بنجاح بواسطة بوت يامي",
                    reply_to_message_id: msg.message_id
                });
            } else {
                bot.sendMessage(chatId, "⚠️ عذراً، لم أستطع العثور على ملف قابل للتحميل لهذا الرابط.");
            }
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, "❌ حدث خطأ أثناء الاتصال بالسيرفر، جرب رابطاً آخر.");
        }
    }
});
