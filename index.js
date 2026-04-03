const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const axios = require('axios');

// --- نظام البقاء حياً 24 ساعة ---
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.status(200).send('OK'));
app.listen(port, '0.0.0.0', () => console.log(`Server is running...`));

// --- إعدادات التوكن والمفاتيح ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const openAiApiKey = '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';

const bot = new TelegramBot(token, { polling: true });

const channelUsername = '@jes45kabot'; 
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; 
const devWhatsapp = 'https://wa.me/966574360046'; 

// --- مصفوفة الزخارف القوية ---
const getZakhrafa = (t) => [
    `ꪗ̶${t}̶ꪖ̶ꪑ̶ꪱ̶`, `ყ̷${t}̷α̷ɱ̷ι̷`, `Ɏ͢${t}͢₳͢₥͢ł͢`, `𐌖𐌀${t}𐌉`, `𓎛𓄿${t}𓇋`, `ꌩꍏ${t}ꀤ`, `Ⴤმო${t}ɿ`, `ყค${t}ɱɿ`, `ƴค${t}ɱɿ`,
    `${t} ΛMI`, `${t} ΔMI`, `${t} ᗩMI`, `ⲨⲀ${t}Ⲓ`,
    `${t}҉a҉m҉i҉💀⚡`, `${t}̸a̸m̸i̸☠️🖤`, `${t}͢a͢m͢i͢👁️‍🗨️💥`, `${t}̴a̴m̴i̴🧿⚔️`, `${t}̷͜a̷͜m̷͜i̷👻💣`, `${t}͜͞a͜͞m͜͞i͜͞🕷️🔥`, `${t}⃟a⃟m⃟i⃟💀🕸️`, `${t}͓̽a͓̽m͓̽i͓̽⚡🖤`, `${t}̾͟a̾͟m̾͟i̾͟👁️`,
    `${t}҉̷͜`, `${t}̸̛͢`, `${t}̡͜͞`, `${t}̴̖͠`, `${t}⃢̷͢`, `${t}͓̽̽͜`, `${t}̺̺͆`, `${t}̟̾͟`, `${t}̷͛͜`,
    `𝗝̸͢${t}̸𝝰⃪ִ֟፝🈞̥݄֯⃧⃞🕸️`, `ɑׅძ${t}ׅꪱ๋𐓣Swan🦢`, `『${t}』🔥`, `𓆩${t}𓆪`, `᭄${t}`, `${t}𖤍`, `${t}༒`, `𖤐 ${t}`, `${t}𓂀`
];

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    if (!text) return;

    try {
        const member = await bot.getChatMember(channelUsername, userId);
        const isMember = ['member', 'administrator', 'creator'].includes(member.status);

        if (!isMember) {
            return bot.sendMessage(chatId, `⚠️ **يجب عليك الاشتراك في القناة أولاً:**\n\n📢 ${channelUsername}`, {
                reply_markup: { inline_keyboard: [[{ text: '📢 إضغط هنا للاشتراك', url: `https://t.me/${channelUsername.replace('@', '')}` }]] }
            });
        }

        if (text === '/start') {
            const welcomeMsg = `✨ **مرحباً بك في عالم جيسيكا** ✨\n\n🚀 **أقوى بوت تحميل وزخرفة وذكاء اصطناعي:**\n• تنزيل من جميع المواقع.\n• زخرفة احترافية (40+ شكل).\n• قسم ذكاء اصطناعي متكامل.\n\n👇 **اختر الخدمة المطلوبة من الأزرار:**`;
            
            return bot.sendMessage(chatId, welcomeMsg, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }, { text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }],
                        [{ text: '📸 إنستقرام', url: 'https://t.me/Biobot' }],
                        [{ text: '🔄 تغيير صيغ الملفات', callback_data: 'convert_info' }],
                        [{ text: '🤖 جيسيكا Ai', callback_data: 'ai_menu' }],
                        [{ text: '💚 تابعنا على واتساب', url: whatsappChannel }],
                        [{ text: '👨‍💻 المطور يامي', url: devWhatsapp }]
                    ]
                }
            });
        }

        if (!text.startsWith('/') && !text.startsWith('http')) {
            const list = getZakhrafa(text);
            const buttons = [];
            for (let i = 0; i < list.length; i += 2) {
                const row = [];
                row.push({ text: `فخامة ${i+1} ⚡️`, callback_data: `zak_${i}_${text}` });
                if (list[i+1]) row.push({ text: `فخامة ${i+2} ✨`, callback_data: `zak_${i+1}_${text}` });
                buttons.push(row);
            }
            return bot.sendMessage(chatId, `🔥 **زخارف اسم ( ${text} ):**`, { reply_markup: { inline_keyboard: buttons } });
        }
    } catch (e) { console.log("Error logic"); }
});

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // قائمة AI الرئيسية
    if (data === 'ai_menu') {
        const aiButtons = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖼️ تعديل صور', callback_data: 'ai_photo' }, { text: '💬 دردشة Ai', callback_data: 'ai_chat' }],
                    [{ text: '🏠 العودة للقائمة', callback_data: 'back_main' }]
                ]
            }
        };
        bot.editMessageText("🤖 **مرحباً بك في قسم الذكاء الاصطناعي**\nاختر نوع الخدمة التي تريدها:", {
            chat_id: chatId,
            message_id: query.message.message_id,
            reply_markup: aiButtons.reply_markup
        });
    }

    // خيار تعديل الصور
    if (data === 'ai_photo') {
        bot.sendMessage(chatId, "🎨 **قسم تعديل الصور:**\nيرجى إرسال الصورة الآن مع كتابة وصف التعديل المطلوب في " + "`وصف الصورة`" + ".");
        bot.answerCallbackQuery(query.id);
    }

    // خيار الدردشة
    if (data === 'ai_chat') {
        bot.sendMessage(chatId, "اهلا أنا مساعد جـيـسـيـكـا تفضل مااذا تريد مساعده مني 🫶💗");
        bot.answerCallbackQuery(query.id);
    }

    // العودة للقائمة الرئيسية
    if (data === 'back_main') {
        bot.editMessageText("✨ اختر الخدمة المطلوبة:", {
            chat_id: chatId,
            message_id: query.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }, { text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }],
                    [{ text: '📸 إنستقرام', url: 'https://t.me/Biobot' }],
                    [{ text: '🔄 تغيير صيغ الملفات', callback_data: 'convert_info' }],
                    [{ text: '🤖 جيسيكا Ai', callback_data: 'ai_menu' }],
                    [{ text: '💚 تابعنا على واتساب', url: whatsappChannel }]
                ]
            }
        });
    }

    if (data.startsWith('zak_')) {
        const parts = data.split('_');
        const index = parseInt(parts[1]);
        const name = parts[2];
        const list = getZakhrafa(name);
        bot.sendMessage(chatId, `\`${list[index]}\``, { parse_mode: 'Markdown' });
        bot.answerCallbackQuery(query.id);
    }
});
       
