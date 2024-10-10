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
        console.log(response)
        const data = await response.json();
        console.log(data)

        if (response.ok && data.token) {
            // Armazena o token no localStorage
            localStorage.setItem('token', data.token);
        
            // Redireciona para a página de admin
            window.location.href = 'pgPrincipalLogado.html';
        } else {
            alert(data.error || 'Erro no login');
        }
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro no servidor');
    }
});


