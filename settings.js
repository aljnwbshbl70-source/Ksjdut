const fs = require('fs')

// --- إعدادات المطور يامي (البوت الثاني) ---
global.owner = ['966574360046'] 
global.ownername = 'Yami Official V2'
global.botname = 'HELM • V2'

// --- إعدادات الحقوق ---
global.packname = 'Created By Yami'
global.author = 'Yami-V2-System'
global.sessionName = 'yami_v2_session'

// --- رسائل النظام ---
global.mess = {
    success: '✅ تم التنفيذ بنجاح (نظام V2)',
    admin: '⚠️ خاص بالمشرفين!',
    botAdmin: '⚠️ ارفعني مشرف أولاً!',
    owner: '⚠️ خاص بالمطور يامي فقط',
    group: '⚠️ للمجموعات فقط!',
    private: '⚠️ للخاص فقط!',
    wait: '⏳ جاري المعالجة سحابياً V2...',
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(`Update ${__filename}`)
	delete require.cache[file]
	require(file)
})

console.log("✅ إعدادات البوت الثاني جاهزة للعمل")
