# Sistema de Análise de Empréstimos - API REST

API REST desenvolvida em Node.js, Express e MySQL para análise automática de elegibilidade a modalidades de empréstimo financeiro e gerenciamento completo de clientes.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** (Ambiente de execução JavaScript)
- **Express** (Framework Web)
- **MySQL** (Banco de dados relacional)
- **dotenv** (Gerenciamento de variáveis de ambiente)
- **cors** (Habilitação de Cross-Origin Resource Sharing)
- **nodemon** (Execução e recarregamento dinâmico em desenvolvimento)

---

## 📁 Estrutura do Projeto

```text
emprestimos-api/
├── src/
│   ├── controllers/
│   │   └── clienteController.js
│   ├── database/
│   │   └── connection.js
│   ├── routes/
│   │   └── clienteRoutes.js
│   ├── services/
│   │   ├── clienteService.js
│   │   └── emprestimoService.js
│   └── app.js
├── .env
├── database.sql
├── package.json
├── README.md
└── server.js
```

---

## ⚙️ Instruções de Instalação e Configuração

### 1. Clonar o Repositório e Instalar Dependências

```bash
# Instalar dependências
npm install
```

### 2. Configurar o Banco de Dados MySQL

1. Certifique-se de que o servidor MySQL está em execução.
2. Importe o arquivo `database.sql` no seu banco de dados MySQL para criar o banco `sistema_emprestimos`, suas tabelas e popular as modalidades iniciais.

```bash
mysql -u root -p < database.sql
```

### 3. Configurar as Variáveis de Ambiente

Crie ou edite o arquivo `.env` na raiz do projeto com suas credenciais do MySQL:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=sistema_emprestimos
```

---

## 🚀 Executando a Aplicação

```bash
# Modo de Desenvolvimento (com recarregamento automático via nodemon)
npm run dev

# Modo de Produção
npm start
```

O servidor estará rodando em `http://localhost:3000`.

---

## 📌 Endpoints da API

### 1. Análise de Empréstimos (Parte Principal)

Determina quais modalidades de empréstimo estão disponíveis para o cliente com base em sua renda, idade e localização.

- **URL:** `POST /cliente_emprestimos`
- **Headers:** `Content-Type: application/json`
- **Exemplo de Corpo (Body):**

```json
{
  "age": 26,
  "cpf": "275.484.389-23",
  "name": "Vuxaywua Zukiagou",
  "income": 7000.00,
  "location": "SP"
}
```

- **Exemplo de Resposta (Status 200 OK):**

```json
{
  "customer": "Vuxaywua Zukiagou",
  "loans": [
    {
      "type": "PERSONAL",
      "interest_rate": 4
    },
    {
      "type": "GUARANTEED",
      "interest_rate": 3
    },
    {
      "type": "CONSIGNMENT",
      "interest_rate": 2
    }
  ]
}
```

---

### 2. Cadastrar Cliente

Cadastra um novo cliente no banco de dados.

- **URL:** `POST /clientes`
- **Headers:** `Content-Type: application/json`
- **Exemplo de Corpo (Body):**

```json
{
  "name": "João da Silva",
  "cpf": "123.456.789-00",
  "age": 26,
  "income": 7000.00,
  "location": "SP"
}
```

- **Exemplo de Resposta (Status 201 Created):**

```json
{
  "id": 1,
  "name": "João da Silva",
  "cpf": "123.456.789-00",
  "age": 26,
  "income": 7000.00,
  "location": "SP"
}
```

---

### 3. Listar Todos os Clientes

Retorna a lista de todos os clientes cadastrados.

- **URL:** `GET /clientes`
- **Exemplo de Resposta (Status 200 OK):**

```json
[
  {
    "id": 1,
    "name": "João da Silva",
    "cpf": "123.456.789-00",
    "age": 26,
    "income": "7000.00",
    "location": "SP"
  }
]
```

---

### 4. Buscar Cliente por ID

Busca os dados de um cliente específico pelo seu ID.

- **URL:** `GET /clientes/:id`
- **Exemplo de Resposta (Status 200 OK):**

```json
{
  "id": 1,
  "name": "João da Silva",
  "cpf": "123.456.789-00",
  "age": 26,
  "income": "7000.00",
  "location": "SP"
}
```

- **Exemplo de Resposta de Erro (Status 404 Not Found):**

```json
{
  "message": "Cliente não encontrado."
}
```

---

### 5. Atualizar Cliente

Atualiza as informações de um cliente existente.

- **URL:** `PUT /clientes/:id`
- **Headers:** `Content-Type: application/json`
- **Exemplo de Corpo (Body):**

```json
{
  "name": "João da Silva Sauro",
  "cpf": "123.456.789-00",
  "age": 27,
  "income": 8000.00,
  "location": "SP"
}
```

- **Exemplo de Resposta (Status 200 OK):**

```json
{
  "message": "Cliente atualizado com sucesso."
}
```

---

### 6. Remover Cliente

Exclui um cliente do banco de dados pelo seu ID.

- **URL:** `DELETE /clientes/:id`
- **Exemplo de Resposta (Status 200 OK):**

```json
{
  "message": "Cliente removido com sucesso."
}
```

---

## 📏 Regras de Negócio de Análise de Empréstimo

1. **Empréstimo Pessoal (`PERSONAL` - 4%):**
   - Renda <= R$ 3.000,00 **OU**
   - Renda entre R$ 3.000,00 e R$ 5.000,00 **E** Idade < 30 anos **E** Localização = "SP".

2. **Empréstimo com Garantia (`GUARANTEED` - 3%):**
   - Renda <= R$ 3.000,00 **OU**
   - Renda entre R$ 3.000,00 e R$ 5.000,00 **E** Idade < 30 anos **E** Localização = "SP".

3. **Empréstimo Consignado (`CONSIGNMENT` - 2%):**
   - Renda >= R$ 5.000,00.
