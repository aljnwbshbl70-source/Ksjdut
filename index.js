const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// --- نظام الرد على الاستضافة (النغزة) ---
const port = process.env.PORT || 3000;

// هذا الجزء هو اللي يرد بكلمة OK للاستضافة الخارجية
app.get('/', (req, res) => {
    res.status(200).send('OK'); 
    console.log('Ping received! Bot is awake. ✅');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

// --- إعدادات البوت ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY'; 
const bot = new TelegramBot(token, { polling: true });
const userState = {}; 

const channelUsername = '@jes45kabot'; 
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; 
const devWhatsapp = 'https://wa.me/966574360046';

// مصفوفة الزخارف
const getZakhrafa = (t) => [
    `ꪗ̶${t}̶ꪖ̶ꪑ̶ꪱ̶`, `ყ̷${t}̷α̷ɱ̷ι̷`, `Ɏ͢${t}͢₳͢₥͢ł͢`, `『${t}』🔥`, `𓆩${t}𓆪`, `𖤐 ${t}`, `✨ ${t} ✨`, `⚡️ ${t} ⚡️`
];

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text) return;

    // فحص الاشتراك الإجباري
    try {
        const member = await bot.getChatMember(channelUsername, msg.from.id);
        if (!['member', 'administrator', 'creator'].includes(member.status)) {
            return bot.sendMessage(chatId, `⚠️ **يجب الاشتراك لتفعيل البوت:**\n📢 ${channelUsername}`, {
                reply_markup: { inline_keyboard: [[{ text: '📢 اشتراك الآن', url: `https://t.me/${channelUsername.replace('@', '')}` }]] }
            });
        }
    } catch (e) { console.log("Sub Check Error"); }

    if (text === '/start') {
        userState[chatId] = null;
        return bot.sendMessage(chatId, `✨ **عالم جيسيكا للخدمات** ✨\n\nزخرف اسمك وحمل فيديوهاتك بضغطة زر:`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🎨 زخرفة الأسماء', callback_data: 'mode_zak' }],
                    [{ text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }, { text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }],
                    [{ text: '📸 إنستغرام', url: 'https://t.me/Biobot' }],
                    [{ text: '💚 تابعنا واتساب', url: whatsappChannel }],
                    [{ text: '👨‍💻 المطور يامي', url: devWhatsapp }]
                ]
            }
        });
    }

    if (!text.startsWith('/') && userState[chatId] === 'ZAK') {
        const list = getZakhrafa(text);
        let btns = list.map((z, i) => [{ text: `شكل ${i+1} ✨`, callback_data: `sh_${i}_${text}` }]);
        btns.push([{ text: '🏠 عودة للقائمة', callback_data: 'back' }]);
        return bot.sendMessage(chatId, `🔥 زخارف ( ${text} ):`, { reply_markup: { inline_keyboard: btns } });
    }
});

bot.on('callback_query', (q) => {
    const chatId = q.message.chat.id;
    if (q.data === 'mode_zak') {
        userState[chatId] = 'ZAK';
        bot.sendMessage(chatId, "🎨 أرسل الاسم بالإنجليزية لزخرفته:");
    } else if (q.data === 'back') {
        userState[chatId] = null;
        bot.sendMessage(chatId, "🏠 عدنا للقائمة الرئيسية.");
    } else if (q.data.startsWith('sh_')) {
        const p = q.data.split('_');
        bot.sendMessage(chatId, `\`${getZakhrafa(p[2])[p[1]]}\``, { parse_mode: 'Markdown' });
    }
    bot.answerCallbackQuery(q.id);
});
           
