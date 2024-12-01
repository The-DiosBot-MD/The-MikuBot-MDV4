let handler = async (m, { conn, command, usedPrefix }) => {
let infinitytxt = `
*Optimice la implementación del bot mediante la integración en un servicio de alojamiento de alto rendimiento.*
Aprovecha la compatibilidad y comienza usar el bot en servidores de alto rendimiento. El Staff de HostingPY hacen posible que puedas ejecutar las funciones que tanto te gusta usar sintiendo una experiencia fluida y de calidad.

🔵 \`\`\`Información del Host\`\`\`

✨ *Dashboard*
https://dahs.hostingpy.shop/

⚙️ *Panel*
https://panel.hostingpy.shop/

📧 *Correo*
adrianalegresanchez905@gmail.com

🧑‍💻 *Contacto (AdrianOficial)*
https://wa.me/595976126756
`
await conn.sendFile(m.chat, 'https://ibb.co/fqx9NFT/The-MIkuBot-MD.jpg', 'HostingPY.jpg', infinitytxt.trim(), fkontak, true, {
contextInfo: {
'forwardingScore': 200,
'isForwarded': false,
externalAdReply: {
showAdAttribution: true,
renderLargerThumbnail: false,
title: `☁ HostingPY ☁`,
body: `El Hosting que tu proyecto requiere`,
mediaType: 1,
sourceUrl: accountsgb,
thumbnailUrl: 'https://ibb.co/fqx9NFT/The-MIkuBot-MD.jpg'
}}
}, { mentions: m.sender })

}
handler.command = /^(hostigpy|host)$/i
export default handler
