const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const app = express();

// --- نظام البقاء حياً ---
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.status(200).send('Jessica Bot is Ready!'));
app.listen(port, '0.0.0.0');

// --- الإعدادات ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY'; 
const bot = new TelegramBot(token, { polling: true });
const userState = {}; 

const channelUsername = '@jes45kabot'; 
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; 
const devWhatsapp = 'https://wa.me/966574360046'; 

// مصفوفة الزخارف
const getZakhrafa = (t) => [
    `ꪗ̶${t}̶ꪖ̶ꪑ̶ꪱ̶`, `ყ̷${t}̷α̷ɱ̷ι̷`, `Ɏ͢${t}͢₳͢₥͢ł͢`, `𐌖𐌀${t}𐌉`, `𓎛𓄿${t}𓇋`, `ꌩꍏ${t}ꀤ`, `『${t}』🔥`, `𓆩${t}𓆪`, `𖤐 ${t}`
];

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
    } catch (e) { console.log("Sub Error"); }

    // القائمة الرئيسية
    if (text === '/start') {
        userState[chatId] = null;
        return bot.sendMessage(chatId, `✨ **مرحباً بك في عالم جيسيكا المطور** ✨\n\nاختر الخدمة المطلوبة من الأزرار بالأسفل:`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📄 نص إلى PDF', callback_data: 'mode_pdf' }, { text: '🎨 قسم الزخرفة', callback_data: 'mode_zak' }],
                    [{ text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }, { text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }],
                    [{ text: '📸 إنستغرام', url: 'https://t.me/Biobot' }],
                    [{ text: '💚 تابعنا واتساب', url: whatsappChannel }],
                    [{ text: '👨‍💻 المطور يامي', url: devWhatsapp }]
                ]
            }
        });
    }

    if (!text.startsWith('/')) {
        // حالة الزخرفة
        if (userState[chatId] === 'ZAK') {
            const list = getZakhrafa(text);
            let btns = [];
            for (let i = 0; i < list.length; i += 2) {
                let row = [{ text: `فخامة ${i+1} ⚡️`, callback_data: `sh_${i}_${text}` }];
                if (list[i+1]) row.push({ text: `فخامة ${i+2} ✨`, callback_data: `sh_${i+1}_${text}` });
                btns.push(row);
            }
            btns.push([{ text: '🏠 عودة للقائمة', callback_data: 'back' }]);
            return bot.sendMessage(chatId, `🔥 **زخارف ( ${text} ):**`, { reply_markup: { inline_keyboard: btns } });
        }

        // حالة الـ PDF
        if (userState[chatId] === 'PDF') {
            bot.sendMessage(chatId, "⏳ جاري إنشاء الملف الخاص بك...");
            const doc = new PDFDocument();
            const fileName = `jessica_${chatId}.pdf`;
            const writeStream = fs.createWriteStream(fileName);
            doc.pipe(writeStream);
            doc.fontSize(18).text(text);
            doc.end();
            writeStream.on('finish', () => {
                bot.sendDocument(chatId, fileName, { caption: "✅ تم تحويل النص إلى PDF بنجاح." }).then(() => {
                    fs.unlinkSync(fileName);
                });
            });
            userState[chatId] = null;
        }
    }
});

bot.on('callback_query', (q) => {
    const chatId = q.message.chat.id;
    
    if (q.data === 'mode_zak') {
        userState[chatId] = 'ZAK';
        bot.sendMessage(chatId, "🎨 **أرسل الاسم الآن لزخرفته:**");
    } else if (q.data === 'mode_pdf') {
        userState[chatId] = 'PDF';
        bot.sendMessage(chatId, "📄 **أرسل النص الآن** لتحويله إلى ملف PDF:");
    } else if (q.data === 'back') {
        userState[chatId] = null;
        bot.sendMessage(chatId, "🏠 تم العودة للقائمة الرئيسية.");
    } else if (q.data.startsWith('sh_')) {
        const p = q.data.split('_');
        const list = getZakhrafa(p[2]);
        bot.sendMessage(chatId, `\`${list[p[1]]}\``, { parse_mode: 'Markdown' });
    }
    bot.answerCallbackQuery(q.id);
});
