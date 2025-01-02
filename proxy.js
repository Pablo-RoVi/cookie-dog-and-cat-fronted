const http = require('http');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
            const {pdfData, filename } = JSON.parse(body);

            const msg = {
                to: 'nunezseba1605@gmail.com',
                from: 'nunezseba1605@gmail.com', // Tu correo
                subject: "Reporte de ventas", // Asunto
                text: "Adjunto encontrarás el reporte de ventas.",
                html: "<strong>Adjunto encontrarás el reporte de ventas.</strong>",
                attachments: [
                {
                    content: pdfData, // El archivo PDF en base64
                    filename: filename, // Nombre del archivo
                    type: "application/pdf", // Tipo MIME
                    disposition: "attachment", // Asegúrate de que sea un adjunto
                },
                ],
            };

            // Enviar el correo
            await sgMail.send(msg);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Correo enviado exitosamente.' }));
            } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al enviar el correo.' }));
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Método no permitido.' }));
    }
});

server.listen(3001, () => {
  console.log('Proxy corriendo en http://localhost:3001');
});
