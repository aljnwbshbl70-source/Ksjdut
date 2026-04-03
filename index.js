const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const reshaper = require('arabic-persian-reshaper');
const bidi = require('bidi-js')();
const app = express();

app.listen(process.env.PORT || 3000);

const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const bot = new TelegramBot(token, { polling: true });
const userState = {};
const channelUsername = '@jes45kabot';

// --- دالة الدردشة (Gemini المجاني) ---
async function askAi(text) {
    try {
        const res = await axios.get(`https://api.hercai.onrender.com/v3/hercai?question=${encodeURIComponent(text)}`);
        return res.data.reply;
    } catch (e) {
        return "⚠️ جيسيكا حالياً مشغولة، جرب مرة ثانية.";
    }
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text) return;

    // فحص الاشتراك
    try {
        const member = await bot.getChatMember(channelUsername, msg.from.id);
        if (!['member', 'administrator', 'creator'].includes(member.status)) {
            return bot.sendMessage(chatId, `⚠️ **اشترك أولاً:**\n📢 ${channelUsername}`, {
                reply_markup: { inline_keyboard: [[{ text: '📢 اشتراك', url: `https://t.me/${channelUsername.replace('@', '')}` }]] }
            });
        }
    } catch (e) {}

    if (text === '/start') {
        userState[chatId] = null;
        return bot.sendMessage(chatId, `✨ **مرحباً بك في عالم جيسيكا** ✨`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🤖 جيسيكا Ai', callback_data: 'mode_chat' }, { text: '🎨 الزخرفة', callback_data: 'mode_zak' }],
                    [{ text: '📄 نص إلى PDF (عربي)', callback_data: 'mode_pdf' }],
                    [{ text: '👨‍💻 المطور', url: 'https://wa.me/966574360046' }]
                ]
            }
        });
    }

    if (!text.startsWith('/')) {
        if (userState[chatId] === 'CHAT') {
            bot.sendChatAction(chatId, 'typing');
            const reply = await askAi(text);
            return bot.sendMessage(chatId, reply);
        }
        
        if (userState[chatId] === 'PDF') {
            bot.sendMessage(chatId, "⏳ جاري إنشاء الملف العربي...");
            const doc = new PDFDocument();
            const fileName = `jessica.pdf`;
            const stream = fs.createWriteStream(fileName);
            doc.pipe(stream);
            
            // إصلاح النص العربي (تشبيك الحروف وعكس الاتجاه)
            const correctedText = bidi.getReorderedText(reshaper.ArabicReshaper.reshape(text));
            
            doc.fontSize(20).text(correctedText, { align: 'right' });
            doc.end();
            
            stream.on('finish', () => {
                bot.sendDocument(chatId, fileName).then(() => fs.unlinkSync(fileName));
            });
            userState[chatId] = null;
        }
    }
});

bot.on('callback_query', (q) => {
    const chatId = q.message.chat.id;
    if (q.data === 'mode_chat') {
        userState[chatId] = 'CHAT';
        bot.sendMessage(chatId, "💬 تفضل اسأل جيسيكا أي شيء:");
    } else if (q.data === 'mode_pdf') {
        userState[chatId] = 'PDF';
        bot.sendMessage(chatId, "📄 أرسل النص العربي لتحويله لـ PDF:");
    }
    bot.answerCallbackQuery(q.id);
});
        
