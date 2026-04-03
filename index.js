const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
const app = express();

// --- نظام البقاء حياً 24 ساعة ---
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.status(200).send('Jessica Bot is Active!'));
app.listen(port, '0.0.0.0');

// --- الإعدادات والمفاتيح ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const openAiApiKey = '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';

const bot = new TelegramBot(token, { polling: true });
const userState = {}; // لتتبع حالة المستخدم (دردشة أو زخرفة)

const channelUsername = '@jes45kabot'; 
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; 
const devWhatsapp = 'https://wa.me/966574360046'; 

// --- مصفوفة الزخارف القوية ---
const getZakhrafa = (t) => [
    `ꪗ̶${t}̶ꪖ̶ꪑ̶ꪱ̶`, `ყ̷${t}̷α̷ɱ̷ι̷`, `Ɏ͢${t}͢₳͢₥͢ł͢`, `𐌖𐌀${t}𐌉`, `𓎛𓄿${t}𓇋`, `ꌩꍏ${t}ꀤ`, `Ⴤმო${t}ɿ`, `ყค${t}ɱɿ`,
    `${t}҉a҉m҉i҉💀⚡`, `${t}̸a̸m̸i̸☠️🖤`, `${t}͢a͢m͢i͢👁️‍🗨️💥`, `𝗝̸͢${t}̸𝝰⃪ִ֟፝🈞̥݄֯⃧⃞🕸️`, `『${t}』🔥`, `𓆩${t}𓆪`, `𖤐 ${t}`, `${t}𓂀`
];

// --- دالة الدردشة مع الذكاء الاصطناعي ---
async function askAi(text) {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "أنت مساعد ذكي ولطيف اسمك مساعد جيسيكا." },
                { role: "user", content: text }
            ]
        }, {
            headers: { 'Authorization': `Bearer ${openAiApiKey}`, 'Content-Type': 'application/json' }
        });
        return response.data.choices[0].message.content;
    } catch (e) {
        return "⚠️ عذراً، واجهت مشكلة في الاتصال بالذكاء الاصطناعي. تأكد من رصيد الحساب.";
    }
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    if (!text) return;

    // --- فحص الاشتراك الإجباري ---
    try {
        const member = await bot.getChatMember(channelUsername, userId);
        const isMember = ['member', 'administrator', 'creator'].includes(member.status);

        if (!isMember) {
            return bot.sendMessage(chatId, `⚠️ **يجب عليك الاشتراك في القناة أولاً لتتمكن من استخدام البوت:**\n\n📢 ${channelUsername}`, {
                reply_markup: { inline_keyboard: [[{ text: '📢 إضغط هنا للاشتراك', url: `https://t.me/${channelUsername.replace('@', '')}` }]] }
            });
        }

        // --- القائمة الرئيسية ---
        if (text === '/start' || text === 'الرجوع للقائمة 🏠') {
            userState[chatId] = null; // إعادة تعيين الحالة
            const welcomeMsg = `✨ **مرحباً بك في عالم جيسيكا** ✨\n\n🚀 **أقوى بوت متكامل:**\n• تحميل، زخرفة، وذكاء اصطناعي.\n\n👇 **اختر القسم المطلوب:**`;
            
            return bot.sendMessage(chatId, welcomeMsg, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '💬 دردشة جيسيكا Ai', callback_data: 'ai_chat' }],
                        [{ text: '🎨 قسم الزخرفة', callback_data: 'zak_section' }],
                        [{ text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }, { text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }],
                        [{ text: '🔄 تغيير صيغ الملفات', callback_data: 'convert_info' }],
                        [{ text: '💚 تابعنا على واتساب', url: whatsappChannel }],
                        [{ text: '👨‍💻 المطور يامي', url: devWhatsapp }]
                    ],
                    keyboard: [[{ text: 'الرجوع للقائمة 🏠' }]],
                    resize_keyboard: true
                }
            });
        }

        // --- معالجة النص بناءً على القسم المختار ---
        if (!text.startsWith('/')) {
            // إذا كان المستخدم في قسم الدردشة
            if (userState[chatId] === 'AI_CHAT') {
                bot.sendChatAction(chatId, 'typing');
                const reply = await askAi(text);
                return bot.sendMessage(chatId, reply);
            }

            // إذا كان المستخدم في قسم الزخرفة
            if (userState[chatId] === 'ZAKHRAFA') {
                const list = getZakhrafa(text);
                const buttons = [];
                for (let i = 0; i < list.length; i += 2) {
                    const row = [{ text: `شكل ${i+1} ⚡️`, callback_data: `zak_${i}_${text}` }];
                    if (list[i+1]) row.push({ text: `شكل ${i+2} ✨`, callback_data: `zak_${i+1}_${text}` });
                    buttons.push(row);
                }
                return bot.sendMessage(chatId, `🔥 **اختر شكل الزخرفة لاسم ( ${text} ):**`, { reply_markup: { inline_keyboard: buttons } });
            }
        }

    } catch (e) { console.log("Error in message handler"); }
});

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    
    // تفعيل قسم الدردشة
    if (data === 'ai_chat') {
        userState[chatId] = 'AI_CHAT';
        bot.sendMessage(chatId, "اهلا أنا مساعد جـيـسـيـكـا تفضل مااذا تريد مساعده مني 🫶💗");
        bot.answerCallbackQuery(query.id);
    }

    // تفعيل قسم الزخرفة
    if (data === 'zak_section') {
        userState[chatId] = 'ZAKHRAFA';
        bot.sendMessage(chatId, "🎨 **قسم الزخرفة الاحترافية:**\nأرسل الآن الاسم الذي تريد زخرفته.");
        bot.answerCallbackQuery(query.id);
    }

    if (data === 'convert_info') {
        bot.sendMessage(chatId, "📁 ** قسم تغيير الصيغ خربان موقتا:**\nأرسل ملفك الآن (بحد أقصى 10 ميجا) وسنقوم بمساعدتك في تحويله.");
        bot.answerCallbackQuery(query.id);
    }

    // إرسال الاسم المزخرف
    if (data.startsWith('zak_')) {
        const parts = data.split('_');
        const index = parseInt(parts[1]);
        const name = parts[2];
        const list = getZakhrafa(name);
        bot.sendMessage(chatId, `\`${list[index]}\``, { parse_mode: 'Markdown' });
        bot.answerCallbackQuery(query.id);
    }
});
                            
