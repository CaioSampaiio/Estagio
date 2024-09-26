// Mostrar o modal de alteração de foto
function showAdicionarModal() {
    document.getElementById("cadModal").style.display = "block";
}

// Fechar o modal de alteração de foto
function closePhotoModal() {
    document.getElementById("cadModal").style.display = "none";
}

// Manipular o upload da foto do móvel
document.getElementById("cadMoveis").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById("photoInput");
    const userPhoto = document.getElementById("userPhoto");

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        closePhotoModal(); // Fecha o modal após salvar a foto
        };
        reader.readAsDataURL(fileInput.files[0]); // Lê o arquivo de imagem
});

fetch('/status')
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    const authLinks = document.getElementById('auth-links');
                    authLinks.innerHTML = `<span>Bem-vindo, <strong>${data.nome}</strong>!</span>
                                           <a href="/logout">Sair</a>`;
                }
            })
            .catch(error => console.error('Erro ao verificar o status do login:', error));

