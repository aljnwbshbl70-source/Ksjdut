const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const TelegramBot = require('node-telegram-bot-api');
const pino = require('pino');
const express = require('express');

// --- سيرفر Express لمنع توقف ريندر ---
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Yami Second Bot is Running! 🚀'));
app.listen(port, () => console.log(`✅ Server is live on port ${port}`));

// --- إعدادات البوت الجديد ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY'; // التوكن الجديد
const adminId = '7061804635'; // الآي دي الخاص بك (يامي)
const tBot = new TelegramBot(token, { polling: true });

async function startWhatsApp(chatId, phoneNumber) {
    const { state, saveCreds } = await useMultiFileAuthState('yami_v2_session');
    
    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ["Safari", "iPhone", "17.4.1"], // هوية آيفون لتخطى الرفض
        syncFullHistory: false
    });

    if (!sock.authState.creds.registered) {
        try {
            tBot.sendMessage(chatId, "⏳ جاري طلب كود الربط من سيرفرات واتساب...");
            setTimeout(async () => {
                const code = await sock.requestPairingCode(phoneNumber.trim());
                tBot.sendMessage(chatId, `✅ تم استخراج الكود بنجاح!\n\n🔥 الكود: [ ${code} ]\n\nأدخله في الواتساب الآن.`);
            }, 7000);
        } catch (e) {
            tBot.sendMessage(chatId, "❌ واجه واتساب مشكلة في الطلب. حاول مجدداً بعد قليل.");
        }
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (u) => {
        const { connection } = u;
        if (connection === 'open') tBot.sendMessage(chatId, "🚀 البوت الثاني متصل الآن بنجاح!");
    });
}

// --- لوحة التحكم ---
tBot.onText(/\/start/, (msg) => {
    if (msg.chat.id.toString() !== adminId) return;
    const opts = {
        reply_markup: {
            inline_keyboard: [[{ text: '🔗 ربط واتساب جديد', callback_data: 'pair' }]]
        }
    };
    tBot.sendMessage(msg.chat.id, "🛠️ لوحة تحكم يامي (البوت الثاني)\nجاهز للعمل سحابياً.", opts);
});

tBot.on('callback_query', (q) => {
    if (q.data === 'pair') tBot.sendMessage(q.message.chat.id, "📱 أرسل الرقم مع مفتاح الدولة:");
});

tBot.on('message', (msg) => {
    if (msg.chat.id.toString() === adminId && /^\d+$/.test(msg.text)) {
        startWhatsApp(msg.chat.id, msg.text);
    }
});

console.log("🤖 البوت الثاني قيد التشغيل...");
  
