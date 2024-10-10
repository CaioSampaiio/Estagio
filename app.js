const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const { engine } = require('express-handlebars');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const segredoJWT = 'seuSegredoJWT'; // Deve ser uma string secreta segura


// Body-parser integrado no express para interpretar JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '/')));
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'pgLogin.html')); 
});

app.get('/usuario', (req, res) => {
  res.sendFile(path.join(__dirname, 'pgUsuario.html')); 
});

app.use(session({
  secret: 'caio',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Caso eu use HTTPS, usar true  
}));

// Configuração do banco de dados
const conexão = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'popularmoveis'
});


// Conectar ao banco de dados
conexão.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
});

// Servir o arquivo HTML quando o usuário acessar a página inicial
app.get('/', (req, res) => {
  if (req.session && req.session.usuario) {
    // Se o usuário estiver logado, renderize a página com o nome do usuário
    res.sendFile(path.join(__dirname, 'pgPrincipalLogado.html'));
  } else {
    // Caso contrário, mostre a página com as opções de login e cadastro
    res.sendFile(path.join(__dirname, 'pgPrincipal.html'));
  }
});
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do cabeçalho

  if (!token) {
      return res.status(403).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  jwt.verify(token, segredoJWT, (err, usuario) => {
      if (err) {
          return res.status(403).json({ error: 'Token inválido ou expirado.' });
      }

      req.usuario = usuario; // Armazena as informações do usuário no req para usar nas rotas
      next(); // Continua para a próxima rota
  });
}

const isAdmin = (req, res, next) => {
  if (req.usuario.role !== 'admin') { // Verifica se o usuário é admin
    return res.status(403).send('Acesso negado. Somente administradores.');
  }
  next();
};

app.get('/admin', verificarToken, (req, res) => {
  res.send('Bem-vindo à área de administrador');
});


// Rota para verificar se o usuário está logado
app.get('/status', (req, res) => {
  if (req.session.usuario) {
    res.json({ loggedIn: true, nome: req.session.usuario.nome });
  } else {
    res.json({ loggedIn: false });
  }
});

// Rota para cadastrar usuário
app.post('/cadastrar', function(req, res) {
  const { nome, email, celular, senha } = req.body;

  if (!nome || !email || !celular || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  const sql = 'INSERT INTO usuario (nome, email, celular, senha) VALUES (?, ?, ?, ?)';
  
  conexão.query(sql, [nome, email, celular, senha], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao inserir dados:', erro);
      return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
    console.log('Usuário cadastrado com sucesso:', resultado);
    res.redirect('/login');
  });
});

// Rota de login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const sql = 'SELECT * FROM usuario WHERE email = ? AND senha = ?';
  conexão.query(sql, [email, senha], (erro, resultados) => {
    if (erro) {
      console.error('Erro ao fazer login:', erro);
      return res.status(500).json({ error: 'Erro ao fazer login.' });
    }
    if (resultados.length > 0) {
      const usuario = resultados[0];

      // Gera um token JWT com os dados do usuário
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, role: usuario.role }, // role seria a coluna que indica o tipo de usuário
        'segredoJWT',
        { expiresIn: '1h' } // O token expira em 1 hora
      );

      res.json({ token }); // Retorna o token ao frontend
    } else {
      res.status(401).json({ error: 'Email ou senha incorretos.' });
    }
  });
});

// Rota de logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});


// Inicializa o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

