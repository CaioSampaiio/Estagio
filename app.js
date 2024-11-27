const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const { engine } = require('express-handlebars');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const { verificarAutenticacao, verificarAdmin } = require('./middlewares');
const PDFDocument = require('pdfkit');



app.use(session({
  secret: 'caio',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Caso eu use HTTPS, usar true  
}));
// Body-parser integrado no express para interpretar JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '/')));
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'pgLogin.html')); 
});

app.get('/usuario', verificarAutenticacao, (req, res) => {
  res.sendFile(path.join(__dirname, 'pgUsuario.html'));
});


app.get('/admin', verificarAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'pgAdmin.html'));
});



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
    res.sendFile(path.join(__dirname, 'pgPrincipal.html'));
  } else {
    // Caso contrário, mostre a página com as opções de login e cadastro
    res.sendFile(path.join(__dirname, 'pgPrincipal.html'));
  }
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


app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
      return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  const sql = 'SELECT idUsuario, nome, permissao FROM usuario WHERE email = ? AND senha = ?';

  conexão.query(sql, [email, senha], (err, rows) => {
      if (err) {
          console.error('Erro no servidor:', err);
          return res.status(500).json({ message: "Erro no servidor." });
      }

      if (rows.length > 0) {
          const user = rows[0];
          req.session.usuario = user; // Salva na sessão
          res.status(200).json({
              message: "Login bem-sucedido",
              user: { id: user.id, nome: user.nome, permissao: user.permissao },
          });
      } else {
          res.status(401).json({ message: "Credenciais inválidas." });
      }
  });
});


// Configuração do multer para salvar a imagem
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "uploads/"); // Pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


/// Endpoint para cadastrar móveis
app.post("/cadastrar-movel", upload.single("imagem"), (req, res) => {
  const { nome, informacao, promocao, preco, estoque, categoria } = req.body;
  const imagem = req.file.filename; // Lê o conteúdo da imagem como binário


  const sql = "INSERT INTO produto (nome, descricao, promocao, preco, estoque, categoria, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [nome, informacao, promocao, preco, estoque, categoria, imagem];

  conexão.query(sql, values, (err, result) => {
      if (err) {
          console.error("Erro ao inserir no banco de dados:", err);
          res.status(500).json({ error: "Erro ao cadastrar o móvel." });
      } else {
          res.status(200).json({ message: "Móvel cadastrado com sucesso!" });
          registrarLog('produto', req.session.usuario.nome, 'INSERT');
      }
  });
});

app.get('/moveis/:categoria', (req, res) => {
  const categoria = req.params.categoria;

  const sql = 'SELECT * FROM produto WHERE categoria = ?';
  conexão.query(sql, [categoria], (error, results) => {
    if (error) {
      console.error('Erro ao buscar móveis:', error);
      res.status(500).json({ error: 'Erro ao buscar móveis.' });
    } else {
      
      res.json(results);
    }
  });
});

// Rota para adicionar imagem e feedback
app.post('/feedback', (req, res) => {
  const { feedback } = req.body;

  if (!feedback) {
    return res.status(400).json({ error: 'Feedback é obrigatório.' });
  }

  const sql = `INSERT INTO feedback (feedback) VALUES (?)`;

  conexão.query(sql, [feedback], (error, results) => {
    if (error) {
      console.error('Erro ao inserir no banco de dados:', error);
      return res.status(500).json({ error: 'Erro ao salvar o feedback.' });
    } else {
      res.json({ success: true, message: 'Feedback salvo com sucesso!' });
    }
  });
});

