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

            // Ao tentar acessar a rota /admin
    async function verificarAcessoAdmin() {
    const token = localStorage.getItem('token');

    if (token) {
        const response = await fetch('/admin', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 403) {
            alert('Acesso negado. Você não tem permissão para acessar essa página.');
        } else {
            const data = await response.text();
            console.log(data);
        }
    } else {
        alert('Token não encontrado. Faça login novamente.');
    }
    }


    // Chame esta função para verificar o acesso ao /admin
    verificarAcessoAdmin();