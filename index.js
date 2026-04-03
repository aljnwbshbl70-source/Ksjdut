const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const axios = require('axios');

// --- تشغيل السيرفر 24 ساعة ---
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.status(200).send('OK'));
app.listen(port, '0.0.0.0', () => console.log(`Jessica Bot is Live!`));

// --- الإعدادات والمفاتيح ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const openAiApiKey = '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';

const bot = new TelegramBot(token, { polling: true });
const userState = {}; // لتنظيم أوضاع المستخدم (دردشة/زخرفة/صور)

const channelUsername = '@jes45kabot'; 
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; 
const devWhatsapp = 'https://wa.me/966574360046'; 

// --- قائمة الزخارف الضخمة (40+ شكل) ---
const getZakhrafa = (t) => [
    `ꪗ̶${t}̶ꪖ̶ꪑ̶ꪱ̶`, `ყ̷${t}̷α̷ɱ̷ι̷`, `Ɏ͢${t}͢₳͢₥͢ł͢`, `𐌖𐌀${t}𐌉`, `𓎛𓄿${t}𓇋`, `ꌩꍏ${t}ꀤ`, `Ⴤმო${t}ɿ`, `ყค${t}ɱɿ`, `ƴค${t}ɱɿ`, `YΛMI`, `YΔMI`, `YᗩMI`, `ⲨⲀⲘⲒ`,
    `${t}҉a҉m҉i҉💀⚡`, `${t}̸a̸m̸i̸☠️🖤`, `${t}͢a͢m͢i͢👁️‍🗨️💥`, `${t}̴a̴m̴i̴🧿⚔️`, `${t}̷͜a̷͜m̷͜i̷👻💣`, `${t}͜͞a͜͞m͜͞i͜͞🕷️🔥`, `${t}⃟a⃟m⃟i⃟💀🕸️`, `${t}͓̽a͓̽m͓̽i͓̽⚡🖤`, `${t}̾͟a̾͟m̾͟i̾͟👁️`,
    `${t}҉̷͜`, `${t}̸̛͢`, `${t}̡͜͞`, `${t}⃢̷͢`, `${t}͓̽̽͜`, `${t}̺̺͆`, `${t}̟̾͟`, `${t}̷͛͜`,
    `𝗝̸͢${t}̸𝝰⃪ִ֟፝🈞̥݄֯⃧⃞🕸️`, `ɑׅძ${t}ׅꪱ๋𐓣Swan🦢`, `『${t}』🔥`, `𓆩${t}𓆪`, `᭄${t}`, `${t}𖤍`, `${t}༒`, `𖤐 ${t}`, `${t}𓂀`
];

