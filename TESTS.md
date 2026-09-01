# TESTES.md

## Plano de Testes - LogiTech Express
 
### Objetivo
Documentar os cenários de teste que serão implementados na Unidade Curricular de Testes de Back-End, garantindo a rastreabilidade entre regras de negócio, endpoints e casos de teste com base na API em execução.

### Regras de Negócio

| Código | Regra de Negócio |
| :--- | :--- |
| **RN01** | Todo motorista deve possuir nome, CPF e CNH. |
| **RN02** | O CPF do motorista deve ser único. |
| **RN03** | Todo veículo deve possuir placa e modelo. |
| **RN04** | Uma entrega somente poderá ser criada caso o motorista e o veículo existam. |
| **RN05** | Cliente e peso em quilos (`pesoKg`) são campos obrigatórios para uma entrega. |
| **RN06** | O status da entrega deve ser inicializado e atualizado corretamente (ex: `PENDENTE`). |

---

### Resumo dos Casos de Teste

| CT | Tipo | Nível | Endpoint / Regra Validada |
| :--- | :--- | :--- | :--- |
| **CT01** | Caixa Preta | Integração | `POST /motoristas` - RN01 |
| **CT02** | Caixa Preta | Integração | `POST /motoristas` - RN02 |
| **CT03** | Caixa Preta | Integração | `POST /veiculos` - RN03 |
| **CT04** | Caixa Preta | Integração | `POST /entregas` - RN04 e RN05 |
| **CT05** | Caixa Preta | Integração | `PUT /entregas/:id` - RN06 |
| **CT06** | Caixa Preta | Integração | `GET /motoristas/:id` e `GET /motoristas` |
| **CT07** | Caixa Branca | Unitário | `MotoristaService.validarCpfDuplicado()` - RN02 |
| **CT08** | Caixa Branca | Unitário | `EntregaService.validarEntrega()` - RN05 |

---

### CT01 - Cadastro de Motorista

