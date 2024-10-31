document.getElementById('loginBtn').addEventListener('click', function() {
    window.location.href = "pgLogin.html";
});

document.getElementById('cadastroBtn').addEventListener('click', function() {
    window.location.href = "pgCadastro.html";
});

document.getElementById('userBtn').addEventListener('click', function() {
    window.location.href = "pgUsuario.html";
});


function Login() {
    const loginBtn = document.getElementById("loginBtn");
    const cadastroBtn = document.getElementById("cadastroBtn");
    const userBtn = document.getElementById("userBtn");
    
    if (loginBtn && cadastroBtn && userBtn) {
        // Esconde os botões de login e cadastro
        loginBtn.style.display = "none";
        cadastroBtn.style.display = "none";

        // Mostra o botão do usuário
        userBtn.style.display = "block";
    } else {
        console.error("Não foi possível encontrar um ou mais botões no DOM.");
    }
}


function openUserProfile() {
    // Função para abrir a tela de usuário
    window.location.href = "/pgUsuario.html";
}

