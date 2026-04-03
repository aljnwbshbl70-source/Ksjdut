const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
const app = express();

// --- نظام البقاء حياً ---
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.status(200).send('OK'));
app.listen(port, '0.0.0.0');

// --- الإعدادات ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY'; 
// تم تحديث المفتاح هنا ليعمل الـ AI فوراً
const openAiApiKey = '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';

const bot = new TelegramBot(token, { polling: true });
const userState = {}; 

const channelUsername = '@jes45kabot'; 
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; 
const devWhatsapp = 'https://wa.me/966574360046'; 

const getZakhrafa = (t) => [
    `ꪗ̶${t}̶ꪖ̶ꪑ̶ꪱ̶`, `ყ̷${t}̷α̷ɱ̷ι̷`, `Ɏ͢${t}͢₳͢₥͢ł͢`, `𐌖𐌀${t}𐌉`, `𓎛𓄿${t}𓇋`, `ꌩꍏ${t}ꀤ`, `Ⴤმო${t}ɿ`, `ყค${t}ɱɿ`,
    `${t} ΛMI`, `${t} ΔMI`, `${t} ᗩMI`, `ⲨⲀ${t}Ⲓ`,
    `${t}҉a҉m҉i҉💀⚡`, `${t}̸a̸m̸i̸☠️🖤`, `${t}͢a͢m͢i͢👁️‍🗨️💥`, `${t}̴a̴m̴i̴🧿⚔️`, `${t}̷͜a̷͜m̷͜i̷👻💣`, `${t}͜͞a͜͞m͜͞i͜͞🕷️🔥`, `『${t}』🔥`, `𓆩${t}𓆪`, `𖤐 ${t}`
];

async function askAi(text) {
    try {
        const res = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: text }]
        }, { headers: { 'Authorization': `Bearer ${openAiApiKey}`, 'Content-Type': 'application/json' } });
        return res.data.choices[0].message.content;
    } catch (e) { 
        console.log("AI Error Details:", e.response ? e.response.data : e.message);
        return "⚠️ عذراً، مساعد جيسيكا مشغول حالياً. (تأكد من رصيد مفتاح الـ AI في OpenAI)"; 
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
            return bot.sendMessage(chatId, `⚠️ **يجب الاشتراك أولاً لتفعيل البوت:**\n📢 ${channelUsername}`, {
                reply_markup: { inline_keyboard: [[{ text: '📢 اضغط هنا للاشتراك', url: `https://t.me/${channelUsername.replace('@', '')}` }]] }
            });
        }
    } catch (e) { console.log("Sub Error"); }

    if (text === '/start') {
        userState[chatId] = null;
        const welcomeMsg = `✨ **عالم جيسيكا AI المطور** ✨\n\nأهلاً بك يا ${msg.from.first_name}، اختر خدمتك من الأزرار الشفافة:`;
        
        return bot.sendMessage(chatId, welcomeMsg, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🤖 جيسيكا Ai (دردشة)', callback_data: 'mode_chat' }, { text: '🎨 قسم الزخرفة', callback_data: 'mode_zak' }],
                    [{ text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }, { text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }],
                    [{ text: '📸 إنستغرام', url: 'https://t.me/Biobot' }],
                    [{ text: '🔄 تحويل صيغ', callback_data: 'convert_info' }],
                    [{ text: '💚 تابعنا واتساب', url: whatsappChannel }, { text: '👨‍💻 المطور', url: devWhatsapp }]
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

        if (userState[chatId] === 'ZAK') {
            const list = getZakhrafa(text);
            const buttons = [];
            for (let i = 0; i < list.length; i += 2) {
                buttons.push([
                    { text: `فخامة ${i+1} ⚡️`, callback_data: `sh_${i}_${text}` },
                    { text: `فخامة ${i+2} ✨`, callback_data: `sh_${i+1}_${text}` }
                ]);
            }
            buttons.push([{ text: '🏠 الرجوع للقائمة', callback_data: 'back_main' }]);
            return bot.sendMessage(chatId, `🔥 **زخارف لاسم ( ${text} ):**`, { reply_markup: { inline_keyboard: buttons } });
        }
    }
});

bot.on('callback_query', (q) => {
    const chatId = q.message.chat.id;
    
    if (q.data === 'mode_chat') {
        userState[chatId] = 'CHAT';
        bot.sendMessage(chatId, "اهلا أنا مساعد جـيـسـيـكـا تفضل مااذا تريد مساعده مني 🫶💗", {
            reply_markup: { inline_keyboard: [[{ text: '🏠 إنهاء الدردشة والعودة', callback_data: 'back_main' }]] }
        });
    }

    if (q.data === 'mode_zak') {
        userState[chatId] = 'ZAK';
        bot.sendMessage(chatId, "🎨 **أنت الآن في قسم الزخرفة.** أرسل الاسم الآن لزخرفته.", {
            reply_markup: { inline_keyboard: [[{ text: '🏠 عودة', callback_data: 'back_main' }]] }
        });
    }

    if (q.data === 'back_main') {
        userState[chatId] = null;
        bot.sendMessage(chatId, "✨ تم العودة للقائمة الرئيسية. أرسل /start للإظهار.");
    }

    if (q.data.startsWith('sh_')) {
        const parts = q.data.split('_');
        const list = getZakhrafa(parts[2]);
        bot.sendMessage(chatId, `\`${list[parts[1]]}\``, { parse_mode: 'Markdown' });
    }

    bot.answerCallbackQuery(q.id);
});
                           
