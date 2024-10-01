const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    // Tüm bağlı kullanıcılara mesajı gönder
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.send('Sunucuya başarıyla bağlandınız!');
});

console.log('WebSocket sunucusu 8080 portunda çalışıyor...');
