document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('emailid').value;
    const senha = document.getElementById('senhaid').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error('Erro ao processar JSON:', jsonError);
            alert('Erro no formato da resposta do servidor.');
            return;
        }

        if (response.ok && data.success) {
            // Redireciona para a página principal ao confirmar sucesso
            window.location.href = 'pgPrincipal.html';
        } else {
            alert(data.error || 'Erro no login');
        }
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro no servidor');
    }
});

