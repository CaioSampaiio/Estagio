// Redirecionamento dos botões para suas respectivas páginas
document.getElementById('loginBtn').addEventListener('click', function() {
    window.location.href = "pgLogin.html";
});

document.getElementById('cadastroBtn').addEventListener('click', function() {
    window.location.href = "pgCadastro.html";
});

document.getElementById('userBtn').addEventListener('click', function() {
    window.location.href = "pgUsuario.html";
});

// Função de login
function Login() {
    const loginBtn = document.getElementById("loginBtn");
    const cadastroBtn = document.getElementById("cadastroBtn");
    const userBtn = document.getElementById("userBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (loginBtn && cadastroBtn && userBtn && logoutBtn) {
        // Esconde os botões de login e cadastro
        loginBtn.style.display = "none";
        cadastroBtn.style.display = "none";

        // Mostra os botões de usuário e logout
        userBtn.style.display = "block";
        logoutBtn.style.display = "block";

        // Salva o estado de login no localStorage
        localStorage.setItem('isLoggedIn', 'true');
    } else {
        console.error("Não foi possível encontrar um ou mais botões no DOM.");
    }
}

// Função de logout
function logout() {
    // Remove o estado de login do localStorage
    localStorage.removeItem('isLoggedIn');

    // Recarrega a página para atualizar os botões
    window.location.reload();
}

// Adiciona evento ao botão de logout
document.getElementById('logoutBtn').addEventListener('click', logout);

// Verifica o estado de login ao carregar a página
window.addEventListener('load', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        Login(); // Chama a função Login para exibir o botão "Usuário" e o botão "Logout"
    } else {
        // Esconde o botão "Usuário" e "Logout" se não estiver logado
        document.getElementById("userBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "none";
    }
});
