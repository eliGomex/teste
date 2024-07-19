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

// Solicitar permissão para notificações
function solicitarPermissaoNotificacao() {
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permissao => {
            if (permissao !== 'granted') {
                console.log('Permissão para notificações não foi concedida.');
            }
        });
    }
}

solicitarPermissaoNotificacao();

// Para a página index.html
if (document.getElementById('tirarFoto')) {
    const video = document.getElementById('transmissaoCamera');
    const canvas = document.getElementById('canvasCamera');
    const contexto = canvas.getContext('2d');
    const botaoTirarFoto = document.getElementById('tirarFoto');
    const botaoIrParaGaleria = document.getElementById('irParaGaleria');

    // Solicitar permissão para acessar a câmera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("Erro ao acessar a câmera: ", err);
      });

    botaoTirarFoto.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

        salvarImagemNoLocalStorage(canvas.toDataURL());
        mostrarNotificacao('Foto tirada', 'Sua foto foi tirada com sucesso!');
    });

    botaoIrParaGaleria.addEventListener('click', () => {
        window.location.href = 'gallery.html';
    });

    function salvarImagemNoLocalStorage(dataUrl) {
        let imagens = JSON.parse(localStorage.getItem('imagens')) || [];
        imagens.push(dataUrl);
        localStorage.setItem('imagens', JSON.stringify(imagens));
    }

    function mostrarNotificacao(titulo, corpo) {
        if (Notification.permission === 'granted') {
            navigator.serviceWorker.getRegistration().then(function(reg) {
                reg.showNotification(titulo, {
                    body: corpo,
                    icon: '/icon-192x192.png',
                });
            });
        }
    }
}

// Para a página gallery.html
if (document.getElementById('voltar')) {
    const containerImagens = document.getElementById('containerImagens');
    const botaoVoltar = document.getElementById('voltar');
    const botaoApagarSelecionadas = document.getElementById('apagarSelecionadas');

    botaoVoltar.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    botaoApagarSelecionadas.addEventListener('click', () => {
        apagarImagensSelecionadas();
    });

    function exibirImagensSalvas() {
        containerImagens.innerHTML = '';
        let imagens = JSON.parse(localStorage.getItem('imagens')) || [];
        imagens.forEach((dataUrl, index) => {
            let div = document.createElement('div');
            div.className = 'containerImagem';

            let img = document.createElement('img');
            img.src = dataUrl;
            img.className = 'imagemGaleria';

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkboxImagem';
            checkbox.dataset.index = index;

            div.appendChild(img);
            div.appendChild(checkbox);
            containerImagens.appendChild(div);
        });
    }

    function apagarImagensSelecionadas() {
        let imagens = JSON.parse(localStorage.getItem('imagens')) || [];
        let checkboxes = document.querySelectorAll('.checkboxImagem:checked');

        checkboxes.forEach(checkbox => {
            let index = checkbox.dataset.index;
            imagens.splice(index, 1);
        });

        localStorage.setItem('imagens', JSON.stringify(imagens));
        exibirImagensSalvas();
    }

    window.onload = () => {
        exibirImagensSalvas();
    };
}
