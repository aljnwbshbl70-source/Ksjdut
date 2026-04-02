const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// --- إعدادات السيرفر (خفيفة جداً لمنع فشل Cron-job) ---
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.status(200).send('OK'); // رد مختصر جداً لضمان عدم توقف الخدمة
});
app.listen(port, () => console.log(`Server is active on port ${port}`));

// --- توكن البوت الخاص بك ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const bot = new TelegramBot(token, { polling: true });

// --- إعدادات القنوات والمطور ---
const channelUsername = '@jes45kabot'; // قناة الاشتراك الإجباري
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; // قناة الواتساب
const devWhatsapp = 'https://wa.me/966574360046'; // واتساب المطور

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    if (!text) return;

    try {
        // 1. فحص الاشتراك الإجباري
        const member = await bot.getChatMember(channelUsername, userId);
        const isMember = ['member', 'administrator', 'creator'].includes(member.status);

        if (!isMember) {
            return bot.sendMessage(chatId, `⚠️ **يجب عليك الانضمام لعائلة يامي أولاً!**\n\nاشترك في القناة الرسمية لتفعيل البوت:\n📢 ${channelUsername}`, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: '📢 إضغط هنا للاشتراك', url: `https://t.me/${channelUsername.replace('@', '')}` }]]
                }
            });
        }

        // 2. الرد عند البداية
        if (text === '/start') {
            const welcomeMsg = `✨ **مرحباً بك في عالم يامي للتحميل الذكي V3** ✨\n\n🚀 **أسرع بوت تحميل متكامل بين يديك الآن!**\n\nلقد قمنا بدمج أقوى السيرفرات العالمية لنوفر لك تجربة فريدة بجودة عالية.\n\n👇 **اختر المنصة التي تريد التحميل منها:**`;
            
            const opts = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🎬 تيك توك (بدون حقوق)', url: 'https://t.me/SaveAsBot' }],
                        [{ text: '📺 يوتيوب (جودة عالية)', url: 'https://t.me/Downloadstorybot' }],
                        [{ text: '📸 إنستقرام & بحث ذكي', url: 'https://t.me/Biobot' }],
                        [{ text: '💚 قناة واتساب (قَـلْـب_مَـهْجُـوْر)', url: whatsappChannel }],
                        [{ text: '👨‍💻 تواصل مع المطور (يامي)', url: devWhatsapp }]
                    ]
                }
            };
            return bot.sendMessage(chatId, welcomeMsg, opts);
        }

        // 3. تنبيه عند إرسال رابط مباشر
        if (text.startsWith('http')) {
            bot.sendMessage(chatId, "💡 **عزيزي المستخدم:** لضمان أفضل جودة، استخدم أزرار المنصات أعلاه (أرسل /start).");
        }

    } catch (e) {
        bot.sendMessage(chatId, "⚠️ تأكد من رفع البوت 'مشرفاً' في القناة ليعمل الاشتراك الإجباري.");
    }
});
