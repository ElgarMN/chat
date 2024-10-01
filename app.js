const socket = new WebSocket('ws://localhost:8080');  // WebSocket'e bağlanıyoruz

const chatBox = document.getElementById('chat-box');
const sendButton = document.getElementById('send-button');
const messageInput = document.getElementById('message');

// WebSocket bağlantısı açıldığında sunucudan gelen mesajı dinle
socket.addEventListener('open', function (event) {
    console.log('WebSocket bağlantısı kuruldu.');
});

// Sunucudan gelen mesajı alıp chat kutusuna ekle
socket.addEventListener('message', function (event) {
    const messageElement = document.createElement('div');
    messageElement.textContent = event.data;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

sendButton.addEventListener('click', sendMessage);

function sendMessage() {
    const message = messageInput.value;
    if (message.trim() === '') return;

    // Konum bilgisi alalım
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        
        // Ters geocoding ile gerçek adresi al
        getAddressFromCoordinates(latitude, longitude)
            .then(address => {
                // Mesajı konum ve adres bilgisi ile birlikte gönder
                const fullMessage = `${message} (Konum: ${latitude}, ${longitude}, Adres: ${address})`;
                socket.send(fullMessage);  // Mesajı WebSocket sunucusuna gönder

                // Mesajı chat kutusuna da ekle
                const messageElement = document.createElement('div');
                messageElement.textContent = fullMessage;
                chatBox.appendChild(messageElement);

                // Mesaj alanını temizle
                messageInput.value = '';

                // Chat kutusunu otomatik aşağıya kaydır
                chatBox.scrollTop = chatBox.scrollHeight;
            })
            .catch(error => {
                alert('Adres bilgisi alınamadı: ' + error.message);
            });

    }, error => {
        alert('Konum bilgisi alınamadı: ' + error.message);
    });
}

// Ters geocoding: Enlem ve boylamı kullanarak adresi almak
function getAddressFromCoordinates(latitude, longitude) {
    const apiKey = 'AIzaSyCYbz2roDa0saKdj6AXm2pSHx15x1E51Io';  // Google API anahtarınızı buraya ekleyin
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Geocoding API Yanıtı:', data);  // Yanıtı konsola yazdırarak kontrol edelim
            if (data.status === 'OK' && data.results.length > 0) {
                // İlk sonucu al ve adresi döndür
                return data.results[0].formatted_address;
            } else {
                throw new Error('Adres bulunamadı. Durum: ' + data.status);
            }
        })
        .catch(error => {
            console.error('Geocoding Hatası:', error);
            throw error;
        });
}
