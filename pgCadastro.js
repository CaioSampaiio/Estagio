document.getElementById('camposCadastro').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Pegando os valores dos campos
    const nome = document.getElementById('nomeid').value;
    const email = document.getElementById('emailid').value;
    const senha = document.getElementById('senhaid').value;
    const celular = document.getElementById('telid').value;

   {/*
    // Validação básica
    if (nome === "caio" || email === "caio@gmail.com" || senha === "1234" || celular === "17992331036") {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    */}
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    // Validação de celular (deve ter 11 dígitos)
    const celularRegex = /^\d{11}$/;
    if (!celularRegex.test(celular)) {
        alert('Por favor, insira um número de celular válido (somente números, ex: 11999999999).');
        return;
    }

    // Exibir mensagem de sucesso
    alert('Cadastro realizado com sucesso!');
    
    // Redirecionar para outra página (opcional)
    window.location.href = "pgLogin.html"; // Exemplo de redirecionamento
});
