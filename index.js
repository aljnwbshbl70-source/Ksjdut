const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// --- إعدادات السيرفر لضمان العمل 24 ساعة في Render ---
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Yami Bot is Online! 🚀'));
app.listen(port, () => console.log(`Server running on port ${port}`));

// --- توكن البوت الخاص بك ---
const token = '8797569562:AAHpKFwIWDBjudIwwbNZBjapckJnIYGewbY';
const bot = new TelegramBot(token, { polling: true });

// --- إعدادات القنوات والمطور (يامي) ---
const channelUsername = '@jes45kabot'; // يوزر قناة التيليجرام للاشتراك الإجباري
const whatsappChannel = 'https://whatsapp.com/channel/0029VbC2EnL0AgWBVvM56n1P'; // رابط قناة الواتساب
const devWhatsapp = 'https://wa.me/966574360046'; // رابط الواتساب المباشر للمطور يامي

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    if (!text) return;

    try {
        // --- 1. فحص الاشتراك الإجباري ---
        const member = await bot.getChatMember(channelUsername, userId);
        const isMember = ['member', 'administrator', 'creator'].includes(member.status);

        if (!isMember) {
            const joinMsg = `⚠️ **توقف قليلاً! يجب عليك الانضمام لعائلة يامي أولاً.**\n\nلاستخدام خدمات البوت والتحميل السريع، يرجى الاشتراك في قناة التحديثات الرسمية ثم أرسل /start\n\n📢 القناة: ${channelUsername}`;
            return bot.sendMessage(chatId, joinMsg, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '📢 إضغط هنا للاشتراك في القناة', url: `https://t.me/${channelUsername.replace('@', '')}` }]
                    ]
                }
            });
        }

        // --- 2. الاستجابة للأوامر والروابط ---
        if (text === '/start') {
            const welcomeMsg = `✨ **مرحباً بك في عالم يامي للتحميل الذكي V3** ✨\n\n🚀 **أسرع بوت تحميل متكامل بين يديك الآن!**\n\nلقد قمنا بدمج أقوى السيرفرات العالمية لنوفر لك تجربة فريدة، بدون إعلانات وبجودة عالية.\n\n👇 **اختر المنصة التي تريد التحميل منها:**`;
            
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

        if (text.startsWith('http')) {
            bot.sendMessage(chatId, "💡 **عزيزي المستخدم:** لضمان استخراج الفيديو بأفضل جودة وسرعة، يرجى استخدام أزرار المنصات أعلاه.\n\n*(أرسل /start لإظهار القائمة)*");
        }

    } catch (e) {
        // في حال كان البوت ليس مشرفاً في القناة
        bot.sendMessage(chatId, "⚠️ **تنبيه:** يرجى التأكد من رفع البوت 'مشرفاً' في قناة التحديثات ليعمل نظام الاشتراك الإجباري.");
    }
});
