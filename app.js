const express = require('express');
const mysql = require('mysql');
const app = express();

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost', // ou o endereço do seu servidor MySQL
  user: 'root',
  password: '',
  database: 'popularmoveis'
});

// Conectar ao banco de dados
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
});

// Rota simples para testar a conexão
app.get('/dados', (req, res) => {
  const sql = 'SELECT * FROM usuario';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});