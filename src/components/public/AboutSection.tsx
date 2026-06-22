import { motion } from 'framer-motion';
import {
  Target,
  Zap,
  Building,
  UserCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const AboutSection = () => {
  return (
    <section
      id="sobre"
      className="py-24 bg-surface-elevated/20 border-y border-border-subtle relative overflow-hidden"
    >
      {/* Decorative blurred background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Parte 1: Quem Somos */}
        <div className="max-w-3xl mx-auto text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-border-subtle mb-6">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-text-secondary tracking-widest uppercase">
              Quem Somos
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6 tracking-tight">
            A ponte segura para a sua{' '}
            <span className="text-primary text-glow-gold">liberdade financeira.</span>
          </h2>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
            A KwanzaConnect nasceu para revolucionar a forma como os angolanos
            negociam moedas e criptoativos. O nosso sistema avançado de Escrow
            garante que cada transação P2P seja rápida, justa e completamente
            segura, eliminando os riscos de fraude do mercado tradicional.
          </p>
        </div>

        {/* Parte 2: Solução para Clientes e Empresas */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
              Uma solução para todos
            </h3>
            <p className="text-text-secondary mt-3">
              Seja para comprar a sua primeira criptomoeda ou para negociar
              grandes volumes, temos a plataforma certa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Compradores */}
            <div className="glass-card p-8 md:p-10 rounded-3xl border border-border-subtle relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full blur-2xl transition-all group-hover:bg-primary/20" />
              <div className="w-14 h-14 rounded-2xl bg-surface border border-border-subtle flex items-center justify-center mb-6">
                <UserCheck className="w-7 h-7 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-text-primary mb-4">
                Para Compradores e Iniciantes
              </h4>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Dê o primeiro passo no mundo das criptomoedas sem complicações.
                A nossa interface simplificada permite-lhe encontrar as melhores
                ofertas e pagar usando o seu banco local de forma intuitiva.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-text shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">
                    Taxas transparentes e altamente competitivas.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-text shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">
                    Proteção total com o sistema de Escrow.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-text shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">
                    Suporte dedicado e guias para iniciantes.
                  </span>
                </li>
              </ul>
            </div>

            {/* Vendedores */}
            <div className="glass-card p-8 md:p-10 rounded-3xl border border-border-subtle relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-surface border border-border-subtle flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-text-primary mb-4">
                Para Vendedores e P2P Traders
              </h4>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Maximize os seus lucros com ferramentas avançadas de gestão de
                anúncios e liquidez. O nosso painel de controlo permite gerir
                múltiplas ordens em simultâneo com total segurança e rapidez.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">
                    Gestão avançada de ordens e anúncios em tempo real.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">
                    Notificações instantâneas de novos pedidos de compra.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">
                    Acesso à maior base de clientes qualificados em Angola.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Parte 3: Processo de Aquisição */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
              Como funciona o intercâmbio?
            </h3>
            <p className="text-text-secondary mt-3">
              Três passos simples para a sua primeira transação segura.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border-subtle" />

            {/* Step 1 */}
            <div className="relative text-center z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-surface border-[4px] border-background flex items-center justify-center mb-6 shadow-xl">
                <span className="text-3xl font-black text-primary">1</span>
              </div>
              <h4 className="text-lg font-bold text-text-primary mb-2">
                Registo e Verificação
              </h4>
              <p className="text-sm text-text-secondary">
                Crie a sua conta e complete o processo de verificação KYC para
                garantir um ambiente seguro e de confiança para toda a comunidade.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-surface border-[4px] border-background flex items-center justify-center mb-6 shadow-xl">
                <span className="text-3xl font-black text-primary">2</span>
              </div>
              <h4 className="text-lg font-bold text-text-primary mb-2">
                Encontre uma Oferta
              </h4>
              <p className="text-sm text-text-secondary">
                Navegue pelo nosso mercado P2P e escolha a oferta com a melhor
                taxa de câmbio e que suporte o seu método de pagamento preferido.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary border-[4px] border-background flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(253,185,19,0.3)]">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-lg font-bold text-text-primary mb-2">
                Troca Segura (Escrow)
              </h4>
              <p className="text-sm text-text-secondary">
                O vendedor bloqueia os fundos no nosso cofre inteligente. Assim
                que o pagamento for confirmado mutuamente, os ativos são libertados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
