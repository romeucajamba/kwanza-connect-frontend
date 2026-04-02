# 🚀 KwanzaConnect Frontend — Plataforma de Intercâmbio P2P e Câmbio

![KwanzaConnect Banner](https://images.unsplash.com/photo-1611974715853-2b8ef9595d03?q=80&w=2070&auto=format&fit=crop)

O **KwanzaConnect** é uma aplicação web moderna de alta fidelidade para negociação de moedas (P2P) e monitorização do mercado cambial angolano. Desenvolvido com foco em performance, segurança e uma experiência de usuário (UX) premium.

---

## ✨ Funcionalidades Principais

- **📊 Dashboard de Controle**: Visão consolidada de saldos em AOA, USD e EUR com gráficos de atividade.
- **🤝 Mercado P2P**: Compra e venda direta de moedas entre usuários com sistema de reputação e IA para sugestão de taxas.
- **💱 Monitor de Câmbio**: Acompanhamento em tempo real das taxas de mercado e bancárias.
- **🔄 Simulador de Conversão**: Calculadora inteligente com gráficos de tendências (*Candlesticks*).
- **💬 Central de Comunicação**: Chat em tempo real para negociações P2P e notificações de sistema.
- **🛡️ Gestão de Perfil & KYC**: Verificação de identidade, métodos de pagamento e segurança da conta.
- **🌓 Modo Escuro/Claro**: Interface totalmente adaptável às preferências do usuário.

---

## 🛠️ Stack Tecnológica

### Core
- **React 18** + **TypeScript**
- **Vite** (Build Tool)

### Estado & Dados
- **Zustand**: Gestão de estado global resiliente (Auth & Settings).
- **TanStack Query (v5)**: Cache e sincronização de dados do servidor.
- **Axios**: Cliente HTTP com interceptores para JWT.

### Styling & UI
- **Tailwind CSS**: Estilização baseada em utilitários.
- **Framer Motion**: Animações de alta fluidez e transições de página.
- **Material Symbols**: Set de ícones modernos do Google.

### Formulários & Validação
- **React Hook Form**: Gestão de formulários performática.
- **Zod**: Validação de esquemas com tipagem estática.

---

## 🏗️ Arquitetura do Projeto

O projeto segue uma estrutura modular e escalável, separando claramente as responsabilidades:

```text
src/
├── app/              # Todas as telas (pages) da aplicação
├── components/       # Componentes UI reutilizáveis e layouts
├── services/         # Lógica de API (Requests & React Query Hooks)
├── store/            # Estado global com Zustand (Store)
├── constants/        # Variáveis imutáveis e configurações de rotas
├── schema/           # Definições de validação Zod
├── lib/              # Configurações de bibliotecas (Axios, Utils)
├── types/            # Interfaces e Tipos TypeScript globais
└── assets/           # Estilos globais (index.css) e imagens
```

---

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js (v18+)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/romeucajamba/kwanza-connect-frontend.git
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_BASE_URL=https://api.kwanzaconnect.com/v1
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

---

## 🔐 Autenticação e Segurança

- **JWT Storage**: O token é armazenado em cookies seguros com flag `SameSite: Strict`.
- **Private Routes**: Todas as rotas internas são protegidas por um middleware de autenticação.
- **Persistência**: O objeto do usuário e as configurações de tema são persistidos usando a funcionalidade de `persist` do Zustand.

---

## 📱 Responsividade

A aplicação foi desenvolvida sob a filosofia **Mobile-First**, garantindo uma experiência perfeita em:
- **Smartphones**: Menu flutuante inferior otimizado.
- **Tablets**: Layouts de grade adaptáveis.
- **Desktops**: Sidebar fixa e exploração máxima do espaço horizontal.
- **SmartTVs**: Escalonamento dinâmico via Tailwind.

---

## 📦 Build e Produção

Para gerar a versão otimizada para produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`, prontos para serem servidos por qualquer servidor estático (Nginx, Vercel, Netlify).

---

## 📝 Licença

Este projeto é de uso privado para a plataforma **KwanzaConnect**.

---
*Desenvolvido com ❤️ pela equipe Antigravity.*
