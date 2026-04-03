const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
const app = express();

// --- نظام البقاء حياً 24 ساعة ---
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.status(200).send('OK'));
app.listen(port, '0.0.0.0', () => console.log(`Server is running...`));

// --- الإعدادات والمفاتيح ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const openAiApiKey = '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';
const bot = new TelegramBot(token, { polling: true });

const userState = {}; // لتتبع حالة المستخدم (دردشة/زخرفة)
const channelUsername = '@jes45kabot'; 
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; 
const devWhatsapp = 'https://wa.me/966574360046'; 

// --- مصفوفة الزخارف القوية (40+ شكل) ---
const getZakhrafa = (t) => [
    `ꪗ̶${t}̶ꪖ̶ꪑ̶ꪱ̶`, `ყ̷${t}̷α̷ɱ̷ι̷`, `Ɏ͢${t}͢₳͢₥͢ł͢`, `𐌖𐌀${t}𐌉`, `𓎛𓄿${t}𓇋`, `ꌩꍏ${t}ꀤ`, `Ⴤმო${t}ɿ`, `ყค${t}ɱɿ`, `ƴค${t}ɱɿ`,
    `${t} ΛMI`, `${t} ΔMI`, `${t} ᗩMI`, `ⲨⲀ${t}Ⲓ`,
    `${t}҉a҉m҉i҉💀⚡`, `${t}̸a̸m̸i̸☠️🖤`, `${t}͢a͢m͢i͢👁️‍🗨️💥`, `${t}̴a̴m̴i̴🧿⚔️`, `${t}̷͜a̷͜m̷͜i̷👻💣`, `${t}͜͞a͜͞m͜͞i͜͞🕷️🔥`, `${t}⃟a⃟m⃟i⃟💀🕸️`, `${t}͓̽a͓̽m͓̽i͓̽⚡🖤`, `${t}̾͟a̾͟m̾͟i̾͟👁️`,
    `${t}҉̷͜`, `${t}̸̛͢`, `${t}̡͜͞`, `${t}̴̖͠`, `${t}⃢̷͢`, `${t}͓̽̽͜`, `${t}̺̺͆`, `${t}̟̾͟`, `${t}̷͛͜`,
    `𝗝̸͢${t}̸𝝰⃪ִ֟፝🈞̥݄֯⃧⃞🕸️`, `ɑׅძ${t}ׅꪱ๋𐓣Swan🦢`, `『${t}』🔥`, `𓆩${t}𓆪`, `᭄${t}`, `${t}𖤍`, `${t}༒`, `𖤐 ${t}`, `${t}𓂀`
];

// --- وظيفة الذكاء الاصطناعي (دردشة فقط) ---
async function chatWithAi(text) {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: text }]
        }, {
            headers: { 'Authorization': `Bearer ${openAiApiKey}`, 'Content-Type': 'application/json' }
        });
        return response.data.choices[0].message.content;
    } catch (e) {
        return "⚠️ عذراً، مساعد جيسيكا الذكي مشغول حالياً، يرجى المحاولة لاحقاً.";
    }
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    if (!text) return;

    try {
        // --- الاشتراك الإجباري ---
        const member = await bot.getChatMember(channelUsername, userId);
        const isMember = ['member', 'administrator', 'creator'].includes(member.status);

        if (!isMember) {
            return bot.sendMessage(chatId, `⚠️ **يجب عليك الاشتراك في القناة أولاً:**\n\n📢 ${channelUsername}`, {
                reply_markup: { inline_keyboard: [[{ text: '📢 إضغط هنا للاشتراك', url: `https://t.me/${channelUsername.replace('@', '')}` }]] }
            });
        }

        // --- القائمة الرئيسية ---
        if (text === '/start' || text === 'الرجوع للقائمة 🏠') {
            userState[chatId] = null;
            const welcomeMsg = `✨ **مرحباً بك في عالم جيسيكا** ✨\n\nأهلاً بك يا ${msg.from.first_name}، اختر خدمتك من الأزرار:`;
            
            return bot.sendMessage(chatId, welcomeMsg, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }, { text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }],
                        [{ text: '📸 إنستقرام', url: 'https://t.me/Biobot' }],
                        [{ text: '🎨 قسم الزخرفة', callback_data: 'go_zak' }],
                        [{ text: '🤖 جيسيكا Ai (دردشة)', callback_data: 'go_ai' }],
                        [{ text: '🔄 تغيير صيغ الملفات', callback_data: 'convert_info' }],
                        [{ text: '💚 تابعنا على واتساب', url: whatsappChannel }],
                        [{ text: '👨‍💻 المطور يامي', url: devWhatsapp }]
                    ],
                    keyboard: [[{ text: 'الرجوع للقائمة 🏠' }]], resize_keyboard: true
                }
            });
        }

        // --- منطق الأقسام (فقط إذا لم يكن أمراً) ---
        if (!text.startsWith('/')) {
            // حالة الدردشة بالذكاء الاصطناعي
            if (userState[chatId] === 'AI_MODE') {
                bot.sendChatAction(chatId, 'typing');
                const reply = await chatWithAi(text);
                return bot.sendMessage(chatId, reply);
            }

            // حالة الزخرفة
            if (userState[chatId] === 'ZAK_MODE') {
                const list = getZakhrafa(text);
                const buttons = [];
                for (let i = 0; i < list.length; i += 2) {
                    const row = [{ text: `فخامة ${i+1} ⚡️`, callback_data: `zak_${i}_${text}` }];
                    if (list[i+1]) row.push({ text: `فخامة ${i+2} ✨`, callback_data: `zak_${i+1}_${text}` });
                    buttons.push(row);
                }
                return bot.sendMessage(chatId, `🔥 **زخارف اسم ( ${text} ):**`, { reply_markup: { inline_keyboard: buttons } });
            }
        }

    } catch (e) { console.log("Logic Error"); }
});

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    
    if (data === 'go_ai') {
        userState[chatId] = 'AI_MODE';
        bot.sendMessage(chatId, "اهلا أنا مساعد جـيـسـيـكـا تفضل مااذا تريد مساعده مني 🫶💗");
    }

    if (data === 'go_zak') {
        userState[chatId] = 'ZAK_MODE';
        bot.sendMessage(chatId, "🎨 **قسم الزخرفة الاحترافية:**\nأرسل الآن الاسم الذي تريد زخرفته.");
    }

    if (data === 'convert_info') {
        bot.sendMessage(chatId, "📁 **قسم تغيير الصيغ:**\nأرسل ملفك الآن (بحد أقصى 10 ميجا) وسنقوم بمساعدتك في تحويله.");
    }

    if (data.startsWith('zak_')) {
        const parts = data.split('_');
        const index = parseInt(parts[1]);
        const name = parts[2];
        const list = getZakhrafa(name);
        bot.sendMessage(chatId, `\`${list[index]}\``, { parse_mode: 'Markdown' });
    }
    bot.answerCallbackQuery(query.id);
});
       
