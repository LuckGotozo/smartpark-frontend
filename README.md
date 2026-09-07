# 🅿️ SmartPark Frontend

Interface web do **SmartPark**, um sistema Full Stack para gerenciamento de estacionamentos, veículos, vagas e reservas.

Este repositório contém o **frontend da aplicação**, desenvolvido com React e integrado à API REST do SmartPark.

🔗 [Repositório do Backend](https://github.com/LuckGotozo/smartpark)

---

## 🚀 Funcionalidades

- 🔐 Login de usuários
- 👤 Cadastro de novos usuários
- 🚗 Cadastro e visualização de veículos
- 🅿️ Visualização de estacionamentos
- 🚘 Consulta de vagas
- 📅 Criação de reservas
- ❌ Cancelamento de reservas
- 📊 Dashboard com informações do usuário
- 🔑 Autenticação utilizando JWT
- 🔄 Integração com API REST

---

## 🖥️ Tecnologias

- React
- JavaScript
- HTML5
- CSS3
- Vite
- Fetch API
- Git
- GitHub

---

## 🔗 Integração com o Backend

O frontend consome a API REST desenvolvida em **Java + Spring Boot**.

Durante o desenvolvimento, a API é executada em:

```text
http://localhost:8080
```

O frontend utiliza o token JWT retornado no login para acessar os endpoints protegidos da aplicação.

---

## 📂 Principais telas

### 🔐 Autenticação

O sistema permite:

- criação de conta;
- login;
- armazenamento do token de autenticação;
- logout.

### 📊 Dashboard

Apresenta uma visão geral com:

- quantidade de veículos;
- estacionamentos;
- vagas ativas;
- reservas ativas.

### 🚗 Veículos

Permite visualizar os veículos do usuário e cadastrar novos veículos.

### 🅿️ Estacionamentos

Exibe os estacionamentos cadastrados no sistema.

### 🚘 Vagas

Permite consultar as vagas e visualizar seu status.

### 📅 Reservas

Permite:

- criar uma nova reserva;
- selecionar veículo;
- selecionar vaga;
- definir data e horário;
- visualizar reservas;
- cancelar reservas.

---
## 📸 Screenshots

### 📊 Dashboard

Visão geral do sistema com informações sobre veículos, estacionamentos, vagas e reservas.

![Dashboard do SmartPark](https://github.com/LuckGotozo/smartpark-frontend/blob/main/screenshots/Dashboard.png)

### 🅿️ Vagas

Visualização das vagas cadastradas e seus respectivos status.

![Vagas do SmartPark](screenshots/vagas.png)

### 📅 Reservas

Gerenciamento das reservas realizadas pelo usuário.

![Reservas do SmartPark](https://github.com/LuckGotozo/smartpark-frontend/blob/main/screenshots/Reservas.png)

---
## ⚙️ Como executar

### Pré-requisitos

Tenha instalado:

- Node.js
- npm
- Git

Clone o repositório:

```bash
git clone https://github.com/LuckGotoz0/smartpark-frontend.git
```

Entre na pasta:

```bash
cd smartpark-frontend
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

A aplicação ficará disponível normalmente em:

```text
http://localhost:5173
```

> Para utilizar todas as funcionalidades, o backend do SmartPark também precisa estar em execução.

---

## 🔙 Backend

O backend possui autenticação JWT, Spring Security, PostgreSQL, regras de negócio e os endpoints utilizados por esta interface.

🔗 [SmartPark Backend](https://github.com/LuckGotozo/smartpark)

---

## 🎯 Objetivo

O SmartPark foi desenvolvido como projeto de estudo e portfólio, com o objetivo de praticar o desenvolvimento de uma aplicação Full Stack e a integração entre frontend, backend e banco de dados.

---

## 👨‍💻 Autor

**Guilherme Neineska**

Estudante de Engenharia de Software com foco em desenvolvimento Backend Java.

[LinkedIn](https://www.linkedin.com/in/guilherme-neineska/)
