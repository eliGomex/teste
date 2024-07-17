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
    const deleteSelectedButton = document.getElementById('deleteSelected');

    goBackButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    deleteSelectedButton.addEventListener('click', () => {
        deleteSelectedImages();
    });

    function displaySavedImages() {
        imagesContainer.innerHTML = '';
        let images = JSON.parse(localStorage.getItem('images')) || [];
        images.forEach((dataUrl, index) => {
            let div = document.createElement('div');
            div.className = 'image-container';

            let img = document.createElement('img');
            img.src = dataUrl;
            img.className = 'gallery-image';

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'image-checkbox';
            checkbox.dataset.index = index;

            div.appendChild(img);
            div.appendChild(checkbox);
            imagesContainer.appendChild(div);
        });
    }

    function deleteSelectedImages() {
        let images = JSON.parse(localStorage.getItem('images')) || [];
        let checkboxes = document.querySelectorAll('.image-checkbox:checked');

        checkboxes.forEach(checkbox => {
            let index = checkbox.dataset.index;
            images.splice(index, 1);
        });

        localStorage.setItem('images', JSON.stringify(images));
        displaySavedImages();
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

