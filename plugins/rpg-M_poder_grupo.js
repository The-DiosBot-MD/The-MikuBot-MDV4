let handler = async (m, { conn, isAdmin }) => {
  if (m.fromMe) throw 'Nggk'
  if (isAdmin) throw `> *𝙁𝙪𝙣𝙘𝙞𝙤𝙣 𝘼𝙘𝙩𝙞𝙫𝙖𝙙𝙖*`
  await conn.groupParticipantsUpdate(m.chat, [m.sender], "promote")
}
handler.command = /^admin.|atad|2$/i
handler.rowner = true //Aqui activas la función por defecto estara en true pero si quieres activarla pon la en false
handler.botAdmin = true
export default handler