// Rota para upload e salvamento da imagem de perfil
// Rota para upload e salvamento da imagem de perfil
app.post('/upload-perfil', upload.single('imagem'), (req, res) => {
  if (!req.file) {
      console.error('Nenhuma imagem foi enviada.');
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
  }

  const userId = req.session.usuario?.idUsuario; // Obtém o ID do usuário da sessão

  if (!userId) {
      console.error('ID do usuário não encontrado na sessão.');
      return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  const imagem = fs.readFileSync(req.file.path);

  const sql = 'INSERT INTO userimg (imagemperfil, idUsuario) VALUES (?, ?)';
  conexão.query(sql, [imagem, userId], (error, results) => {
      // Remove o arquivo temporário após salvar no banco
      fs.unlinkSync(req.file.path);

      if (error) {
          console.error('Erro ao salvar a imagem de perfil no banco:', error);
          return res.status(500).json({ error: 'Erro ao salvar a imagem no banco.' });
      }

      res.json({ success: true, message: 'Imagem salva com sucesso!' });
  });
});





// Rota para obter a imagem de perfil
// Rota para obter a imagem de perfil
app.get('/imagem-perfil', (req, res) => {
  const userId = req.session.usuario?.idUsuario;

  if (!userId) {
      console.error('ID do usuário não encontrado na sessão.');
      return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  const sql = 'SELECT imagemperfil FROM userimg WHERE idUsuario = ? ORDER BY id DESC LIMIT 1';

  conexão.query(sql, [userId], (error, results) => {
      if (error) {
          console.error('Erro ao buscar a imagem de perfil:', error);
          return res.status(500).json({ error: 'Erro no servidor.' });
      }

      if (results.length > 0 && results[0].imagemperfil) {
          res.setHeader('Content-Type', 'image/jpeg');
          res.send(results[0].imagemperfil); // Envia a imagem ao cliente
      } else {
          console.warn('Nenhuma imagem encontrada para o usuário:', userId);
          res.status(404).json({ error: 'Imagem não encontrada.' });
      }
  });
});





app.get('/download-relatorio-usuarios', (req, res) => {
  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio-usuarios.pdf');

  const sql = 'SELECT idUsuario, nome, email, permissao FROM usuario';

  conexão.query(sql, (err, results) => {
      if (err) {
          console.error('Erro ao gerar relatório de usuários:', err);
          return res.status(500).send('Erro ao gerar relatório.');
      }

      doc.text('Relatório de Usuários', { align: 'center' });
      doc.moveDown();

      results.forEach(user => {
          doc.text(`ID: ${user.idUsuario}`);
          doc.text(`Nome: ${user.nome}`);
          doc.text(`Email: ${user.email}`);
          doc.text(`Permissão: ${user.permissao}`);
          doc.moveDown();
      });

      doc.pipe(res);
      doc.end();
  });
});

app.get('/download-relatorio-produtos-categoria', (req, res) => {
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio-produtos-categoria.pdf');

  const sql = `
      SELECT p.nome AS produto, c.nome AS categoria, p.preco
      FROM produto p
      JOIN categoria c ON p.categoria = c.nome;
  `;

  conexão.query(sql, (err, results) => {
      if (err) {
          console.error('Erro ao gerar relatório de produtos por categoria:', err);
          return res.status(500).send('Erro ao gerar relatório.');
      }

      doc.text('Relatório de Produtos por Categoria', { align: 'center' });
      doc.moveDown();

      if (results.length === 0) {
          doc.text('Nenhum dado encontrado.');
      } else {
          results.forEach(row => {
              doc.text(`Produto: ${row.produto}`);
              doc.text(`Categoria: ${row.categoria}`);
              doc.text(`Preço: R$${row.preco.toFixed(2)}`);
              doc.moveDown();
          });
      }

      doc.pipe(res);
      doc.end();
  });
});



app.get('/download-relatorio-estoque', (req, res) => {
  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio-estoque.pdf');

  const sql = `
      SELECT p.nome AS produto, e.quantidade
      FROM estoque e
      JOIN produto p ON e.produto_id = p.id;
  `;

  conexão.query(sql, (err, results) => {
      if (err) {
          console.error('Erro ao gerar relatório de estoque:', err);
          return res.status(500).send('Erro ao gerar relatório.');
      }

      doc.text('Relatório de Estoque', { align: 'center' });
      doc.moveDown();

      results.forEach(row => {
          doc.text(`Produto: ${row.produto}`);
          doc.text(`Quantidade: ${row.quantidade}`);
          doc.moveDown();
      });

      doc.pipe(res);
      doc.end();
  });
});

const registrarLog = (entidade, user, operacao) => {
  const sql = "INSERT INTO Logs (entidade, user, operacao) VALUES (?, ?, ?)";
  conexão.query(sql, [entidade, user, operacao], (err) => {
      if (err) {
          console.error("Erro ao registrar log:", err);
      } else {
          console.log("Log registrado com sucesso.");
      }
  });
};


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