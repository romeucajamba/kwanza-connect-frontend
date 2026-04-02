# 🛡️ Guia de Segurança Frontend — KwanzaConnect

Este documento detalha as medidas de segurança implementadas no frontend para proteger a plataforma contra ataques comuns e garantir a integridade dos dados dos usuários.

---

## 1. 🌐 Content Security Policy (CSP)

Implementamos uma **CSP** rigorosa no `index.html`. Ela atua como uma barreira contra o **XSS (Cross-Site Scripting)**, definindo de onde scripts, estilos e fontes podem ser carregados.

- **`script-src 'self'`**: Apenas scripts do próprio domínio e scripts "em linha" (inline) autorizados são executados.
- **`frame-ancestors 'none'`**: Impede que o site seja carregado dentro de um `<iframe>` em outros sites, prevenindo ataques de **Clickjacking**.

## 2. 🧱 Hardening do Axios (API)

O cliente HTTP (`src/lib/axios.ts`) foi reforçado com as seguintes configurações:

- **Timeout de 15s**: Previne que o navegador fique travado em requisições pendentes.
- **`X-Content-Type-Options: nosniff`**: Garante que o navegador respeite o tipo MIME enviado pelo servidor, impedindo a execução de arquivos com tipos ocultos maliciosos.
- **Mascaramento de Erros**: O interceptor de resposta remove detalhes técnicos sensíveis (como stack traces do backend) antes de repassar o erro para a interface.

## 3. 🍪 Segurança de Sessão (Cookies)

A gestão de tokens no `src/store/authStore.ts` utiliza as melhores práticas:

- **Nome Disfarçado**: O token agora utiliza `kwanza_access_token` em vez de nomes genéricos.
- **`SameSite: Strict`**: O cookie só é enviado em requisições que partem do próprio site, eliminando o risco de **CSRF (Cross-Site Request Forgery)**.
- **`Secure: true`**: Garante que o token só circule em conexões HTTPS criptografadas.
- **Caminho Restrito (`path: /`)**: O cookie é visível em toda a aplicação, mas restrito ao domínio correto.

## 4. 🧽 Sanitização de Dados

Criamos utilitários em `src/lib/security.ts` para proteção adicional em áreas dinâmicas (como chat):

- **`sanitizeHTML`**: Remove tags `<script>` e atributos de eventos (como `onclick`) de strings vindas de fontes externas.
- **`maskSensitiveData`**: Função automática para ocultar senhas, CPFs ou tokens em logs de console durante o desenvolvimento.

---

## 🧪 Como Testar em Desenvolvimento

Para verificar se as proteções estão ativas, siga estes passos no Navegador (Chrome/Edge/Firefox):

1. **Inspecionar Elementos (F12)** -> Aba **Rede (Network)**:
   - Clique em qualquer requisição à API e veja os cabeçalhos em **Response Headers**. Você verá o `X-Content-Type-Options`.
2. **Aba Aplicação (Application)** -> **Cookies**:
   - Verifique se o cookie `kwanza_access_token` possui as flags **Secure** e **SameSite=Strict** marcadas.
3. **Aba Console**:
   - Se tentar injetar um script via URL ou console, a CSP deve bloquear a execução e mostrar uma mensagem de erro vermelha indicando violação de política.

## 🚀 Recomendações para Produção

- **HTTPS Obrigatório**: As proteções de cookie não funcionarão em sites HTTP planos (sem certificado SSL).
- **Subresource Integrity (SRI)**: Futuramente, considere adicionar SRI para scripts externos (como Google Fonts) para garantir que não foram alterados por terceiros.

---
*Segurança é um processo contínuo. Este frontend foi endurecido, mas lembre-se: a segurança final sempre depende de um backend robusto.*
