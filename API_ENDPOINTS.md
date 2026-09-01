# LogiTech Express — Endpoints e Como Executar

Documentação rápida da API para uso acadêmico e testes no Postman.

## 1. Tecnologias

- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- cors

## 2. Pré-requisitos

Antes de iniciar, tenha instalado:

- Node.js
- MySQL Server
- VS Code ou outro editor
- Postman

O MySQL precisa estar ligado antes de iniciar a API.

## 3. Instalar o projeto

Abra o terminal na pasta do projeto:

```bash
npm install
```

Esse comando instala as dependências presentes no `package.json`.

## 4. Configurar o banco de dados

O projeto possui o arquivo:

```text
database/database.sql
```

Ele cria automaticamente o banco `logitech_express` e as tabelas `motoristas`, `veiculos` e `entregas`.

Você pode abrir esse arquivo no MySQL Workbench e executar o SQL.

Depois confira se o banco foi criado:

```sql
SHOW DATABASES;
```

E:

```sql
USE logitech_express;
SHOW TABLES;
```

As tabelas esperadas são:

```text
entregas
motoristas
veiculos
```

## 5. Configurar o `.env`

Crie um arquivo `.env` na raiz do projeto.

Use o `.env.example` como modelo:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=logitech_express
DB_PORT=3306
```

Coloque em `DB_PASSWORD` a senha do seu MySQL, caso exista.

Não coloque senha real no GitHub.

## 6. Iniciar a API

Na pasta do projeto:

```bash
npm start
```

Para desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3000
```

Teste no navegador ou no Postman:

```text
GET http://localhost:3000/
```

Resposta esperada:

```json
{
  "message": "API LogiTech Express funcionando"
}
```

## 7. Como adicionar novas rotas

A API utiliza a estrutura:

```text
routes → controllers → services → repositories
```

Cada camada tem uma responsabilidade:

- **routes:** define método HTTP e URL.
- **controllers:** recebe a requisição e devolve a resposta.
- **services:** aplica validações e regras de negócio.
- **repositories:** executa SQL no MySQL.

### Exemplo: adicionando uma nova rota

Suponha que você queira criar `/clientes`.

### Passo 1 — Criar o repository

Crie:

```text
repositories/clienteRepository.js
```

Nesse arquivo ficam os comandos SQL.

### Passo 2 — Criar o service

Crie:

```text
services/clienteService.js
```

Nesse arquivo ficam as validações e regras de negócio.

### Passo 3 — Criar o controller

Crie:

```text
controllers/clienteController.js
```

O controller chama o service e retorna JSON.

### Passo 4 — Criar as rotas

Crie:

```text
routes/clienteRoutes.js
```

Exemplo:

```js
const express = require('express');
const controller = require('../controllers/clienteController');

const router = express.Router();

router.post('/', controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
```

### Passo 5 — Adicionar a rota no `server.js`

No começo do `server.js`, importe o arquivo:

```js
const clienteRoutes = require('./routes/clienteRoutes');
```

Depois registre a rota:

```js
app.use('/clientes', clienteRoutes);
```

A partir disso, a API terá:

```text
POST   /clientes
GET    /clientes
GET    /clientes/:id
PUT    /clientes/:id
DELETE /clientes/:id
```

### Como funciona no projeto atual

O `server.js` registra as três rotas principais assim:

```js
app.use('/motoristas', motoristaRoutes);
app.use('/veiculos', veiculoRoutes);
app.use('/entregas', entregaRoutes);
```

Por isso, as rotas definidas dentro de `motoristaRoutes.js`, `veiculoRoutes.js` e `entregaRoutes.js` recebem automaticamente os prefixos `/motoristas`, `/veiculos` e `/entregas`.

---

# 8. Rotas da API

## Rota principal

### GET `/`

Verifica se a API está funcionando.

**Resposta:** `200 OK`

```json
{
  "message": "API LogiTech Express funcionando"
}
```

---

# Motoristas

## POST `/motoristas`

Cadastra um motorista.

**Resposta:** `201 Created`

```json
{
  "nome": "Carlos Silva",
  "cpf": "12345678900",
  "telefone": "49999999999"
}
```

## GET `/motoristas`

Lista todos os motoristas.

**Resposta:** `200 OK`

## GET `/motoristas/:id`

Busca um motorista pelo ID.

Exemplo:

```text
GET http://localhost:3000/motoristas/1
```

**Sucesso:** `200 OK`

**ID inexistente:** `404 Not Found`

**ID inválido:** `400 Bad Request`

## PUT `/motoristas/:id`

Atualiza um motorista.

```text
PUT http://localhost:3000/motoristas/1
```

```json
{
  "nome": "Carlos Oliveira",
  "cpf": "12345678900",
  "telefone": "49988887777"
}
```

**Sucesso:** `200 OK`

## DELETE `/motoristas/:id`

Exclui um motorista.

**Sucesso:** `200 OK`

**ID inexistente:** `404 Not Found`

**Com entregas vinculadas:** `409 Conflict`

