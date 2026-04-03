const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// --- نظام البقاء حياً 24 ساعة (لخدمة Cron-job) ---
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.status(200).send('OK'));
app.listen(port, () => console.log(`Server active on ${port}`));

// --- إعدادات البوت والقنوات ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const bot = new TelegramBot(token, { polling: true });

const channelUsername = '@jes45kabot'; // قناة التيليجرام الأساسية
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; // قناة الواتساب
const devWhatsapp = 'https://wa.me/966574360046'; // واتساب المطور يامي

// --- ميزة الزخرفة الاحترافية ---
const decorateText = (text) => {
    return [
        `𝗝̸͢${text}̸𝝰⃪ִ֟፝🈞̥݄֯⃧⃞🕸️`,  // النمط المطلوب 1
        `ɑׅძ${text}ׅꪱ๋𐓣Swan🦢`, // النمط المطلوب 2
        `『${text}』🔥`,
        `⚡️ 𝖦${text}𝖱 ⚡️`,
        `✨ 𝒀𝑨𝑴𝑰 - ${text} ✨`,
        `⸽⸽ ${text} ⸽⸽ 💎`,
        `【${text}】👑`
    ];
};

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    if (!text) return;

    try {
        // 🛡️ فحص الاشتراك الإجباري (صارم جداً قبل أي خطوة)
        const member = await bot.getChatMember(channelUsername, userId);
        const isMember = ['member', 'administrator', 'creator'].includes(member.status);

        if (!isMember) {
            const joinMsg = `⚠️ **عذراً عزيزي! يجب عليك الانضمام لقناتنا أولاً لاستخدام البوت.**\n\nاشترك هنا: ${channelUsername}\n\nبعد الاشتراك، أرسل /start لتفعيل الخدمات.`;
            return bot.sendMessage(chatId, joinMsg, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: '📢 اضغط هنا للاشتراك في القناة', url: `https://t.me/${channelUsername.replace('@', '')}` }]]
                }
            });
        }

        // ✅ إذا كان مشتركاً:
        if (text === '/start') {
            const welcomeText = `✨ **مرحباً بك في بوت يامي الشامل V4** ✨\n\n🚀 **الخدمات المتاحة:**\n1️⃣ تحميل سريع (تيك توك، يوتيوب، إنستا).\n2️⃣ قسم الزخرفة الاحترافي (فقط أرسل اسمك).\n\n👇 **اختر ما تريد من الأسفل:**`;
            const opts = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }, { text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }],
                        [{ text: '📸 إنستقرام', url: 'https://t.me/Biobot' }],
                        [{ text: '💚 تابعنا على واتساب', url: whatsappChannel }],
                        [{ text: '👨‍💻 مطور البوت (يامي)', url: devWhatsapp }]
                    ]
                }
            };
            return bot.sendMessage(chatId, welcomeText, opts);
        }

        // ✨ قسم الزخرفة (يعمل تلقائياً عند إرسال اسم)
        if (!text.startsWith('/') && !text.startsWith('http')) {
            const list = decorateText(text);
            let response = `✨ **زخارف يامي الاحترافية لاسمك ( ${text} ):**\n\n*(اضغط على الزخرفة للنسخ)*\n\n`;
            list.forEach(item => response += `\`${item}\`\n\n`);
            return bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
        }

        // 💡 تنبيه التحميل
        if (text.startsWith('http')) {
            bot.sendMessage(chatId, "💡 **للتحميل بأفضل جودة:** استخدم أزرار المنصات في القائمة الرئيسية (أرسل /start).");
        }

    } catch (e) {
        bot.sendMessage(chatId, "⚠️ **تنبيه للمطور:** يجب رفع البوت 'مشرفاً' في القناة ليفعل نظام الاشتراك.");
    }
});
