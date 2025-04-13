# Payment Gateway - Projeto de Estudo Full Stack

[![Linguagem Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![Linguagem Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Linguagem NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Linguagem Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-000000?style=for-the-badge&logo=apache-kafka&logoColor=white)](https://kafka.apache.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 🚀 Sobre o Projeto

Este projeto é um Payment Gateway desenvolvido como um estudo para aprimorar meus conhecimentos como desenvolvedor Full Stack. Ele demonstra a integração de um front-end moderno com um back-end robusto, além de explorar conceitos de comunicação assíncrona com o Kafka e a containerização com Docker.

O gateway permite a criação e o gerenciamento de cobranças, com um fluxo de validação adicional para cobranças de alto valor, utilizando um microsserviço dedicado. A arquitetura do projeto visa simular um ambiente de produção com diferentes serviços comunicando-se de forma eficiente.

## ✨ Funcionalidades Principais

**Front-end (Next.js):**

* **Autenticação por Token:** Sistema de login seguro utilizando tokens.
* **Dashboard de Cobranças:** Listagem clara e organizada de todas as cobranças registradas.
* **Criação de Cobranças:** Interface intuitiva para criar novas solicitações de pagamento.
* **Detalhes da Cobrança:** Visualização completa das informações de uma cobrança específica.

**API (Go Lang):**

* **Criação de Contas:** Endpoint para registrar novas contas no sistema.
* **Criação de Cobranças:** Endpoint para gerar novas solicitações de pagamento.
* **Atualização de Status de Cobranças:** Permite modificar o status de uma cobrança (e.g., pendente, paga, cancelada).
* **Integração com Kafka:** Publica mensagens para o Kafka quando uma cobrança possui um valor elevado, iniciando o fluxo de validação.

**Validação de Cobranças (NestJS - Microsserviço):**

* **Consumo de Mensagens do Kafka:** Recebe mensagens sobre cobranças de alto valor publicadas pela API Go.
* **Lógica de Validação:** Implementa a lógica para determinar se uma cobrança é suspeita ou não.
* **Publicação de Mensagens no Kafka:** Envia o resultado da validação de volta para o Kafka, permitindo que a API Go atualize o status da cobrança.

**Kafka:**

* Atua como um sistema de mensageria assíncrona, desacoplando a API Go do microsserviço de validação. Isso permite que os serviços operem de forma independente e escalável, além de garantir a entrega das mensagens mesmo em caso de falha temporária de um dos serviços.

**Docker:**

* A utilização do Docker facilita a criação de um ambiente de desenvolvimento consistente e isolado. Ele permite empacotar cada parte da aplicação (API Go, microsserviço NestJS, Kafka, PostgreSQL) em contêineres, garantindo que as dependências e configurações sejam as mesmas em diferentes ambientes (desenvolvimento, teste, produção). O Docker Compose orquestra a execução desses contêineres, simplificando o processo de subir toda a infraestrutura necessária para rodar o projeto.

## 🛠️ Tecnologias Utilizadas

* **Front-end:**
    * [Next.js](https://nextjs.org/) (Framework React para aplicações web com renderização server-side e estática)
    * [React](https://react.dev/) (Biblioteca JavaScript para construção de interfaces de usuário)
    * [Tailwind CSS](https://tailwindcss.com/) (Framework CSS utilitário para estilização rápida)
* **Back-end (API):**
    * [Go](https://go.dev/) (Linguagem de programação)
    * [go-chi/chi](https://go-chi.io/) (Roteador HTTP leve para Go)
    * [net/http](https://pkg.go.dev/net/http) (Pacote padrão para construir servidores HTTP em Go)
* **Microsserviço:**
    * [NestJS](https://nestjs.com/) (Framework Node.js para construção de aplicações server-side eficientes e escaláveis)
* **Mensageria:**
    * [Kafka](https://kafka.apache.org/) (Plataforma de streaming de eventos distribuída)
* **Banco de Dados:**
    * [PostgreSQL](https://www.postgresql.org/) (Sistema de gerenciamento de banco de dados relacional)
* **Outros:**
    * [Docker](https://www.docker.com/) (Para containerização)
    * [Docker Compose](https://docs.docker.com/compose/) (Para orquestração de múltiplos contêineres Docker)

## ⚙️ Como Rodar o Projeto

Siga estas instruções para configurar e executar o projeto em seu ambiente local.

**Pré-requisitos:**

* [Node.js](https://nodejs.org/) (para o front-end e o microsserviço)
* [Go](https://go.dev/dl/) (para a API)
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/install/)

**Passos:**

1.  **Clonar o Repositório:**
    ```bash
    git clone [https://github.com/lucascorreia95/payment-gateway.git](https://github.com/lucascorreia95/payment-gateway.git)
    cd payment-gateway
    ```

2.  **Configurar e Rodar o Banco de Dados e Kafka (API Go):**
    * Navegue até a pasta da API Go:
        ```bash
        cd api-go
        ```
    * Utilize o arquivo `docker-compose.yml` presente nesta pasta para configurar e iniciar o PostgreSQL e o Kafka. Execute:
        ```bash
        docker-compose up -d
        ```
    * **Executar as Migrações do Banco de Dados (API Go):**
        * Os arquivos de migração para o banco de dados da API Go estão localizados na pasta `go-gateway-api/migrations`. Certifique-se de configurar a conexão com o banco de dados PostgreSQL e execute os comandos necessários para aplicar essas migrações, conforme a biblioteca utilizada no projeto.

3.  **Rodar a API Go Localmente:**
    * Ainda na pasta `api-go`, configure as variáveis de ambiente (ex: conexão com o banco de dados PostgreSQL, endereço do Kafka) em um arquivo `.env` ou diretamente no código (não recomendado para produção).
    * Instale as dependências:
        ```bash
        go mod tidy
        go mod download
        ```
    * Navegue até a pasta principal da aplicação Go:
        ```bash
        cd cmd/app
        ```
    * Execute a API:
        ```bash
        go run main.go
        ```

4.  **Configurar e Rodar o Banco de Dados do Microsserviço (NestJS):**
    * Navegue até a pasta do microsserviço:
        ```bash
        cd microservice-nestjs
        ```
    * Utilize o arquivo `docker-compose.yml` presente nesta pasta para configurar e iniciar o banco de dados utilizado pelo microsserviço. Execute:
        ```bash
        docker-compose up -d
        ```
    * **Executar as Migrações do Banco de Dados (NestJS - Prisma):**
        * Instale as dependências do projeto NestJS:
            ```bash
            npm install
            # ou
            yarn install
            ```
        * Configure a conexão com o banco de dados do microsserviço no arquivo `schema.prisma`.
        * Execute o comando do Prisma para rodar as migrations:
            ```bash
            npx prisma migrate dev
            ```

5.  **Rodar o Microsserviço NestJS Localmente:**
    * Ainda na pasta `microservice-nestjs`, configure as variáveis de ambiente (ex: endereço do Kafka, conexão com o banco de dados do microsserviço) em um arquivo `.env`.
    * Execute o microsserviço especificando o arquivo de entrada:
        ```bash
        npm run start:dev -- --entryFile cmd/kafka.cmd
        # ou
        yarn start:dev -- --entryFile cmd/kafka.cmd
        ```

6.  **Rodar o Front-end (Next.js) Localmente:**
    * Navegue até a pasta do front-end:
        ```bash
        cd frontend-nextjs
        ```
    * Instale as dependências:
        ```bash
        npm install
        # ou
        yarn install
        ```
    * Configure as variáveis de ambiente (ex: URL da API Go) em um arquivo `.env.local`.
    * Execute o front-end em modo de desenvolvimento:
        ```bash
        npm run dev
        # ou
        yarn dev
        ```
    * Acesse o front-end no seu navegador em `http://localhost:3000` (ou a porta configurada).

**Observações Importantes:**

* Certifique-se de que as portas utilizadas nos arquivos `docker-compose.yml` não estejam em conflito com outros serviços rodando na sua máquina.
* A configuração dos bancos de dados deve ser ajustada conforme a necessidade do seu projeto nos respectivos arquivos `docker-compose.yml` e arquivos de configuração.
* Verifique se as URLs da API Go e do Kafka, bem como as configurações de banco de dados, estão corretamente configuradas nas variáveis de ambiente e nos arquivos de configuração do front-end, da API Go e do microsserviço (`.env` e `schema.prisma` no caso do NestJS).
* **Para o NestJS, certifique-se de ter o Prisma CLI instalado globalmente (`npm install -g prisma`) ou execute o comando dentro do seu projeto usando `npx`.**
* **Para a API Go, os arquivos de migração estão localizados na pasta `go-gateway-api/migrations`. Configure a conexão com o banco de dados e execute os comandos específicos da biblioteca de migração utilizada para aplicá-las.**
* Este guia assume que você deseja rodar o banco de dados e o Kafka via Docker Compose e a API Go e o microsserviço NestJS localmente para desenvolvimento. Se você preferir rodar todos os componentes com Docker Compose, a estrutura dos arquivos `docker-compose.yml` precisará ser ajustada para incluir todos os serviços.


## 🧪 Próximos Passos e Melhorias

Este projeto foi criado para aprendizado e demonstração. Algumas possíveis melhorias e próximos passos incluem:

* Implementação de testes unitários e de integração para todas as partes do sistema.
* Adicionar tratamento de erros mais robusto e logging.
* Implementar autenticação e autorização mais seguras (e.g., OAuth 2.0).
* Adicionar mais detalhes à tela de detalhes da cobrança (histórico de status, etc.).
* Melhorar a interface do usuário e a experiência do usuário (UX/UI).
* Implementar mecanismos de escalabilidade para a API e o microsserviço.
* Adicionar monitoramento e métricas para acompanhar o desempenho do sistema.
* Explorar outras formas de comunicação entre os serviços (além do Kafka).
* Implementar diferentes métodos de pagamento.

## 🤝 Contribuição

Como este é um projeto de estudo pessoal, contribuições diretas podem não ser o foco principal neste momento. No entanto, sinta-se à vontade para abrir issues caso encontre algum problema ou tenha sugestões de melhorias.