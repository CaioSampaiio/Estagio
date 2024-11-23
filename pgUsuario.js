document.addEventListener('DOMContentLoaded', () => {
    fetch('/status') // Verifica o status de login no backend
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                alert('Você precisa estar logado para acessar esta página.');
                window.location.href = 'login.html';
            }
        })
        .catch(error => {
            console.error('Erro ao verificar status do login:', error);
            window.location.href = 'login.html';
        });
});

// Função para abrir o modal de foto
function showPhotoModal() {
    document.getElementById('photoModal').style.display = 'block';
}

// Função para fechar o modal de foto
function closePhotoModal() {
    document.getElementById('photoModal').style.display = 'none';
}

// Função para abrir o modal de feedback
function showFeedbackModal() {
    document.getElementById('feedbackModal').style.display = 'block';
}

// Função para fechar o modal de feedback
function closeFeedbackModal() {
    document.getElementById('feedbackModal').style.display = 'none';
}

// Enviar a imagem de perfil via AJAX
document.getElementById('photoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('/upload-perfil', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Imagem de perfil salva com sucesso!');
            loadProfileImage(); // Carrega a imagem de perfil
            closePhotoModal(); // Fecha o modal após salvar
        } else {
            alert('Erro ao salvar imagem de perfil: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao salvar imagem de perfil.');
    });
});

// Função para carregar a imagem de perfil
function loadProfileImage() {
    fetch('/imagem-perfil')
        .then(response => {
            if (response.ok) {
                return response.blob();
            } else {
                throw new Error('Imagem de perfil não encontrada.');
            }
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            document.getElementById('userPhoto').src = url; // Exibe a imagem no elemento de perfil
        })
        .catch(error => {
            console.error('Erro ao carregar imagem de perfil:', error);
        });
}

// Carrega a imagem de perfil ao abrir a página
document.addEventListener("DOMContentLoaded", loadProfileImage);
// Enviar Feedback via AJAX
document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const feedback = document.getElementById('feedbackInput').value;
    
    fetch('/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })  // Envia o feedback como JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Feedback enviado com sucesso!');
            closeFeedbackModal();
            document.getElementById('feedbackForm').reset();
        } else {
            alert('Erro ao enviar o feedback: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao enviar o feedback.');
    });
});



fetch('/status')
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    const authLinks = document.getElementById('auth-links');
                    authLinks.innerHTML = `<span>Olá, <strong>${data.nome}</strong>!</span>`;
                }
            })
            .catch(error => console.error('Erro ao verificar o status do login:', error));


document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.permissao !== 0) {
        alert('Acesso negado! Você será redirecionado.');
        window.location.href = 'login.html';
    }
});