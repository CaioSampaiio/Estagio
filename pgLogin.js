document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Impede o envio tradicional do formulário

    const email = document.getElementById('emailid').value;
    const senha = document.getElementById('senhaid').value;

    try {
        // Faz a requisição de login
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();
        console.log(data)

        if (response.ok && data.token) {
            // Armazena o token no localStorage
            localStorage.setItem('token', data.token);
        
            // Redireciona para a página de admin
            window.location.href = '/admin';
        } else {
            alert(data.error || 'Erro no login');
        }
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro no servidor');
    }
});

// Ao tentar acessar a rota /admin
async function verificarAcessoAdmin() {
    // Verifica se o token está no localStorage
    const token = localStorage.getItem('token');

    if (token) {
        // Faz a requisição para a rota /admin com o token no cabeçalho
        fetch('/admin', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
            }
        })
        .then(response => {
            if (response.ok) {
                return response.text(); // Se a resposta estiver OK, exibe a resposta
            } else if (response.status === 403) {
                alert('Acesso negado. Token não reconhecido ou inválido.');
            }
        })
        .then(data => console.log(data))
        .catch(error => console.error('Erro:', error));
    } else {
        alert('Token não encontrado. Faça login novamente.');
        
    }
}

// Chame esta função para verificar o acesso ao /admin
verificarAcessoAdmin();
