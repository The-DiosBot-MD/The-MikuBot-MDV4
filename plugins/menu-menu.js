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
let menu = `> ${lenguajeGB['smsConfi2']()} *${user.genero === 0 ? '👤' : user.genero == 'Ocultado 🕶️' ? `🕶️` : user.genero == 'Mujer 🚺' ? `🚺` : user.genero == 'Hombre 🚹' ? `🚹` : '👤'} ${user.registered === true ? user.name : taguser}* ${(conn.user.jid == global.conn.user.jid ? '' : `\n*SOY SUB BOT DE: https://wa.me/${global.conn.user.jid.split`@`[0]}*`) || ''}

> *_${formatDate}_*
> \`${nombreLugar} - ${ciudad}\`

> 𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔

> ╭═ ☾✿︎ ${gt} ✿︎︎☽︎
> ┃☭☼︎☼☼︎☼☼︎︎︎𝐈𝐧𝐟𝐨𝐁𝐨𝐭☼︎☼︎☼︎☼︎☼︎
> ┃☭│☘︎𝑊ℎ𝑎𝑡𝑠𝑎𝑝𝑝 𝐵𝑜𝑡 𝐶𝑜𝑟𝑝𝑜𝑟𝑎𝑡𝑖𝑜𝑛𝑠☘︎
> ┃☭│ 
> ┃☭│☞︎︎︎𝐎𝐰𝐧𝐞𝐫 : 𝐀𝐝𝐫𝐢𝐚𝐧𝐎𝐟𝐢𝐜𝐢𝐚𝐥
> ┃☭│☞︎︎︎𝐍𝐮𝐦 : +595976126756
> ┃☭│☞︎︎︎𝐆𝐢𝐭𝐡𝐮𝐛 : ${repo}
> ┃☭│☞︎︎︎𝐈𝐆 : ${ins}
> ┃☭│☞︎︎︎𝐘𝐨𝐮𝐭𝐮𝐛𝐞 : ${you}
> ┃☭│☞︎︎︎𝐆𝐫𝐮𝐩𝐨 𝐎𝐅𝐂 : ${gofc}
> ┃☭│☞︎︎︎𝐂𝐚𝐧𝐚𝐥 𝐎𝐅𝐂 : ${cofc}
> ┃☭│☞︎︎︎𝐀𝐜𝐭𝐢𝐯𝐚𝐫 𝐞𝐧 : ${host}
> ┃☭╰────────────
> ╰══════════════⊷
> 𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔𖣔
> ╭ 🥀 *❀𝐼𝑛𝑓𝑜 𝑑𝑒𝑙 𝑢𝑠𝑢𝑎𝑟𝑖𝑜 𝒚 𝑒𝑠𝑡𝑎𝑑𝑖𝑠𝑡𝑖𝑐𝑎𝑠❀* 🥀
> ┃
> ┃☭│ 𖤍 *${lenguajeGB['smsTotalUsers']()}* 
> ┃☭│ 𖤍 ➺ \`\`\`${Object.keys(global.db.data.users).length}\`\`\`
> ┃☭╞════════════
> ┃☭│ 𖤍 *𝑼𝒔𝒖𝒂𝒓𝒊𝒐𝒔 𝒓𝒆𝒈𝒊𝒔𝒕𝒓𝒂𝒅𝒐𝒔* 
> ┃☭│ 𖤍 ➺ \`\`\`${rtotalreg}/${totalreg}\`\`\`    
> ┃☭╞════════════
> ┃☭│ 𖤍 *${lenguajeGB['smsUptime']()}* 
> ┃☭│ 𖤍 ➺ \`\`\`${uptime}\`\`\`
> ┃☭╞════════════
> ┃☭│ 𖤍 *${lenguajeGB['smsVersion']()}* 
> ┃☭│ 𖤍 ➺ \`\`\`${vs}\`\`\`
> ┃☭╞════════════
> ┃☭│ 𖤍 *${lenguajeGB['smsMode']()}* 
> ┃☭│ 𖤍 ➺ \`${global.opts['self'] ? `${lenguajeGB['smsModePrivate']().charAt(0).toUpperCase() + lenguajeGB['smsModePrivate']().slice(1).toLowerCase()}` : `${lenguajeGB['smsModePublic']().charAt(0).toUpperCase() + lenguajeGB['smsModePublic']().slice(1).toLowerCase()}`}\`
> ┃☭╞════════════
> ┃☭│ 𖤍 *${lenguajeGB['smsBanChats']()}* 
> ┃☭│ 𖤍 ➺ \`\`\`${Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned).length}\`\`\`
> ┃☭╞════════════
> ┃☭│ 𖤍 *${lenguajeGB['smsBanUsers']()}* 
> ┃☭│ 𖤍 ➺ \`\`\`${Object.entries(global.db.data.users).filter(user => user[1].banned).length}\`\`\`
> ┃☭╞════════════
> ┃☭│ *❰❰ Tipo de registro ❱❱*
> ┃☭│ ➺ ${user.registered === true ? `_${user.registroC === true ? '🗂️ Registro Completo' : '📑 Registro Rápido'}_` : '❌ _Sin registro_'}
> ┃☭╞════════════
> ┃☭│ *❰❰ Mi estado ❱❱*
> ┃☭│ ➺ ${typeof user.miestado !== 'string' ? '❌ *Establecer usando:* _' + usedPrefix + 'miestado_' : '_Me siento ' + user.miestado + '_'}
> ┃☭╞════════════
> ┃☭│ *❰❰ Registrado ❱❱*
> ┃☭│ ➺ ${user.registered === true ? '✅ Verificado' : '❌ *Establecer registro usando:* _' + usedPrefix + 'verificar_'}
> ┃☭╞════════════
> ┃☭│ *❰❰ ${lenguajeGB['smsBotonM7']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM7']().slice(1).toLowerCase()} ❱❱* 
> ┃☭│ ➺ ${user.premiumTime > 0 ? '✅ Eres usuario Premium' : '❌ *Establecer Premium:* _' + usedPrefix + 'pase premium_'}
> ┃☭╞════════════
> ┃☭│ *❰❰ ${lenguajeGB['smsBotonM5']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM5']().slice(1).toLowerCase()} ❱❱* 
> ┃☭│ ➺ ${role}
> ┃☭╞════════════
> ┃☭│ *❰❰ ${lenguajeGB['smsBotonM6']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM6']().slice(1).toLowerCase()} ❱❱*
> ┃☭│ ➺ ${emoji} \`${user.exp - min}/${xp}\`
> ┃☭╞════════════
> ┃☭│ *❰❰ ${lenguajeGB['smsPareja']()} ❱❱*
> ┃☭│ ➺ ${pareja ? `${name} 💕 ${conn.getName(pareja)}` : `🛐 ${lenguajeGB['smsResultPareja']()}`}
> ┃☭╞════════════
> ┃☭│ *❰❰ Pasatiempo(s) ❱❱* 
> ┃☭│ ➺ ${user.pasatiempo === 0 ? '*Sin Registro*' : user.pasatiempo + '\n'}
> ┃☭│
> ┃☭╞════════════
> ┃☭╒════════════
> ╭━         *᯾𝑰𝒏𝒇𝒐 𝒅𝒆𝒍 𝒃𝒐𝒕᯾*
┃🌺 _.cuentas_
┃🌺 _.grupos_
┃🌺 _.donar_
┃🌺 _.listagrupos_
┃🌺 _.estado_
┃🌺 _.infobot_
┃🌺 _.instalarbot_
┃🌺 _.owner_
┃🌺 _.velocidad_
┃🌺 _Bot_ 
┃🌺 _términos y condiciones_
> ╭━         *〔 𝑭𝒖𝒏𝒄𝒊𝒐𝒏𝒆𝒔 𝑵𝒖𝒆𝒗𝒂𝒔 〕*
┃⚠️ _.killmenu_
┃⚠️ _.histori_
> ╭━         *〔 𝑭𝒖𝒏𝒄𝒊𝒐𝒏 𝒅𝒆 𝒔𝒆𝒓𝒃𝒐𝒕 〕*
┃🖥 _.serbot_
┃🖥 _.serbot --code_
┃🖥 _.bots_
┃🖥 _.detener_
┃🖥 _.bcbot_
> ╭━         *〔 𝑹𝒆𝒑𝒐𝒓𝒕𝒆𝒔 𝒐 𝑭𝒂𝒍𝒍𝒐𝒔 〕*
┃ 📮 _.reporte *texto*_
┃ 📮 _.report *texto*_
> ╭━          *〔 𝑼𝒏𝒆 𝒂𝒍 𝒃𝒐𝒕 𝒂 𝒕𝒖 𝒈𝒓𝒖𝒑𝒐 〕 *
┃🌟 _.botemporal *enlace* *cantidad*_
> ╭━          *〔 𝑷𝒓𝒆𝒎𝒊𝒖𝒏 〕*
┃🎫 _.listapremium_
┃🎫 _.pase premium_
┃🎫 _.pass premium_
> ╭━         *〔 𝑱𝒖𝒆𝒈𝒐𝒔 〕*
┃🤹‍ _.mates_
┃🤹‍ _.lanzar *cara* o *cruz*
┃🤹‍ _.ppt *piedra,papel,tijera*_
┃🤹‍ _.tictactoe_
┃🤹‍ _.deltictactoe_
┃🤹‍ _.topgays_
┃🤹‍ _.topotakus_
┃🤹‍ _.toppajer@s_
┃🤹‍ _.topput@s_
┃🤹‍ _.topintegrantes_
┃🤹‍ _.toplagrasa_
┃🤹‍ _.toppanafrescos_
┃🤹‍ _.topshiposters_
┃🤹‍ _.toplindos_
┃🤹‍ _.topfamosos_
┃🤹‍ _.topparejas_
┃🤹‍ _.gay *@tag*_
┃🤹‍ _.gay2 *nombre : @tag*_
┃🤹‍ _.lesbiana *nombre : @tag*_
┃🤹‍ _.manca *nombre : @tag*_
┃🤹‍ _.manco *nombre : @tag*_
┃🤹‍ _.pajero *nombre : @tag*_
┃🤹‍ _.pajera *nombre : @tag*_
┃🤹‍ _.puto *nombre : @tag*_
┃🤹‍ _.puta *nombre : @tag*_
┃🤹‍ _.rata *nombre : @tag*_
┃🤹‍ _.love *nombre : @tag*_
┃🤹‍ _.doxear *nombre : @tag*_
┃🤹‍ _.doxxeame_
┃🤹‍ _.pregunta *texto*_
┃🤹‍ _.apostar | slot *cantidad*_
┃🤹‍ _.formarpareja_
┃🤹‍ _.dado_
┃🤹‍ _.verdad_
┃🤹‍ _.reto_
┃🤹‍ _.multijuegos_
┃🤹‍ _.juegos_
> ╭━    〔 𝑰𝒏𝒕𝒆𝒍𝒊𝒈𝒆𝒏𝒄𝒊𝒂 𝑨𝒓𝒕𝒊𝒇𝒊𝒄𝒊𝒂𝒍 〕*
┃🦋 _.okgoogle *texto*_
┃🦋 _.siri *texto*_
┃🦋 _.bixby *texto*_
> ╭━      [ 𝑪𝒐𝒏𝒇𝒊𝒈𝒖𝒓𝒂𝒄𝒊𝒐𝒏 ]*
┃🔧 _.on *:* off *welcome*_
┃🔧 _.on *:* off *detect*_
┃🔧 _.on *:* off *autolevelup*_
┃🔧 _.on *:* off *restrict*_
┃🔧 _.on *:* off *anticall*_
┃🔧 _.on *:* off *public*_
┃🔧 _.on *:* off *autoread*_
┃🔧 _.on *:* off *temporal*_
┃🔧 _.on *:* off *stickers*_
┃🔧 _.on *:* off *autosticker*_
┃🔧 _.on *:* off *reaction*_
┃🔧 _.on *:* off *audios*_
┃🔧 _.on *:* off *modohorny*_
┃🔧 _.on *:* off *antitoxic*_
┃🔧 _.on *:* off *antiviewonce*_
┃🔧 _.on *:* off *antidelete*_
┃🔧 _.on *:* off *antifake*_
┃🔧 _.on *:* off *antilink*_
┃🔧 _.on *:* off *antilink2*_
┃🔧 _.on *:* off *antitiktok_
┃🔧 _.on *:* off *antiyoutube*_
┃🔧 _.on *:* off *antitelegram*_
┃🔧 _.on *:* off *antifacebook*_
┃🔧 _.on *:* off *antinstagram*_
┃🔧 _.on *:* off *antitwitter*_
┃🔧 _.on *:* off *pconly*_
┃🔧 _.on *:* off *gconly*_
> ╭━      *〔 𝑮𝒓𝒖𝒑𝒐𝒔-𝑹𝒆𝒔𝒖𝒎𝒆𝒏 〕*
┃🌼 _.configuracion_
┃🌼 _.settings_
┃🌼 _.vergrupo_
> ╭━       *[ 𝑫𝒆𝒔𝒄𝒂𝒓𝒈𝒂𝒔 ]*
┃⬇️ _.imagen | image *texto*_
┃⬇️ _.pinterest | dlpinterest *texto*_
┃⬇️ _.wallpaper|wp *texto*_
┃⬇️ _.play | play2 *texto o link*_
┃⬇️ _.play.1 *texto o link*_
┃⬇️ _.play.2 *texto o link*_ 
┃⬇️ _.ytmp3 | yta *link*_
┃⬇️ _.ytmp4 | ytv *link*_
┃⬇️ _.pdocaudio | ytadoc *link*_
┃⬇️ _.pdocvieo | ytvdoc *link*_
┃⬇️ _.tw |twdl | twitter *link*_
┃⬇️ _.facebook | fb *link*_
┃⬇️ _.instagram *link video o imagen*_
┃⬇️ _.verig | igstalk *usuario(a)*_
┃⬇️ _.ighistoria | igstory *usuario(a)*_
┃⬇️ _.tiktok *link*_
┃⬇️ _.tiktokimagen | ttimagen *link*_
┃⬇️ _.tiktokfoto | tiktokphoto *usuario(a)*_
┃⬇️ _.vertiktok | tiktokstalk *usuario(a)*_
┃⬇️ _.mediafire | dlmediafire *link*_
┃⬇️ _.clonarepo | gitclone *link*_
┃⬇️ _.clima *país ciudad*_
┃⬇️ _.consejo_
┃⬇️ _.morse codificar *texto*_
┃⬇️ _.morse decodificar *morse*_
┃⬇️ _.fraseromantica_
┃⬇️ _.historia_
> ╭━      *[ 𝑪𝒉𝒂𝒕 𝑺𝒆𝒄𝒓𝒆𝒕𝒐 ]*
┃👤 _.chatanonimo_
┃👤 _.anonimoch_
┃👤 _.start_
┃👤 _.next_
┃👤 _.leave_
> ╭━      *[ 𝑨𝒋𝒖𝒔𝒕𝒆𝒔 𝒅𝒆 𝒈𝒓𝒖𝒑𝒐𝒔 ]*
┃🛠 _.add *numero*_
┃🛠 _.kick *@tag*_
┃🛠 _.grupo *abrir : cerrar*_
┃🛠 _.promote *@tag*_
┃🛠 _.demote *@tag*_
┃🛠 _.banchat_
┃🛠 _.unbanchat_
┃🛠 _.banuser *@tag*_
┃🛠 _.unbanuser *@tag*_
┃🛠 _.admins *texto*_
┃🛠 _.invocar *texto*_
┃🛠 _.tagall *texto*_
┃🛠 _.hidetag *texto*_
┃🛠 _.infogrupo_
┃🛠 _.grupotiempo *Cantidad*_
┃🛠 _.advertencia *@tag*_
┃🛠 _.deladvertencia *@tag*_
┃🛠 _.delwarn *@tag*_
┃🛠 _.crearvoto *texto*_
┃🛠 _.sivotar_
┃🛠 _.novotar_
┃🛠 _.vervotos_
┃🛠 _.delvoto_
┃🛠 _.link_
┃🛠 _.nuevonombre *texto*_
┃🛠 _.descripcion *texto*_
┃🛠 _.bienvenida *texto*_
┃🛠 _.despedida *texto*_
┃🛠 _.nuevoenlace_
> ╭━     *[ 𝑷𝒂𝒓𝒆𝒋𝒂𝒔 ]*
┃❤️ _.listaparejas_
┃❤️ _.mipareja_
┃❤️ _.pareja *@tag*_
┃❤️ _.aceptar *@tag*_
┃❤️ _.rechazar *@tag*_
┃❤️ _.terminar *@tag*_
> ╭━     *[ 𝑽𝒐𝒕𝒂𝒄𝒊𝒐𝒏𝒆𝒔 ]*
┃📝 _.crearvoto *texto*_
┃📝 _.sivotar_
┃📝 _.novotar_
┃📝 _.vervotos_
┃📝 _.delvoto_
> ╭━     *[ +18 ]*
┃🔞➺ _.hornymenu_
> ╭━     *[ 𝑪𝒐𝒏𝒗𝒆𝒓𝒕𝒊𝒅𝒐𝒓𝒆𝒔 ]*
┃🖼 _.jpg *sticker*_
┃🖼 _.toanime *foto*_
┃🖼 _.tomp3 *video o nota de voz*_
┃🖼 _.vn *video o audio*_
┃🖼 _.tovideo *audio*_
┃🖼 _.tourl *video, imagen*_
┃🖼 _.toenlace  *video, imagen o audio*_
┃🖼 _.tts *texto*_
> ╭━      *[ 𝑳𝒐𝒈𝒐𝒔 ]*
┃🏞 _.logos *efecto texto*_
┃🏞 _.menulogos2_
> ╭━      *[ 𝑬𝒇𝒆𝒄𝒕𝒐𝒔 ]*
┃✨ _.simpcard *@tag*_
┃✨ _.hornycard *@tag*_
┃✨ _.lolice *@tag*_
┃✨ _.ytcomment *texto*_
┃✨ _.itssostupid_
┃✨ _.pixelar_
┃✨ _.blur_
> ╭━      *[ 𝑹𝒂𝒏𝒅𝒐𝒎 ]*
┃🍃 _.chica_
┃🍃 _.chico_
┃🍃 _.cristianoronaldo_
┃🍃 _.messi_
┃🍃 _.meme_
┃🍃 _.meme2_
┃🍃 _.itzy_
┃🍃 _.blackpink_
┃🍃 _.kpop *blackpink : exo : bts*_
┃🍃 _.lolivid_
┃🍃 _.loli_
┃🍃 _.navidad_
┃🍃 _.ppcouple_
┃🍃 _.neko_
┃🍃 _.waifu_
┃🍃 _.akira_
┃🍃 _.akiyama_
┃🍃 _.anna_
┃🍃 _.asuna_
┃🍃 _.ayuzawa_
┃🍃 _.boruto_
┃🍃 _.chiho_
┃🍃 _.chitoge_
┃🍃 _.deidara_
┃🍃 _.erza_
┃🍃 _.elaina_
┃🍃 _.eba_
┃🍃 _.emilia_
┃🍃 _.hestia_
┃🍃 _.hinata_
┃🍃 _.inori_
┃🍃 _.isuzu_
┃🍃 _.itachi_
┃🍃 _.itori_
┃🍃 _.kaga_
┃🍃 _.kagura_
┃🍃 _.kaori_
┃🍃 _.keneki_
┃🍃 _.kotori_
┃🍃 _.kurumi_
┃🍃 _.madara_
┃🍃 _.mikasa_
┃🍃 _.miku_
┃🍃 _.minato_
┃🍃 _.naruto_
┃🍃 _.nezuko_
┃🍃 _.sagiri_
┃🍃 _.sasuke_
┃🍃 _.sakura_
┃🍃 _.cosplay_
> ╭━     *[ 𝑴𝒐𝒅𝒊𝒇𝒊𝒄𝒂𝒓 𝑨𝒖𝒅𝒊𝒐𝒔 ]*
┃🎤 _.bass_
┃🎤 _.blown_
┃🎤 _.deep_
┃🎤 _.earrape_
┃🎤 _.fast_
┃🎤 _.fat_
┃🎤 _.nightcore_
┃🎤 _.reverse_
┃🎤 _.robot_
┃🎤 _.slow_
┃🎤 _.smooth_
┃🎤 _.tupai_
> ╭━     *[ 𝑩𝒖𝒔𝒒𝒖𝒆𝒅𝒂𝒔 ]*
┃🔍 _.animeinfo *texto*_
┃🔍 _.mangainfo *texto*_
┃🔍 _.google *texto*_
┃🔍 _.googlelyrics *texto*_
┃🔍 _.letra *texto*_
┃🔍 _.yts *texto*_
┃🔍 _.wikipedia *texto*_
> ╭━     *[ 𝑨𝒖𝒅𝒊𝒐𝒔  ]*
┃🎙 _.audios_
> ╭━     *[ 𝑯𝒆𝒓𝒓𝒂𝒎𝒊𝒆𝒏𝒕𝒂𝒔 ]*
┃🧰 _.afk *motivo*_
┃🧰 _.acortar *url*_
┃🧰 _.calc *operacion math*_
┃🧰 _.del *respondre a mensaje del Bot*_
┃🧰 _.qrcode *texto*_
┃🧰 _.readmore *texto1|texto2*_
┃🧰 _.spamwa *numero|texto|cantidad*_
┃🧰 _.styletext *texto*_
┃🧰 _.traducir *texto*_
┃🧰 _.morse codificar *texto*_
┃🧰 _.morse decodificar *morse*_
┃🧰 _.encuesta | poll *Motivo*_
┃🧰 _.horario_
> ╭━     *[ 𝑭𝒖𝒏𝒄𝒊𝒐𝒏𝒆𝒔 𝑹𝑷𝑮 ]*
┃💲 _.botemporal *enlace* *cantidad*_
┃💲 _.pase premium_
┃💲 _.listapremium_
┃💲 _.transfer *tipo cantidad @tag*_
┃💲 _.dar *tipo cantidad @tag*_
┃💲 _.enviar *tipo cantidad @tag*_
┃💲 _.balance_
┃💲 _.cartera_
┃💲 _.exp_
┃💲 _.top_
┃💲 _.nivel | level | lvl_
┃💲 _.rango_
┃💲 _.inventario_
┃💲 _.aventura_
┃💲 _.cazar_
┃💲 _.pescar_
┃💲 _.animales_
┃💲 _.alimentos_
┃💲 _.curar_
┃💲 _.buy_
┃💲 _.sell_
┃💲 _.verificar_
┃💲 _.perfil_
┃💲 _.myns_
┃💲 _.unreg *numero de serie*_
┃💲 _.minardiamantes_
┃💲 _.minarcoins_
┃💲 _.minarexp_
┃💲 _.minar *:* minar2 *:* minar3_
┃💲 _.claim_
┃💲 _.cadahora_
┃💲 _.semanal_
┃💲 _.mes_
┃💲 _.cofre_
┃💲 _.trabajar|work_
> ╭━     *[ 𝑵𝒊𝒗𝒆𝒍𝒆𝒔 ]*
┃🥇 _.top_
> ╭━     *[ 𝑺𝒕𝒊𝒄𝒌𝒆𝒓𝒔 𝒚 𝑭𝒊𝒍𝒕𝒓𝒐𝒔 ]*
┃🔮 _.s *imagen o video*_
┃🔮 _.s *url de tipo jpg*_
┃🔮 _.emojimix *🌼+🌺*_
┃🔮 _.imagen*_
┃🔮 _.emoji *tipo emoji*_
┃🔮 _.attp *texto*_
┃🔮 _.attp2 *texto*_
┃🔮 _.ttp *texto*_
┃🔮 _.ttp2 *texto*_
┃🔮 _.ttp3 *texto*_
┃🔮 _.ttp4 *texto*_
┃🔮 _.ttp5 *texto*_
┃🔮 _.ttp6 *texto*_
┃🔮 _.dado_
┃🔮 _.stickermarker *efecto : responder a imagen*_
┃🔮 _.stickerfilter *efecto : responder a imagen*_
┃🔮 _.cs *:* cs2_
> ╭━     *[ 𝑴𝒐𝒅𝒊𝒇𝒊𝒄𝒂𝒓 𝑺𝒕𝒊𝒄𝒌𝒆𝒓𝒔 ]*
┃🎨 _.wm *packname|author*_
┃🎨 _.wm *texto1|texto2*_
> ╭━     *[ 𝑺𝒕𝒊𝒄𝒌𝒆𝒓𝒔 ]*
┃🌌 _.palmaditas *@tag*_
┃🌌 _.bofetada *@tag*_
┃🌌 _.golpear *@tag*_
┃🌌 _.besar *@tag*_
┃🌌 _.alimentar *@tag*_
> ╭━     *[ 𝑷𝒓𝒐𝒑𝒊𝒆𝒕𝒂𝒓𝒊𝒐 ]*
┃👑 _.join *enlace*_
┃👑 _.dardiamantes *cantidad*_
┃👑 _.darxp *cantidad*_
┃👑 _.darcoins *cantidad*_
┃👑 _.addprem *@tag* *cantidad*_
┃👑 _.addprem2 *@tag* *cantidad*_
┃👑 _.addprem3 *@tag* *cantidad*_
┃👑 _.addprem4 *@tag* *cantidad*_
┃👑 _.idioma_
┃👑 _.cajafuerte_
┃👑 _.bc *texto*_
┃👑 _.bcc *texto*_
┃👑 _.comunicarpv *texto*_
┃👑 _.broadcastgc *texto*_
┃👑 _.comunicargrupos *texto*_
┃👑 _.borrartmp_
┃👑 _.delexp *@tag*_
┃👑 _.delcoins *@tag*_
┃👑 _.deldiamantes *@tag*_
┃👑 _.reiniciar_
┃👑 _.update_
┃👑 _.addprem *@tag*_
┃👑 _.delprem *@tag*_
┃👑 _.listprem_
┃👑 _.añadirdiamantes *@tag cantidad*_
┃👑 _.añadirxp *@tag cantidad*_
┃👑 _.añadircoins *@tag cantidad*_
> *╰━━━━━━━━━━━━⬣
`.trim()
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