### Regras

- Nome é obrigatório.
- CPF é obrigatório.
- Telefone é obrigatório.
- CPF deve ser único.

---

# Veículos

## POST `/veiculos`

Cadastra um veículo.

**Resposta:** `201 Created`

```json
{
  "placa": "ABC1D23",
  "modelo": "Volvo FH",
  "capacidadeCarga": 25000
}
```

## GET `/veiculos`

Lista todos os veículos.

**Resposta:** `200 OK`

## GET `/veiculos/:id`

Busca um veículo pelo ID.

Exemplo:

```text
GET http://localhost:3000/veiculos/1
```

**Sucesso:** `200 OK`

**ID inexistente:** `404 Not Found`

**ID inválido:** `400 Bad Request`

## PUT `/veiculos/:id`

Atualiza um veículo.

```text
PUT http://localhost:3000/veiculos/1
```

```json
{
  "placa": "XYZ9A99",
  "modelo": "Scania R450",
  "capacidadeCarga": 30000
}
```

**Sucesso:** `200 OK`

## DELETE `/veiculos/:id`

Exclui um veículo.

**Sucesso:** `200 OK`

**ID inexistente:** `404 Not Found`

**Com entregas vinculadas:** `409 Conflict`

### Regras

- Placa é obrigatória.
- Modelo é obrigatório.
- Capacidade de carga é obrigatória.
- Capacidade de carga deve ser maior que zero.

---

# Entregas

## POST `/entregas`

Cadastra uma entrega.

O motorista e o veículo precisam existir antes do cadastro.

**Resposta:** `201 Created`

```json
{
  "descricao": "Carga Eletrônicos",
  "origem": "Joinville",
  "destino": "Curitiba",
  "motoristaId": 1,
  "veiculoId": 1
}
```

O status inicial será:

```text
Pendente
```

## GET `/entregas`

Lista todas as entregas.

**Resposta:** `200 OK`

## GET `/entregas/:id`

Busca uma entrega pelo ID.

Exemplo:

```text
GET http://localhost:3000/entregas/1
```

**Sucesso:** `200 OK`

**ID inexistente:** `404 Not Found`

**ID inválido:** `400 Bad Request`

## PUT `/entregas/:id`

Atualiza uma entrega.

Para alterar somente o status:

```text
PUT http://localhost:3000/entregas/1
```

```json
{
  "status": "Em Transporte"
}
```

Status permitidos:

```text
Pendente
Em Transporte
Entregue
Cancelada
```

**Status inválido:** `400 Bad Request`

## DELETE `/entregas/:id`

Exclui uma entrega.

**Sucesso:** `200 OK`

**ID inexistente:** `404 Not Found`

### Regras

- Origem é obrigatória.
- Destino é obrigatório.
- Motorista deve existir.
- Veículo deve existir.
- Status inicial é `Pendente`.
- Status deve ser um dos quatro valores permitidos.

---

# 9. Testando no Postman

## Passo 1

Inicie a API:

```bash
npm start
```

## Passo 2

No Postman, use:

```text
http://localhost:3000
```

## Passo 3

Teste nesta ordem para facilitar:

1. `POST /motoristas`
2. `POST /veiculos`
3. `POST /entregas`
4. `GET /motoristas`
5. `GET /veiculos`
6. `GET /entregas`
7. `PUT /entregas/1` alterando o status
8. `DELETE` quando necessário

## Corpo das requisições POST e PUT

No Postman:

```text
Body → raw → JSON
```

Exemplo de motorista:

```json
{
  "nome": "Carlos Silva",
  "cpf": "12345678900",
  "telefone": "49999999999"
}
```

Exemplo de veículo:

```json
{
  "placa": "ABC1D23",
  "modelo": "Volvo FH",
  "capacidadeCarga": 25000
}
```

Exemplo de entrega:

```json
{
  "descricao": "Carga Eletrônicos",
  "origem": "Joinville",
  "destino": "Curitiba",
  "motoristaId": 1,
  "veiculoId": 1
}
```

---

# 10. Códigos HTTP

| Código | Significado |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Cadastro realizado |
| 400 | Dados inválidos ou obrigatórios ausentes |
| 404 | Recurso não encontrado |
| 409 | Conflito, como CPF duplicado ou registro vinculado |
| 500 | Erro interno do servidor |

## Formato de sucesso

```json
{
  "message": "Operação realizada com sucesso",
  "data": {}
}
```

## Formato de erro

```json
{
  "message": "Descrição do erro"
}
```

---

# 11. Estrutura das pastas

```text
API-Generica/
├── controllers/
├── routes/
├── services/
├── repositories/
├── database/
│   ├── database.sql
│   └── connection.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── server.js
├── README.md
└── API_ENDPOINTS.md
```

## Resumo do fluxo

```text
Postman
   ↓
routes
   ↓
controllers
   ↓
services
   ↓
repositories
   ↓
MySQL
```

Esse é o fluxo usado para adicionar novas funcionalidades e novas rotas à API.
