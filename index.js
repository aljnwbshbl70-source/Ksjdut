const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
const app = express();

// --- نظام البقاء حياً 24 ساعة ---
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.status(200).send('OK'));
app.listen(port, '0.0.0.0', () => console.log(`Server is running...`));

// --- الإعدادات (التوكنات الخاصة بك) ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY'; 
const openAiApiKey = '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';

const bot = new TelegramBot(token, { polling: true });
const userState = {}; // لتتبع حالة المستخدم (دردشة/زخرفة)

const channelUsername = '@jes45kabot'; 
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; 
const devWhatsapp = 'https://wa.me/966574360046'; 

// --- مصفوفة الزخارف (40+ شكل) ---
const getZakhrafa = (t) => [
    `ꪗ̶${t}̶ꪖ̶ꪑ̶ꪱ̶`, `ყ̷${t}̷α̷ɱ̷ι̷`, `Ɏ͢${t}͢₳͢₥͢ł͢`, `𐌖𐌀${t}𐌉`, `𓎛𓄿${t}𓇋`, `ꌩꍏ${t}ꀤ`, `Ⴤმო${t}ɿ`, `ყค${t}ɱɿ`,
    `${t} ΛMI`, `${t} ΔMI`, `${t} ᗩMI`, `ⲨⲀ${t}Ⲓ`,
    `${t}҉a҉m҉i҉💀⚡`, `${t}̸a̸m̸i̸☠️🖤`, `${t}͢a͢m͢i͢👁️‍🗨️💥`, `${t}̴a̴m̴i̴🧿⚔️`, `${t}̷͜a̷͜m̷͜i̷👻💣`, `${t}͜͞a͜͞m͜͞i͜͞🕷️🔥`, `『${t}』🔥`, `𓆩${t}𓆪`, `𖤐 ${t}`
];

// --- دالة ChatGPT (الدردشة) ---
async function askAi(text) {
    try {
        const res = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: text }]
        }, { headers: { 'Authorization': `Bearer ${openAiApiKey}`, 'Content-Type': 'application/json' } });
        return res.data.choices[0].message.content;
    } catch (e) { return "⚠️ عذراً، مساعد جيسيكا مشغول حالياً."; }
}

// --- معالجة الرسائل ---
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text) return;

    // 1. فحص الاشتراك الإجباري
    try {
        const member = await bot.getChatMember(channelUsername, msg.from.id);
        if (!['member', 'administrator', 'creator'].includes(member.status)) {
            return bot.sendMessage(chatId, `⚠️ **يجب الاشتراك أولاً لتفعيل البوت:**\n📢 ${channelUsername}`, {
                reply_markup: { inline_keyboard: [[{ text: '📢 اضغط هنا للاشتراك', url: `https://t.me/${channelUsername.replace('@', '')}` }]] }
            });
        }
    } catch (e) { console.log("Sub Error"); }

    // 2. القائمة الرئيسية
    if (text === '/start' || text === 'الرجوع للقائمة 🏠') {
        userState[chatId] = null;
        const welcomeMsg = `✨ **عالم جيسيكا AI المطور** ✨\n\nأهلاً بك يا ${msg.from.first_name}، اختر الخدمة المطلوبة:`;
        
        return bot.sendMessage(chatId, welcomeMsg, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🤖 جيسيكا Ai (دردشة)', callback_data: 'mode_chat' }, { text: '🎨 قسم الزخرفة', callback_data: 'mode_zak' }],
                    [{ text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }, { text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }],
                    [{ text: '📸 إنستغرام', url: 'https://t.me/Biobot' }],
                    [{ text: '🔄 تحويل صيغ', callback_data: 'convert_info' }],
                    [{ text: '💚 تابعنا واتساب', url: whatsappChannel }, { text: '👨‍💻 المطور', url: devWhatsapp }]
                ],
                keyboard: [[{ text: 'الرجوع للقائمة 🏠' }]], resize_keyboard: true
            }
        });
    }

    // 3. منطق الحالات
    if (!text.startsWith('/')) {
        if (userState[chatId] === 'CHAT') {
            bot.sendChatAction(chatId, 'typing');
            const reply = await askAi(text);
            return bot.sendMessage(chatId, reply);
        }

        if (userState[chatId] === 'ZAK') {
            const list = getZakhrafa(text);
            const buttons = [];
            for (let i = 0; i < list.length; i += 2) {
                buttons.push([
                    { text: `فخامة ${i+1} ⚡️`, callback_data: `sh_${i}_${text}` },
                    { text: `فخامة ${i+2} ✨`, callback_data: `sh_${i+1}_${text}` }
                ]);
            }
            return bot.sendMessage(chatId, `🔥 **زخارف لاسم ( ${text} ):**`, { reply_markup: { inline_keyboard: buttons } });
        }
    }
});

// --- معالجة الأزرار ---
bot.on('callback_query', (q) => {
    const chatId = q.message.chat.id;
    
    if (q.data === 'mode_chat') {
        userState[chatId] = 'CHAT';
        bot.sendMessage(chatId, "اهلا أنا مساعد جـيـسـيـكـا تفضل مااذا تريد مساعده مني 🫶💗");
    }

    if (q.data === 'mode_zak') {
        userState[chatId] = 'ZAK';
        bot.sendMessage(chatId, "🎨 **قسم الزخرفة الاحترافية:** أرسل الاسم الآن لزخرفته.");
    }

    if (q.data.startsWith('sh_')) {
        const parts = q.data.split('_');
        const list = getZakhrafa(parts[2]);
        bot.sendMessage(chatId, `\`${list[parts[1]]}\``, { parse_mode: 'Markdown' });
    }

    bot.answerCallbackQuery(q.id);
});
        
