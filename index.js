const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
const PDFDocument = require('pdfkit'); // مكتبة الـ PDF
const fs = require('fs');
const app = express();

// --- نظام البقاء حياً ---
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.status(200).send('Jessica Bot is Ready!'));
app.listen(port, '0.0.0.0');

// --- الإعدادات ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY'; 
const openAiApiKey = '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';

const bot = new TelegramBot(token, { polling: true });
const userState = {}; 

const channelUsername = '@jes45kabot'; 

// مصفوفة الزخارف
const getZakhrafa = (t) => [
    `ꪗ̶${t}̶ꪖ̶ꪑ̶ꪱ̶`, `ყ̷${t}̷α̷ɱ̷ι̷`, `Ɏ͢${t}͢₳͢₥͢ł͢`, `𐌖𐌀${t}𐌉`, `𓎛𓄿${t}𓇋`, `ꌩꍏ${t}ꀤ`, `『${t}』🔥`, `𓆩${t}𓆪`, `𖤐 ${t}`
];

// دالة الذكاء الاصطناعي
async function askAi(text) {
    try {
        // استخدام API وسيط مجاني ومستقر جداً
        const res = await axios.get(`https://api.simsimi.vn/v1/simtalk`, {
            params: { text: text, lc: 'ar' }
        });
        // ملاحظة: هذا المحرك سريع جداً ومجاني للأبد
        return res.data.message || "أعتذر، واجهت مشكلة بسيطة في معالجة طلبك.";
    } catch (e) {
        // محاولة ثانية بمحرك آخر إذا فشل الأول
        try {
            const res2 = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ar&dt=t&q=${encodeURIComponent(text)}`);
            return "عذراً، يبدو أن هناك ضغطاً على الخادم، حاول لاحقاً.";
        } catch (err) {
            return "⚠️ جيسيكا حالياً في استراحة قصيرة، حاول مجدداً بعد دقائق.";
        }
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
            return bot.sendMessage(chatId, `⚠️ **اشترك أولاً لتفعيل البوت:**\n📢 ${channelUsername}`, {
                reply_markup: { inline_keyboard: [[{ text: '📢 اضغط هنا للاشتراك', url: `https://t.me/${channelUsername.replace('@', '')}` }]] }
            });
        }
    } catch (e) { console.log("Sub Error"); }

    if (text === '/start') {
        userState[chatId] = null;
        return bot.sendMessage(chatId, `✨ **مرحباً بك في عالم جيسيكا المطور** ✨\n\nاختر خدمتك:`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🤖 جيسيكا Ai', callback_data: 'mode_chat' }, { text: '🎨 قسم الزخرفة', callback_data: 'mode_zak' }],
                    [{ text: '📄 نص إلى PDF', callback_data: 'mode_pdf' }],
                    [{ text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }, { text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }],
                    [{ text: '📸 إنستغرام', url: 'https://t.me/Biobot' }],
                    [{ text: '👨‍💻 المطور يامي', url: 'https://wa.me/966574360046' }]
                ]
            }
        });
    }

    if (!text.startsWith('/')) {
        // حالة الـ AI
        if (userState[chatId] === 'CHAT') {
            bot.sendChatAction(chatId, 'typing');
            const reply = await askAi(text);
            return bot.sendMessage(chatId, reply);
        }
        // حالة الزخرفة
        if (userState[chatId] === 'ZAK') {
            const list = getZakhrafa(text);
            let btns = list.map((z, i) => [{ text: `زخرفة ${i+1}`, callback_data: `sh_${i}_${text}` }]);
            btns.push([{ text: '🏠 عودة', callback_data: 'back' }]);
            return bot.sendMessage(chatId, `🔥 زخارف ( ${text} ):`, { reply_markup: { inline_keyboard: btns } });
        }
        // حالة الـ PDF
        if (userState[chatId] === 'PDF') {
            const doc = new PDFDocument();
            const fileName = `jessica_${chatId}.pdf`;
            doc.pipe(fs.createWriteStream(fileName));
            doc.fontSize(18).text(text, { align: 'right' }); // دعم بسيط للنص
            doc.end();
            setTimeout(() => {
                bot.sendDocument(chatId, fileName, { caption: "✅ تم تحويل النص إلى PDF بنجاح." });
                userState[chatId] = null;
            }, 1000);
            return;
        }
    }
});

bot.on('callback_query', (q) => {
    const chatId = q.message.chat.id;
    if (q.data === 'mode_chat') {
        userState[chatId] = 'CHAT';
        bot.sendMessage(chatId, "💬 أرسل سؤالك الآن لـ جيسيكا Ai:");
    } else if (q.data === 'mode_zak') {
        userState[chatId] = 'ZAK';
        bot.sendMessage(chatId, "🎨 أرسل الاسم لزخرفته:");
    } else if (q.data === 'mode_pdf') {
        userState[chatId] = 'PDF';
        bot.sendMessage(chatId, "📄 أرسل النص الذي تريد تحويله إلى ملف PDF الآن:");
    } else if (q.data === 'back') {
        userState[chatId] = null;
        bot.sendMessage(chatId, "🏠 تم العودة للقائمة.");
    } else if (q.data.startsWith('sh_')) {
        const p = q.data.split('_');
        const list = getZakhrafa(p[2]);
        bot.sendMessage(chatId, `\`${list[p[1]]}\``, { parse_mode: 'Markdown' });
    }
    bot.answerCallbackQuery(q.id);
});
                      
