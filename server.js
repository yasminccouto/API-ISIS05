require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Conexão com o banco MySQL 'logitech_express'
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'logitech_express',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10
});

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API LogiTech Express funcionando' });
});

// ==================== MOTORISTAS ====================

// GET /motoristas (Listar do Banco)
app.get('/motoristas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM motoristas');
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no banco de dados', error: error.message });
  }
});

// GET /motoristas/:id (Buscar por ID)
app.get('/motoristas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM motoristas WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Motorista não encontrado' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no banco de dados', error: error.message });
  }
});

// POST /motoristas (Cadastrar no Banco)
app.post('/motoristas', async (req, res) => {
  try {
    const { nome, cpf, cnh } = req.body;

    if (!nome || !cpf) {
      return res.status(400).json({ message: 'Nome e CPF são obrigatórios' });
    }

    const [cpfExiste] = await db.query('SELECT id FROM motoristas WHERE cpf = ?', [cpf]);
    if (cpfExiste.length > 0) {
      return res.status(409).json({ message: 'CPF já cadastrado' });
    }

    const [result] = await db.query(
      'INSERT INTO motoristas (nome, cpf, cnh) VALUES (?, ?, ?)',
      [nome, cpf, cnh]
    );

    const novoMotorista = { id: result.insertId, nome, cpf, cnh };
    return res.status(201).json(novoMotorista);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no banco de dados', error: error.message });
  }
});

// ==================== VEÍCULOS ====================

// GET /veiculos (Listar do Banco)
app.get('/veiculos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM veiculos');
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no banco de dados', error: error.message });
  }
});

// GET /veiculos/:id (Buscar Veículo por ID)
app.get('/veiculos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM veiculos WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Veículo não encontrado' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no banco de dados', error: error.message });
  }
});

// POST /veiculos (Cadastrar no Banco)
app.post('/veiculos', async (req, res) => {
  try {
    const { placa, modelo } = req.body;
    if (!placa) {
      return res.status(400).json({ message: 'Placa é obrigatória' });
    }

    const [result] = await db.query(
      'INSERT INTO veiculos (placa, modelo) VALUES (?, ?)',
      [placa, modelo]
    );

    return res.status(201).json({ id: result.insertId, placa, modelo });
  } catch (error) {
    return res.status(500).json({ message: 'Erro no banco de dados', error: error.message });
  }
});

// ==================== ENTREGAS ====================

// GET /entregas (Listar do Banco)
app.get('/entregas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM entregas');
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no banco de dados', error: error.message });
  }
});

// GET /entregas/:id (Buscar Entrega por ID)
app.get('/entregas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM entregas WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Entrega não encontrada' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no banco de dados', error: error.message });
  }
});

// POST /entregas (Cadastrar no Banco)
app.post('/entregas', async (req, res) => {
  try {
    const { cliente, motoristaId, veiculoId, pesoKg } = req.body;

    if (!cliente || !pesoKg) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
    }

    const status = 'PENDENTE';
    const [result] = await db.query(
      'INSERT INTO entregas (cliente, motoristaId, veiculoId, pesoKg, status) VALUES (?, ?, ?, ?, ?)',
      [cliente, motoristaId, veiculoId, pesoKg, status]
    );

    return res.status(201).json({
      id: result.insertId,
      cliente,
      motoristaId,
      veiculoId,
      pesoKg,
      status
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro no banco de dados', error: error.message });
  }
});

// PUT /entregas/:id (Atualizar Status da Entrega)
app.put('/entregas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status é obrigatório' });
    }

    const [result] = await db.query('UPDATE entregas SET status = ? WHERE id = ?', [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Entrega não encontrada' });
    }

    return res.status(200).json({ message: 'Status atualizado com sucesso', status });
  } catch (error) {
    return res.status(500).json({ message: 'Erro no banco de dados', error: error.message });
  }
});

// Inicialização do Servidor e Teste de Conexão
app.listen(PORT, async () => {
  try {
    await db.getConnection();
    console.log(`🚀 LogiTech Express rodando em http://localhost:${PORT}`);
    console.log('✅ Conexão com o banco MySQL (logitech_express) realizada com sucesso!');
  } catch (error) {
    console.error('❌ Falha ao conectar no MySQL:', error.message);
  }
});

module.exports = app;