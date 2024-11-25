import fs from 'fs'
import moment from 'moment-timezone'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
const { levelling } = '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, command }) => {
try {
let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
let { exp, limit, level, role } = global.db.data.users[m.sender]
let { min, xp, max } = xpRange(level, global.multiplier)
let name = await conn.getName(m.sender)
let d = new Date(new Date + 3600000)
let locale = 'es'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
day: 'numeric',
month: 'long',
year: 'numeric'
})
let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
day: 'numeric',
month: 'long',
year: 'numeric'
}).format(d)
let time = d.toLocaleTimeString(locale, {
hour: 'numeric',
minute: 'numeric',
second: 'numeric'
})
let _uptime = process.uptime() * 1000
let _muptime
if (process.send) {
process.send('uptime')
_muptime = await new Promise(resolve => {
process.once('message', resolve)
setTimeout(resolve, 1000)
}) * 1000
}
let { money, joincount } = global.db.data.users[m.sender]
let user = global.db.data.users[m.sender]
let muptime = clockString(_muptime)
let uptime = clockString(_uptime)
let totalreg = Object.keys(global.db.data.users).length
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
let replace = {
'%': '%',
p: _p, uptime, muptime,
me: conn.getName(conn.user.jid),
npmname: _package.name,
npmdesc: _package.description,
version: _package.version,
exp: exp - min,
maxexp: xp,
totalexp: exp,
xp4levelup: max - exp,
github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
readmore: readMore
}
text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
let pp = gataVidMenu.getRandom()
let pareja = global.db.data.users[m.sender].pasangan 
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
//let fsizedoc = '1'.repeat(10)
//let adReply = { fileLength: fsizedoc, seconds: fsizedoc, contextInfo: { forwardingScore: fsizedoc, externalAdReply: { showAdAttribution: true, title: wm, body: '👋 ' + username, mediaUrl: ig, description: 'Hola', previewType: 'PHOTO', thumbnail: await(await fetch(gataMenu.getRandom())).buffer(), sourceUrl: redesMenu.getRandom() }}}
const numberToEmoji = { "0": "0️⃣", "1": "1️⃣", "2": "2️⃣", "3": "3️⃣", "4": "4️⃣", "5": "5️⃣", "6": "6️⃣", "7": "7️⃣", "8": "8️⃣", "9": "9️⃣", }
let lvl = level
let emoji = Array.from(lvl.toString()).map((digit) => numberToEmoji[digit] || "❓").join("")
const lugarFecha = moment().tz('America/Lima')
const formatoFecha = {
weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
}
lugarFecha.locale('es', formatoFecha)
const horarioFecha = lugarFecha.format('dddd, DD [de] MMMM [del] YYYY || HH:mm A').replace(/^\w/, (c) => c.toUpperCase())
let menu = `> ${lenguajeGB['smsConfi2']()} *${user.genero === 0 ? '👤' : user.genero == 'Ocultado 🕶️' ? `🕶️` : user.genero == 'Mujer 🚺' ? `🚺` : user.genero == 'Hombre 🚹' ? `🚹` : '👤'} ${user.registered === true ? user.name : username}*${(conn.user.jid == global.conn.user.jid ? '' : `\n*SUB BOT DE: https://wa.me/${global.conn.user.jid.split`@`[0]}*`) || ''}
> 𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔
> \`\`\`${horarioFecha}\`\`\`
> ➪➪➪➪➪➪➪➪➪➪➪➪➪➪➪
> Ꙭ *${lenguajeGB['smsTotalUsers']()}* ➺ _${Object.keys(global.db.data.users).length}_ 
> ✵✵✵✵✵✵✵✵✵✵✵✵✵✵✵✵
> Ꙭ *Registrados »* ${rtotalreg}/${totalreg}   
> ✵✵✵✵✵✵✵✵✵✵✵✵✵✵✵✵
> Ꙭ *${lenguajeGB['smsUptime']()}* ➺ _${uptime}_ 
> ✵✵✵✵✵✵✵✵✵✵✵✵✵✵✵✵
> Ꙭ *${lenguajeGB['smsVersion']()}* ➺ _${vs}_
> ✵✵✵✵✵✵✵✵✵✵✵✵✵✵✵✵
> Ꙭ *${lenguajeGB['smsMode']()} ➺* _${global.opts['self'] ? `${lenguajeGB['smsModePrivate']().charAt(0).toUpperCase() + lenguajeGB['smsModePrivate']().slice(1).toLowerCase()}` : `${lenguajeGB['smsModePublic']().charAt(0).toUpperCase() + lenguajeGB['smsModePublic']().slice(1).toLowerCase()}`}_
> ✵✵✵✵✵✵✵✵✵✵✵✵✵✵✵✵
> Ꙭ *${lenguajeGB['smsBanChats']()}* ➺ _${Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned).length}_ 
> ✵✵✵✵✵✵✵✵✵✵✵✵✵✵✵✵
> Ꙭ *${lenguajeGB['smsBanUsers']()}* ➺ _${Object.entries(global.db.data.users).filter(user => user[1].banned).length}_
> 𝑶𝒘𝒏𝒆𝒓:𝑨𝒅𝒓𝒊𝒂𝒏𝑶𝒇𝒄𝒊𝒂𝒍 𝑵𝒖𝒎 +595976126756
> 𝑮𝒊𝒕𝒉𝒖𝒃:${md}
> 𝒀𝒖𝒕𝒖𝒃𝒆:${yt}
> 𝑰𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎:${ig}
> 𝑮𝒓𝒖𝒑𝒐𝑶𝒇𝒄:${nn}
> 𝑪𝒂𝒏𝒂𝒍𝑶𝒇𝒄:${nn2}
> 𖣘 ${gt} 𖣘
> 🥀 *❀𝐼𝑛𝑓𝑜 𝑑𝑒𝑙 𝑢𝑠𝑢𝑎𝑟𝑖𝑜❀* 🥀
> 💐 *𝑹𝒆𝒈𝒖𝒊𝒔𝒕𝒓𝒐📝* ${user.registered === true ? `_${user.registroC === true ? 'Completo 🗂️' : 'Rápido 📑'}_` : '❌ _Sin registro_'}
> 💐 *𝑬𝒔𝒕𝒂𝒅𝒐 𝒅𝒆𝒍 𝒖𝒔𝒖𝒂𝒓𝒊𝒐* ${typeof user.miestado !== 'string' ? '❌ _' + usedPrefix + 'miestado_' : '_Me siento ' + user.miestado + '_'}
> 💐 *𝑹𝒆𝒈𝒖𝒊𝒔𝒕𝒓𝒂𝒅𝒐𝒔* ${user.registered === true ? '✅' : '❌ _' + usedPrefix + 'verificar_'}
> 💐 *${lenguajeGB['smsBotonM7']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM7']().slice(1).toLowerCase()} »* ${user.premiumTime > 0 ? '✅' : '❌ _' + usedPrefix + 'pase premium_'}
> 💐 *${lenguajeGB['smsBotonM5']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM5']().slice(1).toLowerCase()} »* ${role}
> 💐 *${lenguajeGB['smsBotonM6']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM6']().slice(1).toLowerCase()} »* ${emoji} || ${user.exp - min}/${xp}
> 💐 *${lenguajeGB['smsPareja']()}* ${pareja ? `\n*»* ${name} 💕 ${conn.getName(pareja)}` : `🛐 ${lenguajeGB['smsResultPareja']()}`}
> 💐 *𝑷𝒂𝒔𝒂𝒕𝒊𝒆𝒎𝒑𝒐 𝒅𝒆𝒍 𝒖𝒔𝒖𝒂𝒓𝒊𝒐* ➺ ${user.pasatiempo === 0 ? '*Sin Registro*' : user.pasatiempo + '\n'}
> 💐 *𝑬𝒙𝒑𝒆𝒓𝒊𝒆𝒏𝒄𝒊𝒂 ➟* ${exp} ⚡
> 💐 *𝑫𝒊𝒂𝒎𝒂𝒏𝒕𝒆𝒔 ➟* ${limit} 💎
> 💐 *𝑪𝒐𝒊𝒏𝒔 ➟* ${money} 💲
> 💐 *𝑻𝒐𝒌𝒆𝒏𝒔 ➟* ${joincount} 🧿
${readMore}
> ╭━         *᯾𝑰𝒏𝒇𝒐 𝒅𝒆𝒍 𝒃𝒐𝒕᯾*
┃🌺 _${usedPrefix}cuentas_
┃🌺 _${usedPrefix}grupos_
┃🌺 _${usedPrefix}donar_
┃🌺 _${usedPrefix}listagrupos_
┃🌺 _${usedPrefix}estado_
┃🌺 _${usedPrefix}infobot_
┃🌺 _${usedPrefix}instalarbot_
┃🌺 _${usedPrefix}owner_
┃🌺 _${usedPrefix}velocidad_
┃🌺 _Bot_ 
┃🌺 _términos y condiciones_
> ╭━         *〔 𝑭𝒖𝒏𝒄𝒊𝒐𝒏𝒆𝒔 𝑵𝒖𝒆𝒗𝒂𝒔 〕*
┃⚠️ _${usedPrefix}killmenu_
┃⚠️ _${usedPrefix}histori_
> ╭━         *〔 𝑭𝒖𝒏𝒄𝒊𝒐𝒏 𝒅𝒆 𝒔𝒆𝒓𝒃𝒐𝒕 〕*
┃🖥 _${usedPrefix}serbot_
┃🖥 _${usedPrefix}serbot --code_
┃🖥 _${usedPrefix}bots_
┃🖥 _${usedPrefix}detener_
┃🖥 _${usedPrefix}bcbot_
> ╭━         *〔 𝑹𝒆𝒑𝒐𝒓𝒕𝒆𝒔 𝒐 𝑭𝒂𝒍𝒍𝒐𝒔 〕*
┃ 📮 _${usedPrefix}reporte *texto*_
┃ 📮 _${usedPrefix}report *texto*_
> ╭━          *〔 𝑼𝒏𝒆 𝒂𝒍 𝒃𝒐𝒕 𝒂 𝒕𝒖 𝒈𝒓𝒖𝒑𝒐 〕 *
┃🌟 _${usedPrefix}botemporal *enlace* *cantidad*_
> ╭━          *〔 𝑷𝒓𝒆𝒎𝒊𝒖𝒏 〕*
┃🎫 _${usedPrefix}listapremium_
┃🎫 _${usedPrefix}pase premium_
┃🎫 _${usedPrefix}pass premium_
> ╭━         *〔 𝑱𝒖𝒆𝒈𝒐𝒔 〕*
┃🤹‍ _${usedPrefix}mates_
┃🤹‍ _${usedPrefix}lanzar *cara* o *cruz*
┃🤹‍ _${usedPrefix}ppt *piedra,papel,tijera*_
┃🤹‍ _${usedPrefix}tictactoe_
┃🤹‍ _${usedPrefix}deltictactoe_
┃🤹‍ _${usedPrefix}topgays_
┃🤹‍ _${usedPrefix}topotakus_
┃🤹‍ _${usedPrefix}toppajer@s_
┃🤹‍ _${usedPrefix}topput@s_
┃🤹‍ _${usedPrefix}topintegrantes_
┃🤹‍ _${usedPrefix}toplagrasa_
┃🤹‍ _${usedPrefix}toppanafrescos_
┃🤹‍ _${usedPrefix}topshiposters_
┃🤹‍ _${usedPrefix}toplindos_
┃🤹‍ _${usedPrefix}topfamosos_
┃🤹‍ _${usedPrefix}topparejas_
┃🤹‍ _${usedPrefix}gay *@tag*_
┃🤹‍ _${usedPrefix}gay2 *nombre : @tag*_
┃🤹‍ _${usedPrefix}lesbiana *nombre : @tag*_
┃🤹‍ _${usedPrefix}manca *nombre : @tag*_
┃🤹‍ _${usedPrefix}manco *nombre : @tag*_
┃🤹‍ _${usedPrefix}pajero *nombre : @tag*_
┃🤹‍ _${usedPrefix}pajera *nombre : @tag*_
┃🤹‍ _${usedPrefix}puto *nombre : @tag*_
┃🤹‍ _${usedPrefix}puta *nombre : @tag*_
┃🤹‍ _${usedPrefix}rata *nombre : @tag*_
┃🤹‍ _${usedPrefix}love *nombre : @tag*_
┃🤹‍ _${usedPrefix}doxear *nombre : @tag*_
┃🤹‍ _${usedPrefix}doxxeame_
┃🤹‍ _${usedPrefix}pregunta *texto*_
┃🤹‍ _${usedPrefix}apostar | slot *cantidad*_
┃🤹‍ _${usedPrefix}formarpareja_
┃🤹‍ _${usedPrefix}dado_
┃🤹‍ _${usedPrefix}verdad_
┃🤹‍ _${usedPrefix}reto_
┃🤹‍ _${usedPrefix}multijuegos_
┃🤹‍ _${usedPrefix}juegos_
> ╭━    〔 𝑰𝒏𝒕𝒆𝒍𝒊𝒈𝒆𝒏𝒄𝒊𝒂 𝑨𝒓𝒕𝒊𝒇𝒊𝒄𝒊𝒂𝒍 〕*
┃🦋 _${usedPrefix}okgoogle *texto*_
┃🦋 _${usedPrefix}siri *texto*_
┃🦋 _${usedPrefix}bixby *texto*_
> ╭━      [ 𝑪𝒐𝒏𝒇𝒊𝒈𝒖𝒓𝒂𝒄𝒊𝒐𝒏 ]*
┃🔧 _${usedPrefix}on *:* off *welcome*_
┃🔧 _${usedPrefix}on *:* off *detect*_
┃🔧 _${usedPrefix}on *:* off *autolevelup*_
┃🔧 _${usedPrefix}on *:* off *restrict*_
┃🔧 _${usedPrefix}on *:* off *anticall*_
┃🔧 _${usedPrefix}on *:* off *public*_
┃🔧 _${usedPrefix}on *:* off *autoread*_
┃🔧 _${usedPrefix}on *:* off *temporal*_
┃🔧 _${usedPrefix}on *:* off *stickers*_
┃🔧 _${usedPrefix}on *:* off *autosticker*_
┃🔧 _${usedPrefix}on *:* off *reaction*_
┃🔧 _${usedPrefix}on *:* off *audios*_
┃🔧 _${usedPrefix}on *:* off *modohorny*_
┃🔧 _${usedPrefix}on *:* off *antitoxic*_
┃🔧 _${usedPrefix}on *:* off *antiviewonce*_
┃🔧 _${usedPrefix}on *:* off *antidelete*_
┃🔧 _${usedPrefix}on *:* off *antifake*_
┃🔧 _${usedPrefix}on *:* off *antilink*_
┃🔧 _${usedPrefix}on *:* off *antilink2*_
┃🔧 _${usedPrefix}on *:* off *antitiktok_
┃🔧 _${usedPrefix}on *:* off *antiyoutube*_
┃🔧 _${usedPrefix}on *:* off *antitelegram*_
┃🔧 _${usedPrefix}on *:* off *antifacebook*_
┃🔧 _${usedPrefix}on *:* off *antinstagram*_
┃🔧 _${usedPrefix}on *:* off *antitwitter*_
┃🔧 _${usedPrefix}on *:* off *pconly*_
┃🔧 _${usedPrefix}on *:* off *gconly*_
> ╭━      *〔 𝑮𝒓𝒖𝒑𝒐𝒔-𝑹𝒆𝒔𝒖𝒎𝒆𝒏 〕*
┃🌼 _${usedPrefix}configuracion_
┃🌼 _${usedPrefix}settings_
┃🌼 _${usedPrefix}vergrupo_
> ╭━       *[ 𝑫𝒆𝒔𝒄𝒂𝒓𝒈𝒂𝒔 ]*
┃⬇️ _${usedPrefix}imagen | image *texto*_
┃⬇️ _${usedPrefix}pinterest | dlpinterest *texto*_
┃⬇️ _${usedPrefix}wallpaper|wp *texto*_
┃⬇️ _${usedPrefix}play | play2 *texto o link*_
┃⬇️ _${usedPrefix}play.1 *texto o link*_
┃⬇️ _${usedPrefix}play.2 *texto o link*_ 
┃⬇️ _${usedPrefix}ytmp3 | yta *link*_
┃⬇️ _${usedPrefix}ytmp4 | ytv *link*_
┃⬇️ _${usedPrefix}pdocaudio | ytadoc *link*_
┃⬇️ _${usedPrefix}pdocvieo | ytvdoc *link*_
┃⬇️ _${usedPrefix}tw |twdl | twitter *link*_
┃⬇️ _${usedPrefix}facebook | fb *link*_
┃⬇️ _${usedPrefix}instagram *link video o imagen*_
┃⬇️ _${usedPrefix}verig | igstalk *usuario(a)*_
┃⬇️ _${usedPrefix}ighistoria | igstory *usuario(a)*_
┃⬇️ _${usedPrefix}tiktok *link*_
┃⬇️ _${usedPrefix}tiktokimagen | ttimagen *link*_
┃⬇️ _${usedPrefix}tiktokfoto | tiktokphoto *usuario(a)*_
┃⬇️ _${usedPrefix}vertiktok | tiktokstalk *usuario(a)*_
┃⬇️ _${usedPrefix}mediafire | dlmediafire *link*_
┃⬇️ _${usedPrefix}clonarepo | gitclone *link*_
┃⬇️ _${usedPrefix}clima *país ciudad*_
┃⬇️ _${usedPrefix}consejo_
┃⬇️ _${usedPrefix}morse codificar *texto*_
┃⬇️ _${usedPrefix}morse decodificar *morse*_
┃⬇️ _${usedPrefix}fraseromantica_
┃⬇️ _${usedPrefix}historia_
> ╭━      *[ 𝑪𝒉𝒂𝒕 𝑺𝒆𝒄𝒓𝒆𝒕𝒐 ]*
┃👤 _${usedPrefix}chatanonimo_
┃👤 _${usedPrefix}anonimoch_
┃👤 _${usedPrefix}start_
┃👤 _${usedPrefix}next_
┃👤 _${usedPrefix}leave_
> ╭━      *[ 𝑨𝒋𝒖𝒔𝒕𝒆𝒔 𝒅𝒆 𝒈𝒓𝒖𝒑𝒐𝒔 ]*
┃🛠 _${usedPrefix}add *numero*_
┃🛠 _${usedPrefix}kick *@tag*_
┃🛠 _${usedPrefix}grupo *abrir : cerrar*_
┃🛠 _${usedPrefix}promote *@tag*_
┃🛠 _${usedPrefix}demote *@tag*_
┃🛠 _${usedPrefix}banchat_
┃🛠 _${usedPrefix}unbanchat_
┃🛠 _${usedPrefix}banuser *@tag*_
┃🛠 _${usedPrefix}unbanuser *@tag*_
┃🛠 _${usedPrefix}admins *texto*_
┃🛠 _${usedPrefix}invocar *texto*_
┃🛠 _${usedPrefix}tagall *texto*_
┃🛠 _${usedPrefix}hidetag *texto*_
┃🛠 _${usedPrefix}infogrupo_
┃🛠 _${usedPrefix}grupotiempo *Cantidad*_
┃🛠 _${usedPrefix}advertencia *@tag*_
┃🛠 _${usedPrefix}deladvertencia *@tag*_
┃🛠 _${usedPrefix}delwarn *@tag*_
┃🛠 _${usedPrefix}crearvoto *texto*_
┃🛠 _${usedPrefix}sivotar_
┃🛠 _${usedPrefix}novotar_
┃🛠 _${usedPrefix}vervotos_
┃🛠 _${usedPrefix}delvoto_
┃🛠 _${usedPrefix}link_
┃🛠 _${usedPrefix}nuevonombre *texto*_
┃🛠 _${usedPrefix}descripcion *texto*_
┃🛠 _${usedPrefix}bienvenida *texto*_
┃🛠 _${usedPrefix}despedida *texto*_
┃🛠 _${usedPrefix}nuevoenlace_
> ╭━     *[ 𝑷𝒂𝒓𝒆𝒋𝒂𝒔 ]*
┃❤️ _${usedPrefix}listaparejas_
┃❤️ _${usedPrefix}mipareja_
┃❤️ _${usedPrefix}pareja *@tag*_
┃❤️ _${usedPrefix}aceptar *@tag*_
┃❤️ _${usedPrefix}rechazar *@tag*_
┃❤️ _${usedPrefix}terminar *@tag*_
> ╭━     *[ 𝑽𝒐𝒕𝒂𝒄𝒊𝒐𝒏𝒆𝒔 ]*
┃📝 _${usedPrefix}crearvoto *texto*_
┃📝 _${usedPrefix}sivotar_
┃📝 _${usedPrefix}novotar_
┃📝 _${usedPrefix}vervotos_
┃📝 _${usedPrefix}delvoto_
> ╭━     *[ +18 ]*
┃🔞➺ _${usedPrefix}hornymenu_
> ╭━     *[ 𝑪𝒐𝒏𝒗𝒆𝒓𝒕𝒊𝒅𝒐𝒓𝒆𝒔 ]*
┃🖼 _${usedPrefix}jpg *sticker*_
┃🖼 _${usedPrefix}toanime *foto*_
┃🖼 _${usedPrefix}tomp3 *video o nota de voz*_
┃🖼 _${usedPrefix}vn *video o audio*_
┃🖼 _${usedPrefix}tovideo *audio*_
┃🖼 _${usedPrefix}tourl *video, imagen*_
┃🖼 _${usedPrefix}toenlace  *video, imagen o audio*_
┃🖼 _${usedPrefix}tts *texto*_
> ╭━      *[ 𝑳𝒐𝒈𝒐𝒔 ]*
┃🏞 _${usedPrefix}logos *efecto texto*_
┃🏞 _${usedPrefix}menulogos2_
> ╭━      *[ 𝑬𝒇𝒆𝒄𝒕𝒐𝒔 ]*
┃✨ _${usedPrefix}simpcard *@tag*_
┃✨ _${usedPrefix}hornycard *@tag*_
┃✨ _${usedPrefix}lolice *@tag*_
┃✨ _${usedPrefix}ytcomment *texto*_
┃✨ _${usedPrefix}itssostupid_
┃✨ _${usedPrefix}pixelar_
┃✨ _${usedPrefix}blur_
> ╭━      *[ 𝑹𝒂𝒏𝒅𝒐𝒎 ]*
┃🍃 _${usedPrefix}chica_
┃🍃 _${usedPrefix}chico_
┃🍃 _${usedPrefix}cristianoronaldo_
┃🍃 _${usedPrefix}messi_
┃🍃 _${usedPrefix}meme_
┃🍃 _${usedPrefix}meme2_
┃🍃 _${usedPrefix}itzy_
┃🍃 _${usedPrefix}blackpink_
┃🍃 _${usedPrefix}kpop *blackpink : exo : bts*_
┃🍃 _${usedPrefix}lolivid_
┃🍃 _${usedPrefix}loli_
┃🍃 _${usedPrefix}navidad_
┃🍃 _${usedPrefix}ppcouple_
┃🍃 _${usedPrefix}neko_
┃🍃 _${usedPrefix}waifu_
┃🍃 _${usedPrefix}akira_
┃🍃 _${usedPrefix}akiyama_
┃🍃 _${usedPrefix}anna_
┃🍃 _${usedPrefix}asuna_
┃🍃 _${usedPrefix}ayuzawa_
┃🍃 _${usedPrefix}boruto_
┃🍃 _${usedPrefix}chiho_
┃🍃 _${usedPrefix}chitoge_
┃🍃 _${usedPrefix}deidara_
┃🍃 _${usedPrefix}erza_
┃🍃 _${usedPrefix}elaina_
┃🍃 _${usedPrefix}eba_
┃🍃 _${usedPrefix}emilia_
┃🍃 _${usedPrefix}hestia_
┃🍃 _${usedPrefix}hinata_
┃🍃 _${usedPrefix}inori_
┃🍃 _${usedPrefix}isuzu_
┃🍃 _${usedPrefix}itachi_
┃🍃 _${usedPrefix}itori_
┃🍃 _${usedPrefix}kaga_
┃🍃 _${usedPrefix}kagura_
┃🍃 _${usedPrefix}kaori_
┃🍃 _${usedPrefix}keneki_
┃🍃 _${usedPrefix}kotori_
┃🍃 _${usedPrefix}kurumi_
┃🍃 _${usedPrefix}madara_
┃🍃 _${usedPrefix}mikasa_
┃🍃 _${usedPrefix}miku_
┃🍃 _${usedPrefix}minato_
┃🍃 _${usedPrefix}naruto_
┃🍃 _${usedPrefix}nezuko_
┃🍃 _${usedPrefix}sagiri_
┃🍃 _${usedPrefix}sasuke_
┃🍃 _${usedPrefix}sakura_
┃🍃 _${usedPrefix}cosplay_
> ╭━     *[ 𝑴𝒐𝒅𝒊𝒇𝒊𝒄𝒂𝒓 𝑨𝒖𝒅𝒊𝒐𝒔 ]*
┃🎤 _${usedPrefix}bass_
┃🎤 _${usedPrefix}blown_
┃🎤 _${usedPrefix}deep_
┃🎤 _${usedPrefix}earrape_
┃🎤 _${usedPrefix}fast_
┃🎤 _${usedPrefix}fat_
┃🎤 _${usedPrefix}nightcore_
┃🎤 _${usedPrefix}reverse_
┃🎤 _${usedPrefix}robot_
┃🎤 _${usedPrefix}slow_
┃🎤 _${usedPrefix}smooth_
┃🎤 _${usedPrefix}tupai_
> ╭━     *[ 𝑩𝒖𝒔𝒒𝒖𝒆𝒅𝒂𝒔 ]*
┃🔍 _${usedPrefix}animeinfo *texto*_
┃🔍 _${usedPrefix}mangainfo *texto*_
┃🔍 _${usedPrefix}google *texto*_
┃🔍 _${usedPrefix}googlelyrics *texto*_
┃🔍 _${usedPrefix}letra *texto*_
┃🔍 _${usedPrefix}yts *texto*_
┃🔍 _${usedPrefix}wikipedia *texto*_
> ╭━     *[ 𝑨𝒖𝒅𝒊𝒐𝒔  ]*
┃🎙 _${usedPrefix}audios_
> ╭━     *[ 𝑯𝒆𝒓𝒓𝒂𝒎𝒊𝒆𝒏𝒕𝒂𝒔 ]*
┃🧰 _${usedPrefix}afk *motivo*_
┃🧰 _${usedPrefix}acortar *url*_
┃🧰 _${usedPrefix}calc *operacion math*_
┃🧰 _${usedPrefix}del *respondre a mensaje del Bot*_
┃🧰 _${usedPrefix}qrcode *texto*_
┃🧰 _${usedPrefix}readmore *texto1|texto2*_
┃🧰 _${usedPrefix}spamwa *numero|texto|cantidad*_
┃🧰 _${usedPrefix}styletext *texto*_
┃🧰 _${usedPrefix}traducir *texto*_
┃🧰 _${usedPrefix}morse codificar *texto*_
┃🧰 _${usedPrefix}morse decodificar *morse*_
┃🧰 _${usedPrefix}encuesta | poll *Motivo*_
┃🧰 _${usedPrefix}horario_
> ╭━     *[ 𝑭𝒖𝒏𝒄𝒊𝒐𝒏𝒆𝒔 𝑹𝑷𝑮 ]*
┃💲 _${usedPrefix}botemporal *enlace* *cantidad*_
┃💲 _${usedPrefix}pase premium_
┃💲 _${usedPrefix}listapremium_
┃💲 _${usedPrefix}transfer *tipo cantidad @tag*_
┃💲 _${usedPrefix}dar *tipo cantidad @tag*_
┃💲 _${usedPrefix}enviar *tipo cantidad @tag*_
┃💲 _${usedPrefix}balance_
┃💲 _${usedPrefix}cartera_
┃💲 _${usedPrefix}exp_
┃💲 _${usedPrefix}top_
┃💲 _${usedPrefix}nivel | level | lvl_
┃💲 _${usedPrefix}rango_
┃💲 _${usedPrefix}inventario_
┃💲 _${usedPrefix}aventura_
┃💲 _${usedPrefix}cazar_
┃💲 _${usedPrefix}pescar_
┃💲 _${usedPrefix}animales_
┃💲 _${usedPrefix}alimentos_
┃💲 _${usedPrefix}curar_
┃💲 _${usedPrefix}buy_
┃💲 _${usedPrefix}sell_
┃💲 _${usedPrefix}verificar_
┃💲 _${usedPrefix}perfil_
┃💲 _${usedPrefix}myns_
┃💲 _${usedPrefix}unreg *numero de serie*_
┃💲 _${usedPrefix}minardiamantes_
┃💲 _${usedPrefix}minarcoins_
┃💲 _${usedPrefix}minarexp_
┃💲 _${usedPrefix}minar *:* minar2 *:* minar3_
┃💲 _${usedPrefix}claim_
┃💲 _${usedPrefix}cadahora_
┃💲 _${usedPrefix}semanal_
┃💲 _${usedPrefix}mes_
┃💲 _${usedPrefix}cofre_
┃💲 _${usedPrefix}trabajar|work_
> ╭━     *[ 𝑵𝒊𝒗𝒆𝒍𝒆𝒔 ]*
┃🥇 _${usedPrefix}top_
> ╭━     *[ 𝑺𝒕𝒊𝒄𝒌𝒆𝒓𝒔 𝒚 𝑭𝒊𝒍𝒕𝒓𝒐𝒔 ]*
┃🔮 _${usedPrefix}s *imagen o video*_
┃🔮 _${usedPrefix}s *url de tipo jpg*_
┃🔮 _${usedPrefix}emojimix *🌼+🌺*_
┃🔮 _${usedPrefix}imagen*_
┃🔮 _${usedPrefix}emoji *tipo emoji*_
┃🔮 _${usedPrefix}attp *texto*_
┃🔮 _${usedPrefix}attp2 *texto*_
┃🔮 _${usedPrefix}ttp *texto*_
┃🔮 _${usedPrefix}ttp2 *texto*_
┃🔮 _${usedPrefix}ttp3 *texto*_
┃🔮 _${usedPrefix}ttp4 *texto*_
┃🔮 _${usedPrefix}ttp5 *texto*_
┃🔮 _${usedPrefix}ttp6 *texto*_
┃🔮 _${usedPrefix}dado_
┃🔮 _${usedPrefix}stickermarker *efecto : responder a imagen*_
┃🔮 _${usedPrefix}stickerfilter *efecto : responder a imagen*_
┃🔮 _${usedPrefix}cs *:* cs2_
> ╭━     *[ 𝑴𝒐𝒅𝒊𝒇𝒊𝒄𝒂𝒓 𝑺𝒕𝒊𝒄𝒌𝒆𝒓𝒔 ]*
┃🎨 _${usedPrefix}wm *packname|author*_
┃🎨 _${usedPrefix}wm *texto1|texto2*_
> ╭━     *[ 𝑺𝒕𝒊𝒄𝒌𝒆𝒓𝒔 ]*
┃🌌 _${usedPrefix}palmaditas *@tag*_
┃🌌 _${usedPrefix}bofetada *@tag*_
┃🌌 _${usedPrefix}golpear *@tag*_
┃🌌 _${usedPrefix}besar *@tag*_
┃🌌 _${usedPrefix}alimentar *@tag*_
> ╭━     *[ 𝑷𝒓𝒐𝒑𝒊𝒆𝒕𝒂𝒓𝒊𝒐 ]*
┃👑 _${usedPrefix}join *enlace*_
┃👑 _${usedPrefix}dardiamantes *cantidad*_
┃👑 _${usedPrefix}darxp *cantidad*_
┃👑 _${usedPrefix}darcoins *cantidad*_
┃👑 _${usedPrefix}addprem *@tag* *cantidad*_
┃👑 _${usedPrefix}addprem2 *@tag* *cantidad*_
┃👑 _${usedPrefix}addprem3 *@tag* *cantidad*_
┃👑 _${usedPrefix}addprem4 *@tag* *cantidad*_
┃👑 _${usedPrefix}idioma_
┃👑 _${usedPrefix}cajafuerte_
┃👑 _${usedPrefix}bc *texto*_
┃👑 _${usedPrefix}bcc *texto*_
┃👑 _${usedPrefix}comunicarpv *texto*_
┃👑 _${usedPrefix}broadcastgc *texto*_
┃👑 _${usedPrefix}comunicargrupos *texto*_
┃👑 _${usedPrefix}borrartmp_
┃👑 _${usedPrefix}delexp *@tag*_
┃👑 _${usedPrefix}delcoins *@tag*_
┃👑 _${usedPrefix}deldiamantes *@tag*_
┃👑 _${usedPrefix}reiniciar_
┃👑 _${usedPrefix}update_
┃👑 _${usedPrefix}addprem *@tag*_
┃👑 _${usedPrefix}delprem *@tag*_
┃👑 _${usedPrefix}listprem_
┃👑 _${usedPrefix}añadirdiamantes *@tag cantidad*_
┃👑 _${usedPrefix}añadirxp *@tag cantidad*_
┃👑 _${usedPrefix}añadircoins *@tag cantidad*_
> *╰━━━━━━━━━━━━⬣*`.trim()
await conn.sendFile(m.chat, gataVidMenu.getRandom(), 'gata.mp4', menu, fkontak)
} catch (e) {
await m.reply(lenguajeGB['smsMalError3']() + '\n*' + lenguajeGB.smsMensError1() + '*\n*' + usedPrefix + `${lenguajeGB.lenguaje() == 'es' ? 'reporte' : 'report'}` + '* ' + `${lenguajeGB.smsMensError2()} ` + usedPrefix + command)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}}
handler.command = /^(menu|menú|memu|memú|help|info|comandos|2help|menu1.2|ayuda|commands|commandos|menucompleto|allmenu|allm|m|\?)$/i
//handler.register = true
export default handler
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}