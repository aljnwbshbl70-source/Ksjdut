const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
app.listen(process.env.PORT || 3000);

const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const bot = new TelegramBot(token, { polling: true });

// --- إعدادات المطور والقنوات ---
const channelUsername = '@jes45kabot'; // يوزر قناة التيليجرام للاشتراك الإجباري
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; // قناة الواتساب
const devWhatsapp = 'https://wa.me/966574360046'; // رابط مراسلتك واتساب مباشر

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    // 1. نظام التحقق من الاشتراك الإجباري
    try {
        const member = await bot.getChatMember(channelUsername, userId);
        const isMember = ['member', 'administrator', 'creator'].includes(member.status);

        if (!isMember) {
            return bot.sendMessage(chatId, `❌ **عذراً عزيزي، يجب عليك الاشتراك في قناة التحديثات أولاً لاستخدام البوت!**\n\nاشترك ثم أرسل /start`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '📢 إضغط هنا للاشتراك في القناة', url: `https://t.me/${channelUsername.replace('@', '')}` }]
                    ]
                }
            });
        }
    } catch (e) {
        // إذا لم يكن البوت مشرفاً في القناة سيظهر هذا التحذير للمطور
        console.log("⚠️ تأكد من رفع البوت مشرفاً في القناة ليعمل الاشتراك الإجباري.");
    }

    // 2. الرد عند الضغط على Start أو إرسال رابط
    if (text === '/start') {
        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🎬 تيك توك', url: 'https://t.me/SaveAsBot' }, { text: '📺 يوتيوب', url: 'https://t.me/Downloadstorybot' }],
                    [{ text: '📸 إنستقرام', url: 'https://t.me/Biobot' }],
                    [{ text: '💚 قناة الواتساب (جديد)', url: whatsappChannel }],
                    [{ text: '👨‍💻 مطور البوت (يامي)', url: devWhatsapp }]
                ]
            }
        };
        bot.sendMessage(chatId, "🚀 **مرحباً بك في بوابة يامي للتحميل V3**\n\nتم التحقق من اشتراكك بنجاح! اختر المنصة التي تريد التحميل منها:", { parse_mode: 'Markdown', ...opts });
    } 
    else if (text && text.startsWith('http')) {
        bot.sendMessage(chatId, "💡 **تذكير:** لضمان أفضل سرعة، استخدم الأزرار في القائمة (أرسل /start) للتحميل المباشر عبر سيرفراتنا.");
    }
});
