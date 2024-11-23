document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('emailid').value.trim();
    const senha = document.getElementById('senhaid').value.trim();

    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data.user));
            const redirectPage = data.user.permissao === 1 ? 'pgAdmin.html' : 'pgPrincipal.html';
            window.location.href = redirectPage;
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao se conectar ao servidor.');
    }
});
