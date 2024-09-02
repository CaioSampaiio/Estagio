document.getElementById('camposLogin').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Pegando os valores dos campos de nome e senha
    const nome = document.getElementById('nomeid').value;
    const senha = document.getElementById('senhaid').value;

    // Definindo as credenciais corretas (exemplo)
    const credenciaisCorretas = {
        nome: 'caio',
        senha: '1234'
    };

    // Validação das credenciais
    if (nome === credenciaisCorretas.nome && senha === credenciaisCorretas.senha) {
        // Redirecionar para outra página (opcional)
        window.location.href = "pgPrincipal.html"; // Exemplo de redirecionamento
    } else {
        alert('Nome ou senha incorretos. Tente novamente.');
    }
});