// --- وظائف الذكاء الاصطناعي ---
async function chatAi(text) {
    try {
        const res = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: text }]
        }, { headers: { 'Authorization': `Bearer ${openAiApiKey}` } });
        return res.data.choices[0].message.content;
    } catch (e) { return "⚠️ مشكلة في الـ AI، تأكد من رصيد المفتاح."; }
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text && !msg.photo && !msg.document) return;

    // 1. الاشتراك الإجباري
    try {
        const member = await bot.getChatMember(channelUsername, msg.from.id);
        if (!['member', 'administrator', 'creator'].includes(member.status)) {
            return bot.sendMessage(chatId, `⚠️ يجب الاشتراك أولاً في القناة لتشغيل البوت:\n📢 ${channelUsername}`, {
                reply_markup: { inline_keyboard: [[{ text: '📢 اشترك هنا', url: `https://t.me/${channelUsername.replace('@', '')}` }]] }
            });
        }
    } catch (e) { console.log("Sub Check Error"); }

    // 2. القائمة الرئيسية
    if (text === '/start' || text === 'الرجوع للقائمة 🏠') {
        userState[chatId] = null;
        const mainMsg = `✨ **عالم جيسيكا AI الاحترافي** ✨\n\nأهلاً بك يا ${msg.from.first_name}، اختر خدمتك:`;
        return bot.sendMessage(chatId, mainMsg, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🎨 قسم الزخرفة', callback_data: 'mode_zak' }, { text: '🤖 جيسيكا Ai', callback_data: 'ai_menu' }],
                    [{ text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }, { text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }],
                    [{ text: '📸 إنستا', url: 'https://t.me/Biobot' }],
                    [{ text: '🔄 تحويل صيغ (10MB)', callback_data: 'mode_conv' }],
                    [{ text: '💚 واتساب', url: whatsappChannel }, { text: '👨‍💻 المطور', url: devWhatsapp }]
                ],
                keyboard: [[{ text: 'الرجوع للقائمة 🏠' }]], resize_keyboard: true
            }
        });
    }

    // 3. معالجة النصوص بناءً على الوضع المختار
    if (text && !text.startsWith('/')) {
        // وضع الزخرفة
        if (userState[chatId] === 'mode_zak') {
            const list = getZakhrafa(text);
            let buttons = [];
            for (let i = 0; i < list.length; i += 2) {
                buttons.push([{ text: `شكل ${i+1} ⚡️`, callback_data: `show_${i}_${text}` }, { text: `شكل ${i+2} ✨`, callback_data: `show_${i+1}_${text}` }]);
            }
            return bot.sendMessage(chatId, `🔥 اختر زخرفة لـ (${text}):`, { reply_markup: { inline_keyboard: buttons } });
        }
        
        // وضع الدردشة AI
        if (userState[chatId] === 'mode_chat') {
            bot.sendChatAction(chatId, 'typing');
            const response = await chatAi(text);
            return bot.sendMessage(chatId, response);
        }
    }

    // 4. معالجة الصور (تعديل الصور AI)
    if (msg.photo && userState[chatId] === 'mode_photo') {
        bot.sendMessage(chatId, "🎨 استلمت الصورة والوصف، جاري معالجتها عبر جيسيكا AI... ⏳");
    }

    // 5. معالجة الملفات (تحويل الصيغ)
    if (msg.document && userState[chatId] === 'mode_conv') {
        if (msg.document.file_size > 10 * 1024 * 1024) return bot.sendMessage(chatId, "⚠️ الملف كبير! الحد 10 ميجا.");
        bot.sendMessage(chatId, "✅ ملفك جاهز، اختر الصيغة التي تريد التحويل إليها...");
    }
});

// --- معالجة الضغط على الأزرار ---
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'mode_zak') {
        userState[chatId] = 'mode_zak';
        bot.sendMessage(chatId, "🎨 **أرسل الاسم الآن لزخرفته بأكثر من 40 شكل:**");
    }

    if (data === 'ai_menu') {
        bot.editMessageText("🤖 **مرحباً بك في ذكاء جيسيكا**\nاختر ماذا تريد من المساعدة:", {
            chat_id: chatId, message_id: query.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖼️ تعديل صور', callback_data: 'mode_photo' }, { text: '💬 دردشة Ai', callback_data: 'mode_chat' }],
                    [{ text: '🏠 عودة', callback_data: 'back_main' }]
                ]
            }
        });
    }

    if (data === 'mode_chat') {
        userState[chatId] = 'mode_chat';
        bot.sendMessage(chatId, "اهلا أنا مساعد جـيـسـيـكـا تفضل مااذا تريد مساعده مني 🫶💗");
    }

    if (data === 'mode_photo') {
        userState[chatId] = 'mode_photo';
        bot.sendMessage(chatId, "🎨 **قسم تعديل الصور:**\nأرسل الصورة الآن واكتب وصف التعديل في الوصف (Caption).");
    }

    if (data.startsWith('show_')) {
        const p = data.split('_');
        const list = getZakhrafa(p[2]);
        bot.sendMessage(chatId, `\`${list[p[1]]}\``, { parse_mode: 'Markdown' });
    }
    
    bot.answerCallbackQuery(query.id);
});
       
