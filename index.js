const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
app.listen(process.env.PORT || 3000);

const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const bot = new TelegramBot(token, { polling: true });

// --- إعدادات المطور والقنوات ---
const channelUsername = '@jes45kabot'; // قناة التيليجرام للاشتراك الإجباري
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; // قناة الواتساب
const devWhatsapp = 'https://wa.me/966574360046'; // رابط الواتس المباشر ليامي

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    try {
        // 1. فحص الاشتراك الإجباري في قناة التيليجرام
        const member = await bot.getChatMember(channelUsername, userId);
        const isMember = ['member', 'administrator', 'creator'].includes(member.status);

        if (!isMember) {
            return bot.sendMessage(chatId, `⚠️ **توقف قليلاً! يجب عليك الانضمام لعائلة يامي أولاً.**\n\nلاستخدام خدمات البوت والتحميل السريع، يرجى الاشتراك في قناة التحديثات الرسمية ثم أرسل /start\n\n📢 القناة: ${channelUsername}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '📢 إضغط هنا للاشتراك في القناة', url: `https://t.me/${channelUsername.replace('@', '')}` }]
                    ]
                }
            });
        }

        // 2. إذا كان المستخدم مشتركاً وضغط Start أو أرسل رسالة
        if (text === '/start') {
            const welcomeMsg = `✨ **مرحباً بك في عالم يامي للتحميل الذكي V3** ✨\n\n🚀 **أسرع بوت تحميل في الشرق الأوسط بين يديك الآن!**\n\nلقد قمنا بدمج أقوى السيرفرات العالمية لنوفر لك تجربة فريدة، بدون إعلانات مزعجة وبجودة HD.\n\n👇 **اختر المنصة التي تريد التحميل منها:**`;
            
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

        // 3. تنبيه عند إرسال روابط مباشرة
        if (text && text.startsWith('http')) {
            bot.sendMessage(chatId, "💡 **عزيزي المستخدم:** لضمان استخراج الفيديو بأفضل جودة، يرجى استخدام أزرار المنصات أعلاه.\n\n*(أرسل /start لإظهار القائمة)*");
        }

    } catch (e) {
        // إذا لم يكن البوت مشرفاً، سيعمل كدليل عادي مؤقتاً
        bot.sendMessage(chatId, "⚠️ **تنبيه للمطور:** يرجى رفع البوت مشرفاً في القناة ليفعل نظام الاشتراك الإجباري.");
    }
});
