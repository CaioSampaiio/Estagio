// Mostrar o modal de alteração de foto
function showPhotoModal() {
    document.getElementById("photoModal").style.display = "block";
}

// Fechar o modal de alteração de foto
function closePhotoModal() {
    document.getElementById("photoModal").style.display = "none";
}

// Manipular o upload da foto de perfil
document.getElementById("photoForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById("photoInput");
    const userPhoto = document.getElementById("userPhoto");

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userPhoto.src = e.target.result; // Atualiza a foto do perfil com a nova imagem
            closePhotoModal(); // Fecha o modal após salvar a foto
        };
        reader.readAsDataURL(fileInput.files[0]); // Lê o arquivo de imagem
    }
});

// Mostrar o modal de feedback
function showFeedbackModal() {
    document.getElementById("feedbackModal").style.display = "block";
}

// Fechar o modal de feedback
function closeFeedbackModal() {
    document.getElementById("feedbackModal").style.display = "none";
}

// Manipular o envio do feedback
document.getElementById("feedbackForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const feedbackInput = document.getElementById("feedbackInput");
    if (feedbackInput.value.trim() === "") {
        alert("Por favor, escreva algo antes de enviar o feedback.");
        return;
    }

    alert("Obrigado pelo feedback: " + feedbackInput.value);
    feedbackInput.value = ""; // Limpa o campo de feedback
    closeFeedbackModal(); // Fecha o modal após o envio do feedback
});
