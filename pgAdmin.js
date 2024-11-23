// Baixar Relatório de Usuários (PDF)
document.getElementById('downloadUsuariosPdf').addEventListener('click', () => {
    window.open('/download-relatorio-usuarios', '_blank');
});

// Baixar Relatório de Produtos por Categoria (PDF)
document.getElementById('downloadProdutosCategoriaPdf').addEventListener('click', () => {
    window.open('/download-relatorio-produtos-categoria', '_blank');
});

// Baixar Relatório de Estoque (PDF)
document.getElementById('downloadEstoquePdf').addEventListener('click', () => {
    window.open('/download-relatorio-estoque', '_blank');
});


// Mostrar o modal de cadastro
function showAdicionarModal() {
    document.getElementById("cadModal").style.display = "block";
}

// Fechar o modal de cadastro
function closePhotoModal() {
    document.getElementById("cadModal").style.display = "none";
}

// Manipular o envio do formulário de cadastro
document.getElementById("cadMoveis").addEventListener("submit", async function(event) {
    event.preventDefault(); // Impede o comportamento padrão de recarregar a página

    // Captura os elementos do formulário
    const fileInput = document.getElementById("photoInput");
    const nome = document.getElementById("nomeCad").value;
    const informacao = document.getElementById("infoCad").value;
    const promocao = document.getElementById("promoCad").value;
    const preco = document.getElementById("preçoCad").value;
    const estoque = document.getElementById("QuatidadeCad").value;
    const categoria = document.getElementById("categoriaCad").value;

    // Verifica se o arquivo de imagem foi selecionado
    if (fileInput.files.length === 0) {
        alert("Por favor, selecione uma imagem.");
        return;
    }

    // Cria um objeto FormData e adiciona os campos do formulário
    const formData = new FormData();
    formData.append('imagem', fileInput.files[0]); // Adiciona o arquivo de imagem
    formData.append('nome', nome);
    formData.append('informacao', informacao);
    formData.append('promocao', promocao);
    formData.append('preco', preco);
    formData.append('estoque', estoque);
    formData.append('categoria', categoria);

    try {
        // Envia os dados para o backend usando fetch
        const response = await fetch('/cadastrar-movel', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert("Móvel cadastrado com sucesso!");
            document.getElementById('cadMoveis').reset(); // Limpa o formulário
            closePhotoModal(); // Fecha o modal
        } else {
            alert("Erro ao cadastrar o móvel.");
        }
    } catch (error) {
        console.error("Erro ao cadastrar o móvel:", error);
        alert("Erro ao cadastrar o móvel.");
    }
});




// Verificar status de login
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

    document.addEventListener('DOMContentLoaded', () => {
        const user = JSON.parse(localStorage.getItem('user'));
    
        if (!user || user.permissao !== 1) {
            alert('Acesso negado! Você será redirecionado.');
            window.location.href = 'login.html';
        }
    
    });
    

    
    
    
    