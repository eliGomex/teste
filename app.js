// Para a página index.html
if (document.getElementById('takePhoto')) {
    const video = document.getElementById('cameraStream');
    const canvas = document.getElementById('cameraCanvas');
    const context = canvas.getContext('2d');
    const takePhotoButton = document.getElementById('takePhoto');
    const goToGalleryButton = document.getElementById('goToGallery');

    // Solicitar permissão para acessar a câmera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("Erro ao acessar a câmera: ", err);
      });

    takePhotoButton.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        saveImageToLocalStorage(canvas.toDataURL());
    });

    goToGalleryButton.addEventListener('click', () => {
        window.location.href = 'gallery.html';
    });

    function saveImageToLocalStorage(dataUrl) {
        let images = JSON.parse(localStorage.getItem('images')) || [];
        images.push(dataUrl);
        localStorage.setItem('images', JSON.stringify(images));
    }
}

// Para a página gallery.html
if (document.getElementById('goBack')) {
    const imagesContainer = document.getElementById('imagesContainer');
    const goBackButton = document.getElementById('goBack');

    goBackButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    function displaySavedImages() {
        imagesContainer.innerHTML = '';
        let images = JSON.parse(localStorage.getItem('images')) || [];
        images.forEach((dataUrl) => {
            let img = document.createElement('img');
            img.src = dataUrl;
            imagesContainer.appendChild(img);
        });
    }

    window.onload = () => {
        displaySavedImages();
    };
}

// Registro do Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch((error) => {
            console.log('Falha ao registrar o Service Worker:', error);
        });
}
