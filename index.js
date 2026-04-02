const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const ytdl = require('@distube/ytdl-core');
const { tiktok } = require('tiktok-downloader-v2');
const instagramGetUrl = require("instagram-url-direct");

const app = express();
app.listen(process.env.PORT || 3000);

const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (!text || !text.startsWith('http')) return;

    bot.sendMessage(chatId, "⏳ جاري المعالجة العميقة بواسطة سيرفر يامي V4... 🚀");

    try {
        // 1. معالجة تيك توك (Tiktok)
        if (text.includes('tiktok.com')) {
            const res = await tiktok(text);
            return bot.sendVideo(chatId, res.video.no_watermark, { caption: "✅ تيك توك بدون حقوق - يامي" });
        }

        // 2. معالجة يوتيوب (YouTube)
        if (text.includes('youtube.com') || text.includes('youtu.be')) {
            const info = await ytdl.getInfo(text);
            const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
            return bot.sendVideo(chatId, format.url, { caption: "✅ يوتيوب HD - يامي" });
        }

        // 3. معالجة إنستقرام (Instagram)
        if (text.includes('instagram.com')) {
            const res = await instagramGetUrl(text);
            return bot.sendVideo(chatId, res.url_list[0], { caption: "✅ إنستقرام - يامي" });
        }

        bot.sendMessage(chatId, "⚠️ المنصة غير مدعومة حالياً، أرسل رابط تيك توك أو يوتيوب أو إنستا.");
    } catch (e) {
        bot.sendMessage(chatId, "❌ السيرفر مضغوط أو الرابط خاص، حاول لاحقاً.");
    }
});
