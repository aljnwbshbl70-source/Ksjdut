const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const app = express();

// --- نظام البقاء حياً ---
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.status(200).send('Jessica PDF Expert is Ready!'));
app.listen(port, '0.0.0.0');

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

    // فحص الاشتراك
    try {
        const member = await bot.getChatMember(channelUsername, msg.from.id);
        if (!['member', 'administrator', 'creator'].includes(member.status)) {
            return bot.sendMessage(chatId, `⚠️ **اشترك أولاً لتفعيل البوت:**\n📢 ${channelUsername}`, {
                reply_markup: { inline_keyboard: [[{ text: '📢 اشتراك', url: `https://t.me/${channelUsername.replace('@', '')}` }]] }
            });
        }
    } catch (e) {}

    if (text === '/start') {
        userState[chatId] = null;
        return bot.sendMessage(chatId, `✨ **عالم جيسيكا للخدمات الاحترافية** ✨\n\nاختر الخدمة المطلوبة:`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📄 إنشاء PDF احترافي', callback_data: 'mode_pdf' }, { text: '🎨 زخرفة الأسماء', callback_data: 'mode_zak' }],
                    [{ text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }, { text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }],
                    [{ text: '📸 إنستغرام', url: 'https://t.me/Biobot' }],
                    [{ text: '💚 قناة الواتساب', url: whatsappChannel }],
                    [{ text: '👨‍💻 المطور يامي', url: devWhatsapp }]
                ]
            }
        });
    }

    if (!text.startsWith('/')) {
        if (userState[chatId] === 'ZAK') {
            const list = getZakhrafa(text);
            let btns = [];
            for (let i = 0; i < list.length; i += 2) {
                btns.push([
                    { text: `زخرفة ${i+1} ⚡️`, callback_data: `sh_${i}_${text}` },
                    { text: `زخرفة ${i+2} ✨`, callback_data: `sh_${i+1}_${text}` }
                ]);
            }
            btns.push([{ text: '🏠 عودة للقائمة', callback_data: 'back' }]);
            return bot.sendMessage(chatId, `🔥 زخارف ( ${text} ):`, { reply_markup: { inline_keyboard: btns } });
        }

        // --- نظام الـ PDF الاحترافي ---
        if (userState[chatId] === 'PDF') {
            bot.sendMessage(chatId, "⏳ جاري معالجة النص وإنشاء الملف...");
            
            const doc = new PDFDocument({ margin: 50 });
            const fileName = `Jessica_Doc_${chatId}.pdf`;
            const writeStream = fs.createWriteStream(fileName);
            
            doc.pipe(writeStream);

            // إضافة عنوان وتنسيق احترافي
            doc.fontSize(25).fillColor('#2c3e50').text('Jessica Professional PDF', { align: 'center' });
            doc.moveDown();
            doc.strokeColor('#3498db').lineWidth(2).moveTo(50, 100).lineTo(550, 100).stroke();
            doc.moveDown();

            // محتوى الملف
            doc.fontSize(14).fillColor('#000000').text(text, {
                align: 'left', // للغة الإنجليزية واللغات الأخرى
                lineGap: 5
            });

            doc.end();

            writeStream.on('finish', () => {
                bot.sendDocument(chatId, fileName, { 
                    caption: "✅ تم إنشاء ملف PDF الخاص بك بنجاح وبشكل احترافي." 
                }).then(() => {
                    fs.unlinkSync(fileName);
                });
            });
            userState[chatId] = null;
        }
    }
});

bot.on('callback_query', (q) => {
    const chatId = q.message.chat.id;
    if (q.data === 'mode_pdf') {
        userState[chatId] = 'PDF';
        bot.sendMessage(chatId, "📄 **أرسل النص الآن** ليتم تحويله إلى PDF احترافي:");
    } else if (q.data === 'mode_zak') {
        userState[chatId] = 'ZAK';
        bot.sendMessage(chatId, "🎨 **أرسل الاسم للزخرفة:**");
    } else if (q.data === 'back') {
        userState[chatId] = null;
        bot.sendMessage(chatId, "🏠 تم العودة للقائمة.");
    } else if (q.data.startsWith('sh_')) {
        const p = q.data.split('_');
        bot.sendMessage(chatId, `\`${getZakhrafa(p[2])[p[1]]}\``, { parse_mode: 'Markdown' });
    }
    bot.answerCallbackQuery(q.id);
});
