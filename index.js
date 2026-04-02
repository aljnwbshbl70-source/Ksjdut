const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

// --- سيرفر ريندر ---
const app = express();
app.get('/', (req, res) => res.send('Yami Downloader is Running! 🚀'));
app.listen(process.env.PORT || 3000);

// --- إعدادات البوت ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY'; // توكنك
const bot = new TelegramBot(token, { polling: true });

console.log("🤖 بوت التحميل السريع بدأ...");

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🚀 أهلاً يامي! أرسل رابط (TikTok, Insta, YT) وسأقوم بتحميله فوراً.");
});

bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text && text.startsWith('http')) {
        bot.sendMessage(chatId, "⏳ جاري التحميل السريع... انتظر ثواني");

        try {
            // استخدام API بديل وأقوى (Alyn API)
            const response = await axios.get(`https://api.alynapi.my.id/api/downloader/all?url=${encodeURIComponent(text)}`);
            const result = response.data.result;

            // محاولة جلب رابط الفيديو من الرد
            let videoUrl = result.url || (result.data && result.data[0] ? result.data[0].url : null);

            if (videoUrl) {
                bot.sendVideo(chatId, videoUrl, { 
                    caption: "✅ تم التحميل بواسطة بوت يامي",
                    reply_to_message_id: msg.message_id
                });
            } else {
                bot.sendMessage(chatId, "⚠️ السيرفر لم يجد فيديو، تأكد من أن الرابط عام وليس خاص.");
            }
        } catch (error) {
            // محاولة ثانية بـ API احتياطي في حال فشل الأول
            try {
                const altRes = await axios.get(`https://api.vreden.my.id/api/downloadall?url=${encodeURIComponent(text)}`);
                const altUrl = altRes.data.result.url;
                if (altUrl) {
                    bot.sendVideo(chatId, altUrl, { caption: "✅ تم التحميل (سيرفر احتياطي)" });
                } else {
                    bot.sendMessage(chatId, "❌ جميع السيرفرات مشغولة حالياً، جرب لاحقاً.");
                }
            } catch (e) {
                bot.sendMessage(chatId, "❌ خطأ فني، يبدو أن الروابط محمية أو السيرفر متوقف.");
            }
        }
    }
});
