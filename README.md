# 🚀 API de Gerenciamento de Clientes

## 📋 Sobre o Projeto
Sistema robusto para gerenciamento de clientes desenvolvido com Spring Boot e integrado com tecnologias Liferay, uma plataforma líder em soluções digitais corporativas. O sistema possui dois níveis de acesso:
- 👑 **Administrador**: Acesso completo (CRUD)
- 👤 **Usuário**: Apenas visualização

## 🛠️ Tecnologias Utilizadas

### Back-end
- ☕ Java
- 🍃 Spring Boot
- 🐘 MySQL (configurável)
- 🔨 Gradle

## 🔐 Credenciais de Acesso

### Administrador
```
Username: admin
Password: 123qwe!@#
```

### Usuário Padrão
```
Username: usuario
Password: 123qwe123
```

## 🚀 Como Executar

1. **Clone o Repositório**
```bash
git clone https://github.com/SEU_USERNAME/clientes-crud.git
cd cliente-backend
```

2. **Configure o Banco de Dados**
```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/clientes_db
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
spring.jpa.hibernate.ddl-auto=update
```

3. **Execute a Aplicação**
```bash
./gradlew bootRun
```

> 💡 A API estará disponível em `http://localhost:8080`

## 🔒 Autenticação

O sistema utiliza **Basic Auth** para autenticação. Todas as requisições devem incluir o header de autorização:

```
Authorization: Basic {credenciais_em_base64}
```

## 📡 Endpoints da API

### Clientes

#### 📋 Listar Todos os Clientes
```http
GET /clientes
```

#### 🔍 Buscar Cliente por ID
```http
GET /clientes/{id}
```

#### ➕ Criar Novo Cliente
```http
POST /clientes

{
    "nome": "Maria Silva",
    "cpf": "12345678901",
    "endereco": {
        "cep": "12345678",
        "logradouro": "Rua das Flores",
        "bairro": "Centro",
        "cidade": "São Paulo",
        "uf": "SP"
    },
    "telefones": [
        {
            "tipo": "CELULAR",
            "numero": "11999999999"
        }
    ],
    "emails": [
        "maria@email.com"
    ]
}
```

#### 📝 Atualizar Cliente
```http
PUT /clientes/{id}

{
    // mesma estrutura do POST
}
```

#### ❌ Excluir Cliente
```http
DELETE /clientes/{id}
```

## 🔍 Validações

- **Nome**: 3 a 100 caracteres
- **CPF**: 11 dígitos numéricos
- **Email**: Formato válido de email
- **Endereço**: CEP, logradouro, bairro, cidade e UF obrigatórios
- **Telefone**: Número obrigatório e tipo (RESIDENCIAL, COMERCIAL ou CELULAR)

## 🔐 Permissões

| Endpoint | Admin | Usuário |
|----------|-------|---------|
| GET /clientes | ✅ | ✅ |
| GET /clientes/{id} | ✅ | ✅ |
| POST /clientes | ✅ | ❌ |
| PUT /clientes/{id} | ✅ | ❌ |
| DELETE /clientes/{id} | ✅ | ❌ |

## 📝 Respostas da API

### Sucesso
- **200**: Operação realizada com sucesso
- **201**: Recurso criado com sucesso
- **204**: Operação realizada com sucesso (sem conteúdo)

### Erro
- **400**: Dados inválidos
- **401**: Não autorizado
- **403**: Acesso negado
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor 