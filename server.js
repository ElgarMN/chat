const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Statik dosyaları sun
app.use(express.static('public'));

// Ana sayfa isteği
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// WebSocket bağlantısı
wss.on('connection', (ws) => {
    console.log('Yeni bir bağlantı kuruldu.');

    ws.on('message', (message) => {
        console.log(`Gelen mesaj: ${message}`);

        // Tüm bağlı istemcilere mesaj gönder
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message); // Mesajı doğrudan gönder
            }
        });
    });

    ws.on('close', () => {
        console.log('Bağlantı kapatıldı.');
    });
});

// Sunucu dinleme
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
