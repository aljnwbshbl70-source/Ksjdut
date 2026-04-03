const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// نظام البقاء حياً لـ Render
app.get('/', (req, res) => res.send('Bot is Live!'));
app.listen(process.env.PORT || 3000);

const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY'; 
const bot = new TelegramBot(token, { polling: true });
const userState = {}; 
const channelUsername = '@jes45kabot'; 
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; 

// مصفوفة الزخارف
const getZakhrafa = (t) => [
    `ꪗ̶${t}̶ꪖ̶ꪑ̶ꪱ̶`, `ყ̷${t}̷α̷ɱ̷ι̷`, `Ɏ͢${t}͢₳͢₥͢ł͢`, `『${t}』🔥`, `𓆩${t}𓆪`, `𖤐 ${t}`
];

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text) return;

    // فحص الاشتراك
    try {
        const member = await bot.getChatMember(channelUsername, msg.from.id);
        if (!['member', 'administrator', 'creator'].includes(member.status)) {
            return bot.sendMessage(chatId, `⚠️ **يجب الاشتراك لتفعيل البوت:**\n📢 ${channelUsername}`, {
                reply_markup: { inline_keyboard: [[{ text: '📢 اشتراك الآن', url: `https://t.me/${channelUsername.replace('@', '')}` }]] }
            });
        }
    } catch (e) {}

    if (text === '/start') {
        userState[chatId] = null;
        return bot.sendMessage(chatId, `✨ **عالم جيسيكا للخدمات** ✨`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🎨 زخرفة الأسماء', callback_data: 'mode_zak' }],
                    [{ text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }, { text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }],
                    [{ text: '📸 إنستغرام', url: 'https://t.me/Biobot' }],
                    [{ text: '💚 تابعنا واتساب', url: whatsappChannel }],
                    [{ text: '👨‍💻 المطور يامي', url: 'https://wa.me/966574360046' }]
                ]
            }
        });
    }

    if (!text.startsWith('/') && userState[chatId] === 'ZAK') {
        const list = getZakhrafa(text);
        let btns = list.map((z, i) => [{ text: `فخامة ${i+1}`, callback_data: `sh_${i}_${text}` }]);
        btns.push([{ text: '🏠 عودة للقائمة', callback_data: 'back' }]);
        return bot.sendMessage(chatId, `🔥 زخارف ( ${text} ):`, { reply_markup: { inline_keyboard: btns } });
    }
});

bot.on('callback_query', (q) => {
    const chatId = q.message.chat.id;
    if (q.data === 'mode_zak') {
        userState[chatId] = 'ZAK';
        bot.sendMessage(chatId, "🎨 أرسل الاسم الآن لزخرفته:");
    } else if (q.data === 'back') {
        userState[chatId] = null;
        bot.sendMessage(chatId, "🏠 عدنا للقائمة الرئيسية.");
    } else if (q.data.startsWith('sh_')) {
        const p = q.data.split('_');
        bot.sendMessage(chatId, `\`${getZakhrafa(p[2])[p[1]]}\``, { parse_mode: 'Markdown' });
    }
    bot.answerCallbackQuery(q.id);
});
