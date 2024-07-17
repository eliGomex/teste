document.addEventListener('DOMContentLoaded', function() {
    // Função para capturar e armazenar foto
    document.getElementById('takePhoto').addEventListener('click', function() {
        const video = document.getElementById('cameraStream');
        const canvas = document.getElementById('cameraCanvas');
        const constraints = {
            video: true
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                video.srcObject = stream;
                video.style.display = 'block';

                video.addEventListener('click', function() {
                    const context = canvas.getContext('2d');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const base64String = canvas.toDataURL('image/png').replace('data:image/png;base64,', '');
                    
                    let storedImages = JSON.parse(localStorage.getItem('images')) || [];
                    storedImages.push(base64String);
                    localStorage.setItem('images', JSON.stringify(storedImages));

                    // Stop the video stream
                    stream.getTracks().forEach(track => track.stop());
                    video.style.display = 'none';
                    alert('Imagem capturada e armazenada com sucesso!');
                }, { once: true });
            })
            .catch(function(error) {
                console.log('Erro ao acessar a câmera: ', error);
                alert('Erro ao acessar a câmera. Por favor, verifique as permissões.');
            });
    });

    // Navegar para a galeria
    document.getElementById('goToGallery').addEventListener('click', function() {
        window.location.href = 'gallery.html';
    });

    // Exibir imagens na galeria
    if (window.location.pathname.endsWith('gallery.html')) {
        window.addEventListener('DOMContentLoaded', function() {
            const storedImages = JSON.parse(localStorage.getItem('images')) || [];
            const gallery = document.getElementById('gallery');
            storedImages.forEach(function(image) {
                const imgElement = document.createElement('img');
                imgElement.src = 'data:image/png;base64,' + image;
                gallery.appendChild(imgElement);
            });

            // Botão de voltar
            document.getElementById('goBack').addEventListener('click', function() {
                window.location.href = 'index.html';
            });
        });
    }

    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
                console.log('Service Worker registrado com sucesso:', registration);
            }, function(error) {
                console.log('Falha ao registrar o Service Worker:', error);
            });
        });
    }

    // Solicitar permissão para notificações push
    if ('Notification' in window && 'serviceWorker' in navigator) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                setInterval(() => {
                    navigator.serviceWorker.ready.then(registration => {
                        registration.showNotification('Lembrete', {
                            body: 'Hora de registrar mais momentos!',
                            icon: 'icon-192x192.png'
                        });
                    });
                }, 2 * 60 * 1000); // Notificação a cada 2 minutos
            }
        });
    }
});
