const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const ytdl = require('@distube/ytdl-core');
const { tiktok } = require('tiktok-downloader-v2');

const app = express();
app.listen(process.env.PORT || 3000);

const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const text = msg.text;
    if (!text || !text.startsWith('http')) return;

    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "⏳ جاري المعالجة المباشرة (نظام يامي V4)...");

    try {
        if (text.includes('youtube.com') || text.includes('youtu.be')) {
            // معالجة يوتيوب مباشرة
            const info = await ytdl.getInfo(text);
            const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
            bot.sendVideo(chatId, format.url, { caption: "✅ يوتيوب - يامي" });
        } 
        else if (text.includes('tiktok.com')) {
            // معالجة تيك توك مباشرة
            const result = await tiktok(text);
            bot.sendVideo(chatId, result.video.no_watermark, { caption: "✅ تيك توك - يامي" });
        } 
        else {
            bot.sendMessage(chatId, "⚠️ حالياً أدعم يوتيوب وتيك توك فقط لضمان السرعة قبل توقف الوقت.");
        }
    } catch (e) {
        bot.sendMessage(chatId, "❌ السيرفر مضغوط جداً، جرب رابطاً أقصر أو تيك توك.");
    }
});