* **1. Tipo de Teste:** Caixa Preta
* **2. Nível do Teste:** Integração
* **3. Objetivo:** Verificar se um motorista é cadastrado corretamente quando todos os dados obrigatórios (`nome`, `cpf`, `cnh`) são informados.
* **4. Rastreabilidade:** Endpoint `POST /motoristas` \| Regra de Negócio **RN01**
* **5. Pré-condição:** API em execução. Banco de dados disponível. O CPF informado não existe no banco.
* **6. Dados de Entrada:**
  ```json
  {
    "nome": "Carlos Oliveira",
    "cpf": "11122233344",
    "cnh": "1234567890"
  }

  7. Passos de Execução:

Executar a API.

Enviar uma requisição POST para /motoristas.

Informar o JSON de entrada.

Validar a resposta da API.




8. Resultado Esperado:

HTTP 201 (Created).

Motorista cadastrado com id gerado.

✅ PASSED (Passou): O registro foi persistido e retornado com sucesso.



9. Critério de Aprovação: O motorista deve ser cadastrado e persistido no banco de dados com os campos nome, cpf e cnh.

### CT02 - Bloqueio de CPF Duplicado
1. Tipo de Teste: Caixa Preta

2. Nível do Teste: Integração

3. Objetivo: Verificar se o sistema impede o cadastro de um motorista com CPF já existente.

4. Rastreabilidade: Endpoint POST /motoristas | Regra de Negócio RN02

5. Pré-condição: Existe um motorista cadastrado com o CPF 11122233344 (Carlos Oliveira).

6. Dados de Entrada:


{
  "nome": "Carlos Oliveira",
  "cpf": "11122233344",
  "cnh": "1234567890"
}

7. Passos de Execução:

Confirmar que o CPF já existe no banco.

Enviar requisição POST para /motoristas com o mesmo CPF.

Validar o status e a mensagem de erro da resposta.

8. Resultado Esperado:

HTTP 400 ou HTTP 409.

Mensagem informando erro de CPF duplicado.

✅ PASSED (Passou): O sistema se comportou exatamente como o esperado.



9. Critério de Aprovação: O sistema deve rejeitar a requisição e manter apenas o registro original.

### CT03 - Cadastro de Veículo
1. Tipo de Teste: Caixa Preta

2. Nível do Teste: Integração

3. Objetivo: Verificar se um veículo é cadastrado corretamente com os campos placa e modelo.

4. Rastreabilidade: Endpoint POST /veiculos | Regra de Negócio RN03

5. Pré-condição: API em execução e banco de dados disponível.

6. Dados de Entrada:

JSON
{
  "placa": "ABC1D23",
  "modelo": "Volvo FH 540"
}
7. Passos de Execução:

Enviar requisição POST para /veiculos.

Informar o payload do veículo.

Validar a resposta e a persistência dos dados.

8. Resultado Esperado:

HTTP 201 (Created).

Veículo cadastrado com ID retornado.

✅ PASSED (Passou): Retornos compatíveis com as consultas GET /veiculos/1.

9. Critério de Aprovação: O veículo deve ser salvo no banco e consultável via API.

### CT04 - Cadastro de Entrega
1. Tipo de Teste: Caixa Preta

2. Nível do Teste: Integração

3. Objetivo: Verificar se uma entrega é cadastrada vinculando um cliente, motoristaId, veiculoId e pesoKg.

4. Rastreabilidade: Endpoint POST /entregas | Regras de Negócio RN04 e RN05

5. Pré-condição: Motorista ID 1 e Veículo ID 1 já cadastrados na base de dados.

6. Dados de Entrada:

JSON
{
  "cliente": "Distribuidora Joinville",
  "motoristaId": 1,
  "veiculoId": 1,
  "pesoKg": 450
}
7. Passos de Execução:

Confirmar existência do motorista (ID 1) e do veículo (ID 1).

Enviar requisição POST para /entregas.

Validar a resposta.

8. Resultado Esperado:

HTTP 201 (Created).

Entrega criada com status inicial "PENDENTE".

✅ PASSED (Passou): Registro confirmado via consulta GET /entregas/1.

9. Critério de Aprovação: A entrega deve ser associada aos IDs do motorista e veículo informados.

### CT05 - Atualização de Status da Entrega
1. Tipo de Teste: Caixa Preta

2. Nível do Teste: Integração

3. Objetivo: Verificar se o status de uma entrega pode ser alterado corretamente.

4. Rastreabilidade: Endpoint PUT /entregas/:id | Regra de Negócio RN06

5. Pré-condição: Existe uma entrega com ID 1 cadastrada.

6. Dados de Entrada:

JSON
{
  "status": "EM TRANSPORTE"
}
7. Passos de Execução:

Enviar requisição PUT para /entregas/1.

Informar o novo valor do campo status.

Validar o retorno da API.

8. Resultado Esperado:

HTTP 200 (OK).

Status alterado no banco de dados.

✅ PASSED (Passou): O sistema alterou o estado do recurso com sucesso.

9. Critério de Aprovação: A requisição deve alterar o status e mantê-lo atualizado nas consultas subsequentes.

### CT06 - Consulta de Motorista por ID e Listagem
1. Tipo de Teste: Caixa Preta

2. Nível do Teste: Integração

3. Objetivo: Verificar se a API lista todos os motoristas e permite buscar um registro individual pelo ID.

4. Rastreabilidade: Endpoints GET /motoristas e GET /motoristas/:id

5. Pré-condição: Motoristas com ID 1 ("Carlos Oliveira") e ID 2 ("Mariana Souza") cadastrados.

6. Dados de Entrada: Requisição GET http://localhost:3000/motoristas/1

7. Passos de Execução:

Executar a requisição GET para /motoristas/1.

Validar o Status Code e a estrutura do JSON retornado.

8. Resultado Esperado:

HTTP 200 (OK).

Body da resposta:

JSON
{
  "id": 1,
  "nome": "Carlos Oliveira",
  "cpf": "11122233344",
  "cnh": "1234567890"
}
✅ PASSED (Passou): Retorno de 200 OK com tempo de resposta de 1 ms.

9. Critério de Aprovação: O endpoint deve retornar os dados exatos do motorista correspondente ao ID informado.

### CT07 - Validação Unitária de CPF Duplicado
1. Tipo de Teste: Caixa Branca

2. Nível do Teste: Unitário

3. Objetivo: Validar se a camada de serviço impede o cadastro quando o CPF informado já está registrado.

4. Rastreabilidade: Classe MotoristaService | Método validarCpfDuplicado() | Regra de Negócio RN02

5. Pré-condição: Mock do repositório configurado para simular o retorno de um CPF existente (11122233344).

6. Dados de Entrada: cpf = "11122233344"

7. Passos de Execução:

Invocar o método validarCpfDuplicado("11122233344").

Verificar se a exceção é lançada e a execução bloqueada.

8. Resultado Esperado:

Exceção de negócio lançada.

Cadastro interrompido antes do acesso ao banco.

✅ PASSED (Passou): Regra isolada e validada com testes unitários.


9. Critério de Aprovação: O teste de unidade deve passar ao capturar a exceção esperada.

### CT08 - Validação Unitária dos Campos Obrigatórios da Entrega
1. Tipo de Teste: Caixa Branca

2. Nível do Teste: Unitário

3. Objetivo: Garantir que o serviço lance erro ao tentar cadastrar uma entrega sem o campo cliente ou pesoKg.

4. Rastreabilidade: Classe EntregaService | Método validarEntrega() | Regra de Negócio RN05

5. Pré-condição: Suíte de testes unitários com Jest configurada.

6. Dados de Entrada:

JSON
{
  "cliente": "",
  "motoristaId": 1,
  "veiculoId": 1,
  "pesoKg": null
}
7. Passos de Execução:

Executar a função de validação repassando o objeto incompleto.

Capturar o erro retornado pela regra de validação.

8. Resultado Esperado:

Retorno de erro de validação de campos obrigatórios.

✅ PASSED (Passou): Validação unitária aprovada.

9. Critério de Aprovação: O método deve rejeitar objetos sem os atributos obrigatórios preenchidos.

### Conclusão
O documento reflete a estrutura exata da API testada, englobando:

8 Casos de Teste cobrindo integrações de API e testes unitários.

Schemas reais observados nas execuções (cnh, cliente, pesoKg).

Cobertura de rotas de consulta (GET /motoristas, GET /veiculos, GET /entregas) e modificação.

Rastreabilidade direta com os códigos de status (HTTP 200 OK) e payloads retornados nos testes práticos.