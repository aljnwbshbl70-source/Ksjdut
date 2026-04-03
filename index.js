const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const reshaper = require('arabic-persian-reshaper');
const bidi = require('bidi-js')();
const app = express();

// --- نظام البقاء حياً ---
app.get('/', (req, res) => res.status(200).send('Jessica Professional is Live!'));
app.listen(process.env.PORT || 3000);

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
                reply_markup: { inline_keyboard: [[{ text: '📢 اشتراك الآن', url: `https://t.me/${channelUsername.replace('@', '')}` }]] }
            });
        }
    } catch (e) { console.log("Sub Check Error"); }

    if (text === '/start') {
        userState[chatId] = null;
        return bot.sendMessage(chatId, `✨ **عالم جيسيكا للخدمات الاحترافية** ✨\n\nاختر خدمتك المفضلة:`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📄 إنشاء PDF احترافي', callback_data: 'mode_pdf' }, { text: '🎨 زخرفة الأسماء', callback_data: 'mode_zak' }],
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
            let btns = list.map((z, i) => [{ text: `زخرفة ${i+1} ✨`, callback_data: `sh_${i}_${text}` }]);
            btns.push([{ text: '🏠 العودة للقائمة', callback_data: 'back' }]);
            return bot.sendMessage(chatId, `🔥 زخارف ( ${text} ):`, { reply_markup: { inline_keyboard: btns } });
        }

        // حالة الـ PDF الاحترافي (دعم كامل للعربي)
        if (userState[chatId] === 'PDF') {
            bot.sendMessage(chatId, "⏳ جاري تنسيق النص ومعالجة اللغة العربية...");
            
            const doc = new PDFDocument({ margin: 50 });
            const fileName = `Jessica_Pro_${chatId}.pdf`;
            const writeStream = fs.createWriteStream(fileName);
            
            doc.pipe(writeStream);

            // العنوان
            doc.fontSize(22).text('Jessica Professional PDF', { align: 'center' });
            doc.moveDown();
            doc.strokeColor('#3498db').lineWidth(2).moveTo(50, 80).lineTo(550, 80).stroke();
            doc.moveDown(2);

            // معالجة النص العربي (تشبيك وعكس الاتجاه)
            try {
                const reshapedText = reshaper.ArabicReshaper.reshape(text);
                const finalArabicText = bidi.getReorderedText(reshapedText);
                
                doc.fontSize(16).text(finalArabicText, {
                    align: 'right', // لكي يظهر المحتوى من اليمين
                    lineGap: 5
                });
            } catch (err) {
                // إذا كان النص ليس عربياً (مثل الإنجليزية) يكتبه بشكل طبيعي
                doc.fontSize(16).text(text, { align: 'left' });
            }

            doc.end();

            writeStream.on('finish', () => {
                bot.sendDocument(chatId, fileName, { caption: "✅ تم إنشاء الملف بدعم كامل للغة العربية." }).then(() => {
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
        bot.sendMessage(chatId, "📄 **أرسل النص الآن** (عربي أو إنجليزي) ليتم تحويله لـ PDF منسق:");
    } else if (q.data === 'mode_zak') {
        userState[chatId] = 'ZAK';
        bot.sendMessage(chatId, "🎨 **أرسل الاسم للزخرفة:**");
    } else if (q.data === 'back') {
        userState[chatId] = null;
        bot.sendMessage(chatId, "🏠 عدنا للقائمة الرئيسية.");
    } else if (q.data.startsWith('sh_')) {
        const p = q.data.split('_');
        bot.sendMessage(chatId, `\`${getZakhrafa(p[2])[p[1]]}\``, { parse_mode: 'Markdown' });
    }
    bot.answerCallbackQuery(q.id);
});
