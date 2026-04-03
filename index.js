const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
const app = express();

// إعدادات السيرفر للبقاء حياً
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.status(200).send('Bot is Running!'));
app.listen(port, '0.0.0.0');

// التوكنات (تأكد من صحتها)
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const openAiApiKey = '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';

const bot = new TelegramBot(token, { polling: true });
const userState = {}; 

const channelUsername = '@jes45kabot';
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P';
const devWhatsapp = 'https://wa.me/966574360046';

// مصفوفة الزخرفة (تم استرجاعها وتأمينها)
const getZakhrafa = (t) => [
    `ꪗ̶${t}̶ꪖ̶ꪑ̶ꪱ̶`, `ყ̷${t}̷α̷ɱ̷ι̷`, `Ɏ͢${t}͢₳͢₥͢ł͢`, `𐌖𐌀${t}𐌉`, `𓎛𓄿${t}𓇋`, `ꌩꍏ${t}ꀤ`, `Ⴤმო${t}ɿ`, `ყค${t}ɱɿ`,
    `${t}҉a҉m҉i҉💀⚡`, `${t}̸a̸m̸i̸☠️🖤`, `${t}͢a͢m͢i͢👁️‍🗨️💥`, `『${t}』🔥`, `𓆩${t}𓆪`, `𖤐 ${t}`
];

// وظيفة الذكاء الاصطناعي
async function askAi(text) {
    try {
        const res = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: text }]
        }, { headers: { 'Authorization': `Bearer ${openAiApiKey}` } });
        return res.data.choices[0].message.content;
    } catch (e) { return "⚠️ عذراً، الذكاء الاصطناعي معطل حالياً."; }
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text && !msg.photo) return;

    // فحص الاشتراك
    try {
        const member = await bot.getChatMember(channelUsername, msg.from.id);
        if (!['member', 'administrator', 'creator'].includes(member.status)) {
            return bot.sendMessage(chatId, `⚠️ اشتراك أولاً: ${channelUsername}`);
        }
    } catch (e) { console.log("Sub Error"); }

    // القائمة الرئيسية (مطابقة لصورتك تماماً)
    if (text === '/start' || text === 'الرجوع للقائمة 🏠') {
        userState[chatId] = null;
        return bot.sendMessage(chatId, `✨ **مرحباً بك في عالم جيسيكا** ✨\n\nأقوى بوت تحميل وزخرفة وذكاء اصطناعي:\n• تنزيل من جميع المواقع.\n• زخرفة احترافية (40+ شكل).\n• قسم ذكاء اصطناعي متكامل.\n\n👇 **اختر الخدمة المطلوبة من الأزرار:**`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }, { text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }],
                    [{ text: '📸 إنستقرام', url: 'https://t.me/Biobot' }],
                    [{ text: '🎨 قسم الزخرفة', callback_data: 'mode_zak' }],
                    [{ text: '🔄 تغيير صيغ الملفات', callback_data: 'mode_conv' }],
                    [{ text: '🤖 جيسيكا Ai', callback_data: 'ai_menu' }],
                    [{ text: 'تابعنا على واتساب 💚', url: whatsappChannel }],
                    [{ text: 'المطور يامي 👨‍💻', url: devWhatsapp }]
                ],
                keyboard: [[{ text: 'الرجوع للقائمة 🏠' }]], resize_keyboard: true
            }
        });
    }

    // منطق العمليات
    if (userState[chatId] === 'mode_zak' && text) {
        const list = getZakhrafa(text);
        let btns = [];
        for (let i = 0; i < list.length; i += 2) {
            btns.push([{ text: `شكل ${i+1}`, callback_data: `sh_${i}_${text}` }, { text: `شكل ${i+2}`, callback_data: `sh_${i+1}_${text}` }]);
        }
        return bot.sendMessage(chatId, `🔥 زخارف (${text}):`, { reply_markup: { inline_keyboard: btns } });
    }

    if (userState[chatId] === 'mode_chat' && text) {
        const reply = await askAi(text);
        return bot.sendMessage(chatId, reply);
    }
});

bot.on('callback_query', async (q) => {
    const chatId = q.message.chat.id;
    if (q.data === 'mode_zak') { userState[chatId] = 'mode_zak'; bot.sendMessage(chatId, "🎨 أرسل الاسم الآن لزخرفته:"); }
    if (q.data === 'ai_menu') {
        bot.editMessageText("🤖 اختر نوع الخدمة:", {
            chat_id: chatId, message_id: q.message.message_id,
            reply_markup: { inline_keyboard: [[{ text: '🖼️ تعديل صور', callback_data: 'm_photo' }, { text: '💬 دردشة Ai', callback_data: 'm_chat' }]] }
        });
    }
    if (q.data === 'm_chat') { userState[chatId] = 'mode_chat'; bot.sendMessage(chatId, "اهلا أنا مساعد جـيـسـيـكـا.. تفضل 🫶💗"); }
    if (q.data.startsWith('sh_')) {
        const p = q.data.split('_');
        const list = getZakhrafa(p[2]);
        bot.sendMessage(chatId, `\`${list[p[1]]}\``, { parse_mode: 'Markdown' });
    }
    bot.answerCallbackQuery(q.id);
});
        
       
