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
document.querySelectorAll('.itens li a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const categoria = this.textContent; // Pega o nome da categoria no link
        carregarMoveis(categoria);
    });
});

function carregarMoveis(categoria) {
    fetch(`/moveis/${categoria}`)
        .then(response => response.json())
        .then(moveis => {
            exibirMoveis(moveis, categoria);
        })
        .catch(error => {
            console.error('Erro ao carregar móveis:', error);
        });
}

function exibirMoveis(moveis, categoria) {
    const container = document.getElementById('moveisContainer');
    container.innerHTML = ''; // Limpa o conteúdo anterior

    moveis.forEach(movel => {
        const movelDiv = document.createElement('div');
        movelDiv.classList.add('movel');

        // Renderiza o conteúdo de cada móvel
        movelDiv.innerHTML = `
        <img src="uploads/${movel.imagem}.jpg" alt="${movel.nome}">
        <div class="info-produto">
            <h3>${movel.nome}</h3>
            <p><strong>Características:</strong> ${movel.descricao}</p>
            <p><strong>Preço:</strong> R$${movel.preco.toFixed(2)}</p>
            <p><strong>Estoque:</strong> ${movel.estoque}</p>
            <a href="https://wa.me/5517991417318?text=${encodeURIComponent('Olá, tenho interesse em negociar o móvel ' + movel.nome)}" target="_blank" class="btn-negociar">Negociar</a>
        </div>
        `;
        container.appendChild(movelDiv);

    });
}


