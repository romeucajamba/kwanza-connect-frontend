import {
  BookOpen,
  LayoutDashboard,
  ArrowLeftRight,
  ShieldCheck,
  UserCheck,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';

export const docsData = [
  {
    slug: 'introducao',
    title: 'Introdução à Plataforma',
    icon: BookOpen,
    content: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Bem-vindo à KwanzaConnect
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          A KwanzaConnect é a principal plataforma de intercâmbio P2P (peer-to-peer)
          de Angola. Compre e venda criptomoedas e divisa estrangeira diretamente
          com outros utilizadores de forma rápida, segura e com taxas
          extremamente competitivas.
        </p>

        <h3 className="text-xl font-bold text-text-primary mt-8">
          O que pode fazer na KwanzaConnect?
        </h3>
        <ul className="list-disc pl-6 space-y-3 text-text-secondary mt-4">
          <li>
            <strong className="text-text-primary">Comprar e Vender P2P:</strong>{' '}
            Negocie diretamente com outros utilizadores sem intermediários. Encontre
            a melhor taxa no nosso mercado aberto.
          </li>
          <li>
            <strong className="text-text-primary">Escrow Inteligente:</strong>{' '}
            O nosso sistema bloqueia os fundos do vendedor antes do pagamento,
            eliminando qualquer risco de fraude para o comprador.
          </li>
          <li>
            <strong className="text-text-primary">Múltiplos Métodos de Pagamento:</strong>{' '}
            Suportamos transferência bancária (BAI, Atlântico, BFA, BPC) e
            outros métodos locais angolanos.
          </li>
          <li>
            <strong className="text-text-primary">Verificação KYC:</strong>{' '}
            Para garantir um ambiente seguro, todos os utilizadores passam por
            um processo de verificação de identidade simples e rápido.
          </li>
        </ul>

        <div className="p-4 rounded-xl bg-surface-elevated border border-border-subtle mt-8">
          <div className="flex gap-3">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
            <div>
              <h4 className="font-bold text-text-primary text-sm">
                Segurança em Primeiro Lugar
              </h4>
              <p className="text-sm text-text-secondary mt-1">
                Toda a comunicação é encriptada e os seus dados pessoais são
                tratados de acordo com as melhores práticas de segurança. O
                sistema de Escrow garante que os seus fundos estão sempre
                protegidos durante uma transação.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: 'criar-conta',
    title: 'Criar Conta e Verificação KYC',
    icon: UserCheck,
    content: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Criar Conta e Verificação KYC
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          O registo na KwanzaConnect é rápido. Siga os passos abaixo para criar
          a sua conta e ativar as funcionalidades de trading P2P.
        </p>

        <h3 className="text-xl font-bold text-text-primary mt-8">
          Passo 1 — Dados Pessoais
        </h3>
        <div className="space-y-3 text-text-secondary mt-2">
          <p>Preencha o formulário de registo com:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Nome completo</strong> — como consta no seu BI ou Passaporte.</li>
            <li><strong>Endereço de e-mail</strong> — será usado para notificações e login.</li>
            <li><strong>Província e Município</strong> — para fins de verificação.</li>
            <li><strong>Senha segura</strong> — mínimo de 8 caracteres com letras e números.</li>
          </ul>
        </div>

        <h3 className="text-xl font-bold text-text-primary mt-8">
          Passo 2 — Verificação de Identidade (KYC)
        </h3>
        <div className="space-y-3 text-text-secondary mt-2">
          <p>
            A verificação KYC é obrigatória para proteger todos os utilizadores
            da plataforma e cumprir os requisitos legais.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Selecione o tipo de documento: <strong>Bilhete de Identidade</strong> ou <strong>Passaporte</strong>.</li>
            <li>Introduza o número do documento.</li>
            <li>Faça upload de uma foto da <strong>frente</strong> e do <strong>verso</strong> do documento.</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mt-6">
          <h4 className="font-bold text-primary text-sm mb-1">
            Tempo de Aprovação
          </h4>
          <p className="text-sm text-text-secondary">
            A verificação KYC é processada geralmente em menos de 24 horas.
            Receberá um e-mail de confirmação assim que a sua conta for aprovada.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'dashboard',
    title: 'O seu Dashboard',
    icon: LayoutDashboard,
    content: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          O seu Dashboard
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          O Dashboard é a sua central de comando. Assim que aceder à plataforma,
          terá uma visão completa das suas atividades, saldo e oportunidades
          de mercado em tempo real.
        </p>

        <h3 className="text-xl font-bold text-text-primary mt-8">
          Métricas Principais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 rounded-lg bg-surface border border-border-subtle">
            <h5 className="font-bold text-sm text-text-primary">Saldo Disponível</h5>
            <p className="text-xs text-text-secondary mt-1">
              O valor total em custódia e disponível para troca imediata.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-surface border border-border-subtle">
            <h5 className="font-bold text-sm text-text-primary">Ordens Ativas</h5>
            <p className="text-xs text-text-secondary mt-1">
              Número de negociações P2P em curso que aguardam confirmação.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-surface border border-border-subtle">
            <h5 className="font-bold text-sm text-text-primary">Histórico de Trocas</h5>
            <p className="text-xs text-text-secondary mt-1">
              Volume total de transações concluídas com sucesso na plataforma.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-text-primary mt-8">
          Taxas de Câmbio em Tempo Real
        </h3>
        <p className="text-text-secondary mt-2">
          O painel central do Dashboard exibe as taxas de câmbio P2P ao vivo,
          atualizadas a cada minuto. Pode usar este painel para identificar o
          melhor momento para comprar ou vender os seus ativos.
        </p>
      </div>
    ),
  },
  {
    slug: 'mercado-p2p',
    title: 'Mercado P2P — Comprar e Vender',
    icon: ArrowLeftRight,
    content: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Mercado P2P — Comprar e Vender
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          O Mercado P2P é o coração da KwanzaConnect. Aqui pode encontrar
          centenas de ofertas de compra e venda publicadas por outros utilizadores
          verificados, com diferentes taxas e métodos de pagamento.
        </p>

        <h3 className="text-xl font-bold text-text-primary mt-8">Como Comprar?</h3>
        <div className="space-y-3 text-text-secondary mt-2">
          <p>1. Aceda a <strong>"Mercado P2P"</strong> no menu lateral.</p>
          <p>2. Filtre por ativo (BTC, USDT, ETH) e método de pagamento preferido.</p>
          <p>3. Escolha uma oferta e clique em <strong>"Comprar"</strong>.</p>
          <p>4. O sistema ativa o Escrow — os fundos do vendedor são bloqueados automaticamente.</p>
          <p>5. Efetue o pagamento pelo método indicado pelo vendedor e confirme o envio do comprovativo na plataforma.</p>
          <p>6. Após confirmação do vendedor, os ativos são creditados na sua conta imediatamente.</p>
        </div>

        <h3 className="text-xl font-bold text-text-primary mt-8">Como Vender / Publicar uma Oferta?</h3>
        <div className="space-y-3 text-text-secondary mt-2">
          <p>1. Aceda a <strong>"Publicar Oferta"</strong>.</p>
          <p>2. Defina o ativo, o valor mínimo/máximo da transação e a sua taxa de câmbio.</p>
          <p>3. Selecione os métodos de pagamento que aceita.</p>
          <p>4. Clique em <strong>"Publicar"</strong>. A sua oferta ficará visível a todos os utilizadores.</p>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-border-subtle mt-6">
          <div className="flex gap-3">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
            <div>
              <h4 className="font-bold text-text-primary text-sm">Sistema de Escrow</h4>
              <p className="text-sm text-text-secondary mt-1">
                O Escrow é o mecanismo central de segurança. Quando uma ordem é
                iniciada, o sistema bloqueia os criptoativos do vendedor. Os
                ativos só são libertados após ambas as partes confirmarem a
                transação. Em caso de disputa, a nossa equipa de suporte intervém.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: 'seguranca',
    title: 'Segurança e Boas Práticas',
    icon: ShieldCheck,
    content: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Segurança e Boas Práticas
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          A segurança da sua conta e dos seus fundos é a nossa prioridade máxima.
          Siga estas recomendações para garantir uma experiência segura.
        </p>

        <h3 className="text-xl font-bold text-text-primary mt-8">Proteja a sua Conta</h3>
        <ul className="list-disc pl-6 space-y-3 text-text-secondary mt-2">
          <li>Use uma <strong>senha única e forte</strong> — nunca reutilize senhas de outras plataformas.</li>
          <li>Nunca partilhe o seu <strong>e-mail ou senha</strong> com ninguém, incluindo suporte.</li>
          <li>Aceda sempre à plataforma pelo endereço oficial: <strong>kwanzaconnect.ao</strong>.</li>
          <li>Desconfie de links enviados por e-mail ou SMS que peçam as suas credenciais.</li>
        </ul>

        <h3 className="text-xl font-bold text-text-primary mt-8">Durante uma Transação P2P</h3>
        <ul className="list-disc pl-6 space-y-3 text-text-secondary mt-2">
          <li>Verifique sempre a <strong>reputação do utilizador</strong> (número de trocas e avaliação).</li>
          <li><strong>Nunca liberte os fundos antes</strong> de confirmar o recebimento do pagamento no seu banco.</li>
          <li>Toda a comunicação deve ser feita <strong>dentro da plataforma</strong> — nunca aceite negociar pelo WhatsApp ou outro canal externo.</li>
          <li>Em caso de disputa, clique em <strong>"Abrir Disputa"</strong> e a nossa equipa irá mediar.</li>
        </ul>

        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 mt-6">
          <h4 className="font-bold text-red-500 text-sm mb-1">⚠️ Alerta de Fraude</h4>
          <p className="text-sm text-text-secondary">
            A KwanzaConnect <strong>nunca</strong> irá pedir-lhe para transferir
            fundos fora da plataforma, nem para partilhar a sua senha ou código
            de verificação. Se alguém o pedir, estamos perante uma tentativa de
            fraude — reporte imediatamente.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'historico',
    title: 'Histórico e Relatórios',
    icon: TrendingUp,
    content: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Histórico e Relatórios
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          Aceda ao historial completo de todas as suas transações na
          KwanzaConnect, com filtros avançados por data, tipo de ativo e estado.
        </p>

        <h3 className="text-xl font-bold text-text-primary mt-8">O que está no Histórico?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-lg bg-surface border border-border-subtle">
            <h5 className="font-bold text-sm text-text-primary">ID da Ordem</h5>
            <p className="text-xs text-text-secondary mt-1">
              O código único de cada transação, útil para suporte.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-surface border border-border-subtle">
            <h5 className="font-bold text-sm text-text-primary">Data e Hora</h5>
            <p className="text-xs text-text-secondary mt-1">
              Registo exato do momento em que a transação foi concluída.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-surface border border-border-subtle">
            <h5 className="font-bold text-sm text-text-primary">Ativo e Valor</h5>
            <p className="text-xs text-text-secondary mt-1">
              O tipo de criptomoeda e o valor em AOA negociado.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-surface border border-border-subtle">
            <h5 className="font-bold text-sm text-text-primary">Estado</h5>
            <p className="text-xs text-text-secondary mt-1">
              Concluída, Cancelada, Em Disputa ou Pendente.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-text-primary mt-8">Exportar Dados</h3>
        <p className="text-text-secondary mt-2">
          Pode exportar o seu histórico de transações em formato <strong>CSV</strong> para
          controlo financeiro pessoal ou declaração fiscal. Aceda ao botão
          "Exportar" no canto superior direito da página de histórico.
        </p>
      </div>
    ),
  },
  {
    slug: 'suporte',
    title: 'Suporte e Contacto',
    icon: MessageSquare,
    content: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Suporte e Contacto
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          A nossa equipa de suporte está disponível para ajudá-lo em qualquer
          questão relacionada com a plataforma, transações ou a sua conta.
        </p>

        <h3 className="text-xl font-bold text-text-primary mt-8">Canais de Suporte</h3>
        <ul className="list-disc pl-6 space-y-3 text-text-secondary mt-2">
          <li>
            <strong className="text-text-primary">Chat na Plataforma:</strong>{' '}
            Abra um ticket diretamente no menu <strong>"Mensagens"</strong>.
            É o canal mais rápido.
          </li>
          <li>
            <strong className="text-text-primary">E-mail:</strong>{' '}
            <span className="text-primary">suporte@kwanzaconnect.ao</span> —
            respondemos em até 24 horas úteis.
          </li>
          <li>
            <strong className="text-text-primary">Centro de Ajuda:</strong>{' '}
            Consulte as perguntas frequentes na secção <strong>"Ajuda"</strong>
            dentro da plataforma.
          </li>
        </ul>

        <h3 className="text-xl font-bold text-text-primary mt-8">Reportar uma Disputa</h3>
        <div className="space-y-3 text-text-secondary mt-2">
          <p>
            Se uma transação P2P não correu como esperado, pode abrir uma disputa
            diretamente na página da ordem:
          </p>
          <p>1. Aceda ao <strong>Histórico de Transações</strong>.</p>
          <p>2. Clique na ordem em questão.</p>
          <p>3. Selecione <strong>"Abrir Disputa"</strong> e descreva o problema.</p>
          <p>4. A nossa equipa analisará o caso em até 48 horas e notificará ambas as partes.</p>
        </div>

        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mt-6">
          <h4 className="font-bold text-primary text-sm mb-1">Horário de Suporte</h4>
          <p className="text-sm text-text-secondary">
            Segunda a Sexta: 08h00 – 18h00 (WAT) <br />
            Sábado: 09h00 – 13h00 (WAT) <br />
            Domingo e Feriados: Apenas respostas urgentes por e-mail.
          </p>
        </div>
      </div>
    ),
  },
];
