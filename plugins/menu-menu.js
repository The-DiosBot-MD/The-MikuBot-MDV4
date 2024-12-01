import fs from 'fs'
import translate from '@vitalets/google-translate-api'
import moment from 'moment-timezone'
import ct from 'countries-and-timezones'
import { parsePhoneNumber } from 'libphonenumber-js'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
const { levelling } = '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
import chalk from 'chalk'

let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, command }) => {
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
let bot = global.db.data.settings[conn.user.jid] || {}

const commandsConfig = [
{ comando: (bot.restrict ? 'off ' : 'on ') + 'restringir , restrict', descripcion: bot.restrict ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Permisos para el Bot', showPrefix: true },
{ comando: (bot.antiCall ? 'off ' : 'on ') + 'antillamar , anticall', descripcion: bot.antiCall ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Evitar recibir llamadas en el Bot', showPrefix: true },
{ comando: (bot.temporal ? 'off ' : 'on ') + 'temporal', descripcion: bot.temporal ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Ingreso del Bot temporalmente en grupos', showPrefix: true },
{ comando: (bot.jadibotmd ? 'off ' : 'on ') + 'serbot , jadibot', descripcion: bot.jadibotmd ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Permitir o no Sub Bots en este Bot', showPrefix: true },
{ comando: (bot.antiSpam ? 'off ' : 'on ') + 'antispam', descripcion: bot.antiSpam ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Dar advertencia por hacer Spam', showPrefix: true },
{ comando: (bot.antiSpam2 ? 'off ' : 'on ') + 'antispam2', descripcion: bot.antiSpam2 ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Omitir resultado de comandos consecutivos', showPrefix: true },
{ comando: (bot.antiPrivate ? 'off ' : 'on ') + 'antiprivado , antiprivate', descripcion: bot.antiPrivate ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Prohibe que este Bot sea usado en privado', showPrefix: true },
{ comando: (global.opts['self'] ? 'on ' : 'off ') + 'publico , public', descripcion: global.opts['self'] ? '❌' + 'Desactivado || Disabled' : '✅' + 'Activado || Activated', contexto: 'Permitir que todos usen el Bot', showPrefix: true },
{ comando: (global.opts['autoread'] ? 'off ' : 'on ') + 'autovisto , autoread', descripcion: global.opts['autoread'] ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Mensajes leídos automáticamente', showPrefix: true },
{ comando: (global.opts['gconly'] ? 'off ' : 'on ') + 'sologrupos , gconly', descripcion: global.opts['gconly'] ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Hacer que funcione sólo en grupos', showPrefix: true },
{ comando: (global.opts['pconly'] ? 'off ' : 'on ') + 'soloprivados , pconly', descripcion: global.opts['pconly'] ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Hacer que funcione sólo al privado', showPrefix: true },
 
{ comando: m.isGroup ? (chat.welcome ? 'off ' : 'on ') + 'bienvenida , welcome' : false, descripcion: m.isGroup ? (chat.welcome ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Establecer bienvenida en grupos', showPrefix: true },
{ comando: m.isGroup ? (chat.detect  ? 'off ' : 'on ') + 'avisos , detect' : false, descripcion: m.isGroup ? (chat.detect  ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Avisos importantes en grupos', showPrefix: true },
{ comando: m.isGroup ? (chat.autolevelup  ? 'off ' : 'on ') + 'autonivel , autolevelup' : false, descripcion: m.isGroup ? (chat.autolevelup  ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Subir de nivel automáticamente', showPrefix: true },
{ comando: m.isGroup ? (chat.modoadmin  ? 'off ' : 'on ') + 'modoadmin , modeadmin' : false, descripcion: m.isGroup ? (chat.modoadmin  ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Sólo admins podrán usar en grupo', showPrefix: true },

{ comando: m.isGroup ? (chat.stickers ? 'off ' : 'on ') + 'stickers' : false, descripcion: m.isGroup ? (chat.stickers ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Stickers automáticos en chats', showPrefix: true }, 
{ comando: m.isGroup ? (chat.autosticker ? 'off ' : 'on ') + 'autosticker' : false, descripcion: m.isGroup ? (chat.autosticker ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Multimedia a stickers automáticamente', showPrefix: true }, 
{ comando: m.isGroup ? (chat.reaction ? 'off ' : 'on ') + 'reacciones , reaction' : false, descripcion: m.isGroup ? (chat.reaction ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Reaccionar a mensajes automáticamente', showPrefix: true }, 
{ comando: m.isGroup ? (chat.audios ? 'off ' : 'on ') + 'audios' : false, descripcion: m.isGroup ? (chat.audios ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Audios automáticos en chats', showPrefix: true }, 
{ comando: m.isGroup ? (chat.modohorny ? 'off ' : 'on ') + 'modocaliente , modehorny' : false, descripcion: m.isGroup ? (chat.modohorny ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Comandos con contenido para adultos', showPrefix: true }, 
{ comando: m.isGroup ? (chat.antitoxic ? 'off ' : 'on ') + 'antitoxicos , antitoxic' : false, descripcion: m.isGroup ? (chat.antitoxic ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Sancionar/eliminar a usuarios tóxicos', showPrefix: true },
{ comando: m.isGroup ? (chat.antiver ? 'off ' : 'on ') + 'antiver , antiviewonce' : false, descripcion: m.isGroup ? (chat.antiver ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: ' No acultar mensajes de \"una sola vez\"', showPrefix: true }, 
{ comando: m.isGroup ? (chat.delete ? 'off ' : 'on ') + 'antieliminar , antidelete' : false, descripcion: m.isGroup ? (chat.delete ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Mostrar mensajes eliminados', showPrefix: true },
{ comando: m.isGroup ? (chat.antifake ? 'off ' : 'on ') + 'antifalsos , antifake' : false, descripcion: m.isGroup ? (chat.antifake ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar usuarios falsos/extranjeros', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTraba ? 'off ' : 'on ') + 'antitrabas , antilag' : false, descripcion: m.isGroup ? (chat.antiTraba ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Enviar mensaje automático en caso de lag', showPrefix: true },
{ comando: m.isGroup ? (chat.simi ? 'off ' : 'on ') + 'simi' : false, descripcion: m.isGroup ? (chat.simi ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'SimSimi responderá automáticamente', showPrefix: true },
{ comando: m.isGroup ? (chat.modoia ? 'off ' : 'on ') + 'ia' : false, descripcion: m.isGroup ? (chat.modoia ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Inteligencia artificial automática', showPrefix: true },

{ comando: m.isGroup ? (chat.antilink ? 'off ' : 'on ') + 'antienlace , antilink' : false, descripcion: m.isGroup ? (chat.antilink ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de WhatsApp', showPrefix: true },
{ comando: m.isGroup ? (chat.antilink2 ? 'off ' : 'on ') + 'antienlace2 , antilink2' : false, descripcion: m.isGroup ? (chat.antilink2 ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces que contenga \"https\"', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTiktok ? 'off ' : 'on ') + 'antitiktok , antitk' : false, descripcion: m.isGroup ? (chat.antiTiktok ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de TikTok', showPrefix: true },
{ comando: m.isGroup ? (chat.antiYoutube ? 'off ' : 'on ') + 'antiyoutube , antiyt' : false, descripcion: m.isGroup ? (chat.antiYoutube ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de YouTube', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTelegram ? 'off ' : 'on ') + 'antitelegram , antitg' : false, descripcion: m.isGroup ? (chat.antiTelegram ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de Telegram', showPrefix: true },
{ comando: m.isGroup ? (chat.antiFacebook ? 'off ' : 'on ') + 'antifacebook , antifb' : false, descripcion: m.isGroup ? (chat.antiFacebook ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de Facebook', showPrefix: true },
{ comando: m.isGroup ? (chat.antiInstagram ? 'off ' : 'on ') + 'antinstagram , antig' : false, descripcion: m.isGroup ? (chat.antiInstagram ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de Instagram', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTwitter ? 'off ' : 'on ') + 'antiX' : false, descripcion: m.isGroup ? (chat.antiTwitter ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de X (Twitter)', showPrefix: true },
]
 
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
let taguser = '@' + m.sender.split("@s.whatsapp.net")[0]
let pp = gataVidMenu
let pareja = global.db.data.users[m.sender].pasangan 
const numberToEmoji = { "0": "0️⃣", "1": "1️⃣", "2": "2️⃣", "3": "3️⃣", "4": "4️⃣", "5": "5️⃣", "6": "6️⃣", "7": "7️⃣", "8": "8️⃣", "9": "9️⃣", }
let lvl = level
let emoji = Array.from(lvl.toString()).map((digit) => numberToEmoji[digit] || "❓").join("")

let fechaMoment, formatDate, nombreLugar, ciudad = null
const phoneNumber = '+' + m.sender
const parsedPhoneNumber = parsePhoneNumber(phoneNumber)
const countryCode = parsedPhoneNumber.country
const countryData = ct.getCountry(countryCode)
const timezones = countryData.timezones
const zonaHoraria = timezones.length > 0 ? timezones[0] : 'UTC'
moment.locale(mid.idioma_code)
let lugarMoment = moment().tz(zonaHoraria)
if (lugarMoment) {
fechaMoment = lugarMoment.format('llll [(]a[)]')
formatDate = fechaMoment.charAt(0).toUpperCase() + fechaMoment.slice(1) 
nombreLugar = countryData.name
const partes = zonaHoraria.split('/')
ciudad = partes[partes.length - 1].replace(/_/g, ' ')
}else{
lugarMoment = moment().tz('America/Lima')
fechaMoment = lugarMoment.format('llll [(]a[)]')
formatDate = fechaMoment.charAt(0).toUpperCase() + fechaMoment.slice(1) 
nombreLugar = 'America'
ciudad = 'Lima'
}	
let margen = '*··················································*'
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
//await conn.sendFile(m.chat, gataImg, 'lp.jpg', menu, fkontak, false, { contextInfo: {mentionedJid, externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: gt, body: ' 🥷 𝗦𝘂𝗽𝗲𝗿 𝗞𝗮𝘁𝗮𝘀𝗵𝗶𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 ', previewType: 0, thumbnail: imagen4, sourceUrl: redesMenu }}})
//conn.sendFile(m.chat, gataVidMenu.getRandom(), 'gata.mp4', menu, fkontak)
const vi = ['https://qu.ax/TNPH.mp4',
'https://qu.ax/srFl.mp4',
'https://qu.ax/yLtv.mp4']
await conn.sendMessage(m.chat, { video: { url: vi.getRandom() }, gifPlayback: true, caption: menu, contextInfo: fakeChannel })
 
} catch (e) {
await m.reply(lenguajeGB['smsMalError3']() + '\n*' + lenguajeGB.smsMensError1() + '*\n*' + usedPrefix + `${lenguajeGB.lenguaje() == 'es' ? 'reporte' : 'report'}` + '* ' + `${lenguajeGB.smsMensError2()} ` + usedPrefix + command)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}


}

//handler.command = /^(menu|menú|memu|memú|help|info|comandos|2help|menu1.2|ayuda|commands|commandos|menucompleto|allmenu|allm|m|\?)$/i
handler.command = /^(menucompleto|allmenu|\?)$/i
handler.register = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}  

// Función para formatear arrays de comandos
function generateCommand(commandsArray, usedPrefix) {
const formattedCommands = commandsArray
.filter(command => {
const comandoValido = command.comando && typeof command.comando === 'function' && command.comando()
const descripcionValida = command.descripcion && typeof command.descripcion === 'function'
const contextoValido = typeof command.contexto === 'string' && command.contexto.trim() !== ''
return comandoValido || descripcionValida || contextoValido
})
.map((command, index, array) => {
const prefix = (command.showPrefix === true && ((typeof command.comando === 'function' && typeof command.comando() === 'string' && command.comando().trim() !== '') ||
(typeof command.comando === 'string' && command.comando.trim() !== ''))) ? usedPrefix : ''
let formattedCommand = ''
if (command.comando) {
if (typeof command.comando === 'function') {
const commandResult = command.comando()
if (typeof commandResult === 'string') {
formattedCommand = commandResult.trim()
}} else if (typeof command.comando === 'string') {
formattedCommand = command.comando.trim()
}}
if (formattedCommand.includes(',')) {
formattedCommand = mid.idioma_code === 'es' ? formattedCommand.split(',')[0].trim() : formattedCommand.split(',')[1].trim()
}
let formattedDescription = ''
if (command.descripcion) {
if (typeof command.descripcion === 'function') {
const descriptionResult = command.descripcion()
if (typeof descriptionResult === 'string') {
formattedDescription = descriptionResult.trim()
}} else if (typeof command.descripcion === 'string') {
formattedDescription = command.descripcion.trim()
}}
if (formattedDescription.includes('||')) {
formattedDescription = mid.idioma_code === 'es' ? formattedDescription.split('||')[0].trim() : formattedDescription.split('||')[1].trim()
}
let formattedContext = ''
if (command.contexto) {
if (typeof command.contexto === 'function') {
const contextResult = command.contexto()
if (typeof contextResult === 'string') {
formattedContext = contextResult.trim()
}} else if (typeof command.contexto === 'string' && command.contexto.trim() !== '') {
formattedContext = command.contexto.trim()
}}
let message = ''
if (formattedCommand) {
message += `➤ \`${prefix}${formattedCommand}\``
if (formattedDescription) {
message += `\n${(command.descripcion && typeof command.descripcion === 'function') ? '𖡡' : '≡'} \`\`\`${formattedDescription}\`\`\``
}
if (formattedContext) {
message += '\nⓘ _' + formattedContext + '_' + (index !== array.length - 1 ? '\n' : '')
}}
return message
})
.filter(message => message !== '')
return formattedCommands.join('\n')
}

// comando: Si hay comando en español y inglés separar por (,) máximo 2 comandos 
// descripcion: Parámetros para usar el comando. Separar por (||) máximo 2 descripciones 
// contexto: Explicación de que trata el comando
// showPrefix: Usar true para que muestre el prefijo, de lo contrario usar false
// Si algún objeto no se va usar dejar en false, menos el objeto "comando" ya que si es false no mostrará nada
const commandsInfo = [
{ comando: 'cuentaskatashibot , accounts', descripcion: false, contexto: 'Cuentas oficiales', showPrefix: true },
{ comando: 'grupos , linkgc', descripcion: false, contexto: 'Grupos oficiales', showPrefix: true },
{ comando: 'donar , donate', descripcion: false, contexto: 'Apoya al proyecto donando', showPrefix: true },
{ comando: 'listagrupos , grouplist', descripcion: false, contexto: 'Grupos en donde estoy', showPrefix: true },
{ comando: 'estado , status', descripcion: false, contexto: 'Información de mí estado', showPrefix: true },
{ comando: 'infokatashi , infobot', descripcion: false, contexto: 'Información sobre el Bot', showPrefix: true },
{ comando: 'instalarbot , installbot', descripcion: false, contexto: 'Información y métodos de instalación', showPrefix: true },
{ comando: 'creador , owner', descripcion: false, contexto: 'Información sobre mí Creadora', showPrefix: true },
{ comando: 'velocidad , ping', descripcion: false, contexto: 'Verifica la velocidad de este Bot', showPrefix: true },
{ comando: 'Bot', descripcion: false, contexto: 'Mensaje predeterminado del Bot', showPrefix: false },
{ comando: 'términos y condiciones , terms and conditions', descripcion: false, contexto: 'Revisa detalles al usar este Bot', showPrefix: false },
]
const commandsJadiBot = [
{ comando: 'serbot , jadibot', descripcion: false, contexto: 'Reactiva o Conviértete en Bot secundario', showPrefix: true },
{ comando: 'serbot --code , jadibot --code', descripcion: false, contexto: 'Solicita código de 8 dígitos', showPrefix: true },
{ comando: 'detener , stop', descripcion: false, contexto: 'Dejar de ser temporalmente Sub Bot', showPrefix: true },
{ comando: 'bots , listjadibots', descripcion: false, contexto: 'Lista de Bots secundarios', showPrefix: true },
{ comando: 'borrarsesion , delsession', descripcion: false, contexto: 'Borrar datos de Bot secuandario', showPrefix: true },
{ comando: 'bcbot', descripcion: false, contexto: 'Notificar a usuarios Sub Bots', showPrefix: true },
]
const commandsReport = [
{ comando: 'reporte , report', descripcion: '[texto] || [text]', contexto: 'Reportar comandos con errores', showPrefix: true },
]
const commandsLink = [
{ comando: 'botemporal , addbot', descripcion: '[enlace] [cantidad] || [link] [amount]', contexto: 'Agregar Bot temporalmente a un grupo', showPrefix: true },
]
const commandsPrem = [
{ comando: 'pase premium , pass premium', descripcion: false, contexto: 'Planes para adquirir premium', showPrefix: true },
{ comando: 'listavip , listprem', descripcion: false, contexto: 'Usuarios con tiempo premium', showPrefix: true },
{ comando: 'listapremium , listpremium', descripcion: false, contexto: 'Lista de usuarios premium', showPrefix: true },
]
const commandsGames = [
{ comando: 'matematicas , math', descripcion: '"noob, medium, hard"', contexto: 'Operaciones matemáticas 🧮', showPrefix: true },
{ comando: 'lanzar , launch', descripcion: '"cara" o "cruz"', contexto: 'Moneda de la suerte 🪙', showPrefix: true },
{ comando: 'ppt', descripcion: '"piedra", "papel" o "tijera"', contexto: 'Un clásico 🪨📄✂️', showPrefix: true },
{ comando: 'ttt', descripcion: '[Nombre de la sala] || [Room name]', contexto: 'Tres en línea/rayas ❌⭕', showPrefix: true },
{ comando: 'delttt', descripcion: false, contexto: 'Cerrar/abandonar la partida 🚪', showPrefix: true },
{ comando: 'topgays', descripcion: false, contexto: 'Clasificación de usuarios Gays 🏳️‍🌈', showPrefix: true },
{ comando: 'topotakus', descripcion: false, contexto: 'Clasificación de usuarios Otakus 🎌', showPrefix: true },
{ comando: 'toppajer@s', descripcion: false, contexto: 'Clasificación de usuarios pajeros 🥵', showPrefix: true },
{ comando: 'topintegrantes', descripcion: false, contexto: 'Mejores usuarios 👑', showPrefix: true },
{ comando: 'toplagrasa', descripcion: false, contexto: 'Usuarios más grasosos XD', showPrefix: true },
{ comando: 'toplind@s', descripcion: false, contexto: 'Los más lindos 😻', showPrefix: true },
{ comando: 'topput@s', descripcion: false, contexto: 'Los más p**** 🫣', showPrefix: true },
{ comando: 'toppanafrescos', descripcion: false, contexto: 'Los que más critican 🗿', showPrefix: true },
{ comando: 'topshiposters', descripcion: false, contexto: 'Los que se creen graciosos 🤑', showPrefix: true },
{ comando: 'topfamosos', descripcion: false, contexto: 'Los más conocidos ☝️', showPrefix: true },
{ comando: 'topparejas', descripcion: false, contexto: 'Las 5 mejores 💕', showPrefix: true },
{ comando: 'gay', descripcion: '[@tag]', contexto: 'Perfil Gay 😲', showPrefix: true },
{ comando: 'gay2', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Gay', showPrefix: true },
{ comando: 'lesbiana', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Lesbiana', showPrefix: true },
{ comando: 'manca', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Manca', showPrefix: true },
{ comando: 'manco', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Manco', showPrefix: true },
{ comando: 'pajero', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Pajero', showPrefix: true },
{ comando: 'pajera', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Pajera', showPrefix: true },
{ comando: 'puto', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Puto', showPrefix: true },
{ comando: 'puta', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Puta', showPrefix: true },
{ comando: 'rata', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Rata', showPrefix: true },
{ comando: 'love', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Love', showPrefix: true },
{ comando: 'doxxear', descripcion: '[@tag]', contexto: 'Simular Doxxeo falso 🕵️‍♀️', showPrefix: true },
{ comando: 'pregunta', descripcion: '[texto] || [text]', contexto: 'Pregunta ❔ y responderá', showPrefix: true },
{ comando: 'apostar , slot', descripcion: '[cantidad] || [amount]', contexto: 'Apuesta a la suerte 🎰', showPrefix: true },
{ comando: 'formarpareja', descripcion: false, contexto: 'Une a dos personas 💞', showPrefix: true },
{ comando: 'dado', descripcion: false, contexto: 'Envía un dado aleatorio 🎲', showPrefix: true },
{ comando: 'piropo', descripcion: false, contexto: 'Enviar un piropo 🫢', showPrefix: true },
{ comando: 'chiste', descripcion: false, contexto: 'Envía chistes 🤡', showPrefix: true },
{ comando: 'reto', descripcion: false, contexto: 'Pondrá un reto 😏', showPrefix: true },
{ comando: 'frases', descripcion: '[cantidad 1 al 99] || [amount 1-99]', contexto: 'Envía frases aleatorias 💐', showPrefix: true },
{ comando: 'acertijo', descripcion: false, contexto: 'Responde al mensaje del acertijo 👻', showPrefix: true },
{ comando: 'cancion', descripcion: false, contexto: 'Adivina la canción 🎼', showPrefix: true },
{ comando: 'trivia', descripcion: false, contexto: 'Preguntas con opciones 💭', showPrefix: true },
{ comando: 'pelicula', descripcion: false, contexto: 'Descubre la película con emojis 🎬', showPrefix: true },
{ comando: 'adivinanza', descripcion: false, contexto: 'Adivina adivinador 🧞‍♀️', showPrefix: true },
{ comando: 'ruleta', descripcion: false, contexto: 'Suerte inesperada 💫', showPrefix: true },
{ comando: 'ruletadelban', descripcion:false, contexto: 'Elimina un usuario al azar, solo para admins ☠️', showPrefix: true }
]
const commandsAI = [
{ comando: 'simi', descripcion: '[texto] || [text]', contexto: 'Conversa con SimSimi', showPrefix: true },
{ comando: 'ia , ai', descripcion: '[texto] || [text]', contexto: 'Tecnología de ChatGPT', showPrefix: true },
{ comando: 'delchatgpt', descripcion: false, contexto: 'Eliminar historial de la IA', showPrefix: true },  
{ comando: 'iavoz , aivoice', descripcion: '[texto] || [text]', contexto: 'Respuestas en audios', showPrefix: true },
{ comando: 'calidadimg , qualityimg', descripcion: '(responde con una imagen) || (responds with an image)', contexto: 'Detalles de resolución de imagen', showPrefix: true },
{ comando: 'dalle', descripcion: '[texto] || [text]', contexto: 'Genera imagen a partir de texto', showPrefix: true },
{ comando: 'gemini', descripcion: '[texto] || [text]', contexto: 'IA, Tecnología de Google', showPrefix: true },
{ comando: 'geminimg', descripcion: '(imagen) + [texto] || (image) + [text]', contexto: 'Busca información de una imagen', showPrefix: true },
{ comando: 'hd', descripcion: '(responde con una imagen) || (responds with an image)', contexto: 'Mejorar calidad de imagen', showPrefix: true },
]
