const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
const app = express();

// --- نظام البقاء حياً ---
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.status(200).send('Jessica is Live!'));
app.listen(port, '0.0.0.0');

// --- الإعدادات (التوكنات الخاصة بك) ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY'; 
const openAiApiKey = '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';

const bot = new TelegramBot(token, { polling: true });
const userState = {}; 

const channelUsername = '@jes45kabot'; 
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; 
const devWhatsapp = 'https://wa.me/966574360046'; 

// مصفوفة الزخارف (40+ شكل)
const getZakhrafa = (t) => [
    `ꪗ̶${t}̶ꪖ̶ꪑ̶ꪱ̶`, `ყ̷${t}̷α̷ɱ̷ι̷`, `Ɏ͢${t}͢₳͢₥͢ł͢`, `𐌖𐌀${t}𐌉`, `𓎛𓄿${t}𓇋`, `ꌩꍏ${t}ꀤ`, `Ⴤმო${t}ɿ`, `ყค${t}ɱɿ`,
    `${t} ΛMI`, `${t} ΔMI`, `${t} ᗩMI`, `ⲨⲀ${t}Ⲓ`,
    `${t}҉a҉m҉i҉💀⚡`, `${t}̸a̸m̸i̸☠️🖤`, `${t}͢a͢m͢i͢👁️‍🗨️💥`, `『${t}』🔥`, `𓆩${t}𓆪`, `𖤐 ${t}`
];

// --- دالة ChatGPT المحدثة بمفتاحك الجديد ---
async function askAi(text) {
    try {
        const res = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are Jessica, a helpful and polite AI assistant.' },
                { role: 'user', content: text }
            ]
        }, { 
            headers: { 
                'Authorization': `Bearer ${openAiApiKey}`, 
                'Content-Type': 'application/json' 
            } 
        });
        return res.data.choices[0].message.content;
    } catch (e) { 
        console.log("AI Error:", e.response ? e.response.data : e.message);
        return "⚠️ عذراً، يبدو أن هناك مشكلة في مفتاح الـ AI الحالي. يرجى التأكد من الرصيد."; 
    }
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text) return;

    // فحص الاشتراك الإجباري
    try {
        const member = await bot.getChatMember(channelUsername, msg.from.id);
        if (!['member', 'administrator', 'creator'].includes(member.status)) {
            return bot.sendMessage(chatId, `⚠️ **يجب الاشتراك أولاً لتفعيل البوت:**\n📢 ${channelUsername}`, {
                reply_markup: { inline_keyboard: [[{ text: '📢 اضغط هنا للاشتراك', url: `https://t.me/${channelUsername.replace('@', '')}` }]] }
            });
        }
    } catch (e) { console.log("Sub Check Error"); }

    if (text === '/start') {
        userState[chatId] = null;
        return bot.sendMessage(chatId, `✨ **مرحباً بك في عالم جيسيكا المطور** ✨\n\nأهلاً بك يا ${msg.from.first_name}، اختر خدمتك من الأزرار الشفافة بالأسفل:`, {
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
        // وضع الدردشة
        if (userState[chatId] === 'CHAT') {
            bot.sendChatAction(chatId, 'typing');
            const reply = await askAi(text);
            return bot.sendMessage(chatId, reply);
        }

        // وضع الزخرفة
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
        bot.sendMessage(chatId, "أهلاً بك! أنا مساعد جيسيكا الذكي، تفضل بماذا تريد مساعدتي؟ 🫶💗", {
            reply_markup: { inline_keyboard: [[{ text: '🏠 إنهاء الدردشة والعودة', callback_data: 'back_main' }]] }
        });
    }
    if (q.data === 'mode_zak') {
        userState[chatId] = 'ZAK';
        bot.sendMessage(chatId, "🎨 **قسم الزخرفة:** أرسل الاسم الآن لزخرفته.", {
            reply_markup: { inline_keyboard: [[{ text: '🏠 عودة للرئيسية', callback_data: 'back_main' }]] }
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
            
