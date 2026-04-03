دconst TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// --- نظام البقاء حياً 24 ساعة (Render + Cron-job) ---
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.status(200).send('OK'));
app.listen(port, () => console.log(`Server running...`));

const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const bot = new TelegramBot(token, { polling: true });

const channelUsername = '@jes45kabot'; 
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; 
const devWhatsapp = 'https://wa.me/966574360046'; 

// --- مصفوفة الزخارف العملاقة (الأشكال المطلوبة بدقة) ---
const getZakhrafa = (t) => [
    `ꪗ̶${t}̶`, `ყ̷${t}̷`, `Ɏ͢${t}͢`, `𐌖𐌀${t}𐌉`, `𓎛𓄿${t}𓇋`, `ꌩꍏ${t}ꀤ`, `Ⴤმო${t}`, `ყค${t}ค`, `ƴค${t}ค`,
    `${t} ΛMI`, `${t} ΔMI`, `${t} ᗩMI`, `ⲨⲀ${t}Ⲓ`,
    `${t}҉💀⚡`, `${t}̸☠️🖤`, `${t}͢👁️‍🗨️💥`, `${t}̴🧿⚔️`, `${t}̷͜👻💣`, `${t}͜͞🕷️🔥`, `${t}⃟💀🕸️`, `${t}͓̽⚡🖤`, `${t}̾͟👁️`,
    `${t}҉̷͜`, `${t}̸̛͢`, `${t}̡͜͞`, `${t}̴̖͠`, `${t}⃢̷͢`, `${t}͓̽̽͜`, `${t}̺̺͆`, `${t}̟̾͟`, `${t}̷͛͜`,
    `𝗝̸͢${t}̸𝝰⃪ִ֟፝🈞̥݄֯⃧⃞🕸️`, `ɑׅძ${t}ׅꪱ๋𐓣Swan🦢`, `『${t}』🔥`, `𓆩${t}𓆪`, `᭄${t}`, `${t}𖤍`, `${t}༒`, `𖤐 ${t}`, `${t}𓂀`
];

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    if (!text) return;

    try {
        // فحص الاشتراك الإجباري (لا يتغير)
        const member = await bot.getChatMember(channelUsername, userId);
        const isMember = ['member', 'administrator', 'creator'].includes(member.status);

        if (!isMember) {
            return bot.sendMessage(chatId, `⚠️ **اشترك أولاً لتفتح الزخرفة:**\n📢 ${channelUsername}`, {
                reply_markup: { inline_keyboard: [[{ text: '📢 إضغط هنا للاشتراك', url: `https://t.me/${channelUsername.replace('@', '')}` }]] }
            });
        }

        if (text === '/start') {
            const opts = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }, { text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }],
                        [{ text: '📸 إنستا', url: 'https://t.me/Biobot' }],
                        [{ text: '👨‍💻 المطور يامي', url: devWhatsapp }]
                    ]
                }
            };
            return bot.sendMessage(chatId, `✨ **مرحباً بك في محرقة الزخارف V7** ✨\n\nأرسل اسمك الآن وشوف القوة!`, opts);
        }

        // تحويل النص إلى أزرار زخرفة فخمة
        if (!text.startsWith('/') && !text.startsWith('http')) {
            const list = getZakhrafa(text);
            const buttons = [];
            
            for (let i = 0; i < list.length; i += 2) {
                const row = [];
                row.push({ text: `فخامة ${i+1} ⚡️`, callback_data: `zak_${i}_${text}` });
                if (list[i+1]) row.push({ text: `فخامة ${i+2} ✨`, callback_data: `zak_${i+1}_${text}` });
                buttons.push(row);
            }

            return bot.sendMessage(chatId, `🔥 **إليك زخارف اسم ( ${text} ) القوية:**\n\nاختر ستايلك المفضل:`, {
                reply_markup: { inline_keyboard: buttons }
            });
        }

    } catch (e) { console.log("Logic error"); }
});

// تنفيذ الزخرفة عند الضغط
bot.on('callback_query', (query) => {
    const data = query.data;
    if (data.startsWith('zak_')) {
        const parts = data.split('_');
        const index = parseInt(parts[1]);
        const name = parts[2];
        const list = getZakhrafa(name);
        
        bot.sendMessage(query.message.chat.id, `✅ **تم استخراج الزخرفة بنجاح:**\n\n\`${list[index]}\`\n\n*(اضغط للنسخ)*`, { parse_mode: 'Markdown' });
        bot.answerCallbackQuery(query.id);
    }
});
