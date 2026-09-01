# LogiTech Express

API REST acadêmica para gerenciamento de **motoristas, veículos e entregas**, construída com Node.js, Express.js e MySQL.

## Tecnologias

- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- cors

Não são utilizados frameworks adicionais.

## Estrutura

```text
logitech-express/
├── controllers/              # Recebem as requisições e formatam as respostas
├── routes/                   # Define URLs e métodos HTTP
├── services/                 # Regras de negócio e validações
├── repositories/             # Acesso ao MySQL e SQL parametrizado
├── database/
│   ├── database.sql          # Criação do banco e tabelas
│   └── connection.js         # Pool de conexões MySQL
├── .env                      # Configuração local, não versionada
├── .env.example              # Modelo da configuração
├── .gitignore
├── package.json
├── server.js
└── README.md
```

### Responsabilidade das camadas

- **Routes:** encaminham cada endpoint para o controller correto.
- **Controllers:** recebem `req`, chamam o service e retornam JSON com o status HTTP adequado.
- **Services:** concentram validações e regras de negócio.
- **Repositories:** executam os comandos SQL e isolam o acesso ao banco.
- **Database:** contém o script de criação e a conexão com o MySQL.

## Pré-requisitos

1. Node.js instalado.
2. MySQL Server instalado e em execução.
3. VS Code ou outro editor.
4. Postman para os testes manuais.

## Instalação

Na pasta do projeto:

```bash
npm install
```

## Configuração do `.env`

Crie um arquivo `.env` na raiz, usando `.env.example` como referência:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=logitech_express
DB_PORT=3306
```

A senha do MySQL deve ser colocada somente no `.env` local.

## Banco de dados

Abra o MySQL Workbench, phpMyAdmin ou o terminal do MySQL e execute o conteúdo de `database/database.sql`.

O script cria automaticamente o banco `logitech_express` e as tabelas `motoristas`, `veiculos` e `entregas`.

## Executar a API

```bash
npm start
```

Para desenvolvimento:

```bash
npm run dev
```

URL base: `http://localhost:3000`

Teste inicial:

```http
GET http://localhost:3000/
```

Resposta:

```json
{
  "message": "API LogiTech Express funcionando"
}
```

## Endpoints

### Motoristas

| Método | Endpoint | Sucesso | Finalidade |
|---|---|---:|---|
| POST | `/motoristas` | 201 | Cadastrar motorista |
| GET | `/motoristas` | 200 | Listar motoristas |
| GET | `/motoristas/:id` | 200 | Buscar motorista |
| PUT | `/motoristas/:id` | 200 | Atualizar motorista |
| DELETE | `/motoristas/:id` | 200 | Excluir motorista |

### Veículos

| Método | Endpoint | Sucesso | Finalidade |
|---|---|---:|---|
| POST | `/veiculos` | 201 | Cadastrar veículo |
| GET | `/veiculos` | 200 | Listar veículos |
| GET | `/veiculos/:id` | 200 | Buscar veículo |
| PUT | `/veiculos/:id` | 200 | Atualizar veículo |
| DELETE | `/veiculos/:id` | 200 | Excluir veículo |

### Entregas

| Método | Endpoint | Sucesso | Finalidade |
|---|---|---:|---|
| POST | `/entregas` | 201 | Cadastrar entrega |
| GET | `/entregas` | 200 | Listar entregas |
| GET | `/entregas/:id` | 200 | Buscar entrega |
| PUT | `/entregas/:id` | 200 | Atualizar entrega/status |
| DELETE | `/entregas/:id` | 200 | Excluir entrega |

## Exemplos para o Postman

### Motorista — POST

`POST http://localhost:3000/motoristas`

```json
{
  "nome": "Carlos Silva",
  "cpf": "12345678900",
  "telefone": "49999999999"
}
```

Esperado: **201 Created**.

### Motorista — PUT

`PUT http://localhost:3000/motoristas/1`

```json
{
  "nome": "Carlos Oliveira",
  "cpf": "12345678900",
  "telefone": "49988887777"
}
```

### Veículo — POST

`POST http://localhost:3000/veiculos`

```json
{
  "placa": "ABC1D23",
  "modelo": "Volvo FH",
  "capacidadeCarga": 25000
}
```

Esperado: **201 Created**.

### Veículo — PUT

`PUT http://localhost:3000/veiculos/1`

```json
{
  "placa": "XYZ9A99",
  "modelo": "Scania R450",
  "capacidadeCarga": 30000
}
```

### Entrega — POST

Cadastre primeiro um motorista e um veículo.

`POST http://localhost:3000/entregas`

```json
{
  "descricao": "Carga Eletrônicos",
  "origem": "Joinville",
  "destino": "Curitiba",
  "motoristaId": 1,
  "veiculoId": 1
}
```

Esperado: **201 Created**, com status inicial `Pendente`.

### Entrega — PUT/status

`PUT http://localhost:3000/entregas/1`

```json
{
  "status": "Em Transporte"
}
```

Status permitidos: `Pendente`, `Em Transporte`, `Entregue`, `Cancelada`.

Os demais endpoints seguem a tabela acima. Para GET por ID, ID inexistente retorna **404**. DELETE retorna **200** quando o registro existe.

## Validações

- Motorista exige nome, CPF e telefone.
- CPF de motorista é único.
- Veículo exige placa, modelo e capacidade de carga maior que zero.
- Entrega exige origem, destino, motorista existente e veículo existente.
- Entrega inicia com `Pendente`.
- Status de entrega deve ser um dos quatro valores permitidos.
- IDs inválidos retornam **400**.
- Recursos inexistentes retornam **404**.
- CPF duplicado retorna **409**.
- Motorista/veículo com entregas vinculadas não são excluídos e retornam **409**, preservando a integridade referencial.
- Todas as respostas são JSON, inclusive erros.

## Códigos HTTP

- **200 OK:** consulta, atualização ou exclusão realizada.
- **201 Created:** cadastro realizado.
- **400 Bad Request:** dados obrigatórios ausentes, ID inválido, capacidade inválida, JSON inválido ou status inválido.
- **404 Not Found:** recurso, motorista ou veículo não encontrado.
- **409 Conflict:** CPF duplicado ou conflito com entregas vinculadas.
- **500 Internal Server Error:** erro inesperado no servidor/banco.

## Checklist de teste manual

1. `GET /` responde 200.
2. Cadastrar motorista responde 201.
3. CPF duplicado responde 409.
4. Campos obrigatórios de motorista respondem 400.
5. Listar e buscar motoristas funcionam.
6. ID inexistente responde 404.
7. Atualizar e excluir motorista funcionam.
8. Cadastrar veículo responde 201.
9. Campos obrigatórios de veículo respondem 400.
10. Listar, buscar, atualizar e excluir veículo funcionam.
11. Cadastrar entrega com IDs válidos responde 201.
12. Entrega começa com `Pendente`.
13. Motorista inexistente responde 404.
14. Veículo inexistente responde 404.
15. Origem/destino ausentes respondem 400.
16. Status inválido responde 400.
17. Status pode ser alterado para `Em Transporte`.
18. Buscar e excluir entrega funcionam.
19. O console não apresenta stack trace durante operações normais.
