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