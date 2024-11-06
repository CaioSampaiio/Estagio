const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const multer = require('multer');
const session = require('express-session');

const app = express();
const { engine } = require('express-handlebars');

// Configuração do multer para armazenamento temporário de arquivos
const upload = multer({ dest: 'uploads/' });

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

// Rota para cadastro de móveis
app.post('/cadastrar-movel', upload.single('imagem'), (req, res) => {
  const { nome, informacao, preco, promocao, estoque, categoria } = req.body;
  const promocaoBool = promocao === 'true' ? 1 : 0;

  // Lê a imagem carregada e converte para binário
  const imagem = fs.readFileSync(req.file.path);

  // Query de inserção no banco de dados
  const sql = `INSERT INTO produtos (nome, imagem, informacao, preco, promocao, estoque, categoria) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

  conexão.query(
    sql,
    [nome, imagem, informacao, parseFloat(preco), promocaoBool, parseInt(estoque), categoria],
    (error, results) => {
      // Remove o arquivo de imagem temporário
      fs.unlinkSync(req.file.path);

      if (error) {
        console.error('Erro ao inserir no banco de dados:', error);
        res.status(500).json({ error: 'Erro ao cadastrar o produto.' });
      } else {
        res.json({ success: true, message: 'Produto cadastrado com sucesso!' });
      }
    }
  );
});

// Outras rotas e configurações...
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
      
      req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role };
      
      if (usuario.role === 'admin') {
        res.json({ success: true, redirect: '/pgAdmin.html' });
      } else if (usuario.role === 'user') {
        res.json({ success: true, redirect: '/pgUsuario.html' });
      } else {
        res.status(403).json({ error: 'Acesso negado.' });
      }
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
