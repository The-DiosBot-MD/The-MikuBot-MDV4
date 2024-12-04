import { createHash } from 'crypto' 
import PhoneNumber from 'awesome-phonenumber'
import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let pp = 'https://qu.ax/UrGyu.mp4'
//const pp = await conn.profilePictureUrl(conn.user.jid).catch(_ => './src/avatar_contact.png')
let user = global.db.data.users[m.sender]
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
try {
pp = await conn.getProfilePicture(who)         //pp = await conn.getProfilePicture(who)
} catch (e) {

} finally {
let { name, limit, lastclaim, registered, regTime, age } = global.db.data.users[who]
//let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
let prem = global.prems.includes(who.split`@`[0])
let sn = createHash('md5').update(who).digest('hex')
let str =
`> *The-MikuBot-MDV4 ª【✫𝚃𝙴𝙰𝙼  乂 𝚂𝚃𝙰𝚁𝙲𝙾𝚁𝙴✫】*

> *Poya el canal del Team con tu apoyo seras de mucha ayuda* 

> *ID : 120363314192605628@newsletter*

> *Link : https://whatsapp.com/channel/0029Vaj67qQJUM2Wa5Ey3y1v*

*_Whatsapp Bot by Corporations..._*`.trim()
    conn.sendFile(m.chat, pp, 'pp.mp4', str, fkontak, false, { contextInfo: { mentionedJid }}) 
  }
}
handler.help = ['profile [@user]']
handler.tags = ['xp']
handler.command = /^Prueb|starcore?$/i
export default handler
