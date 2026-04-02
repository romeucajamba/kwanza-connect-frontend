import React from 'react';
import { motion } from 'framer-motion';

const HelpCenterPage: React.FC = () => {
  const categories = [
    { icon: 'verified_user', title: 'Segurança e KYC', desc: 'Proteja sua conta e valide seus dados para operar com limites maiores.' },
    { icon: 'handshake', title: 'Negociar P2P', desc: 'Passo a passo detalhado para comprar e vender moedas com segurança.' },
    { icon: 'account_balance', title: 'Pagamentos', desc: 'Prazos, taxas e métodos de envio via IBAN e bancos locais angolanos.' },
    { icon: 'gavel', title: 'Disputas', desc: 'Como funciona a mediação imparcial em caso de divergências na troca.' },
  ];

  const faqs = [
    { q: 'Como funciona o sistema de custódia (Escrow)?', a: 'O sistema de Escrow bloqueia temporariamente os ativos do vendedor assim que uma ordem é aberta. Os fundos só são liberados para o comprador após o vendedor confirmar o recebimento do pagamento em sua conta bancária. Isso garante 100% de segurança para ambas as partes.' },
    { q: 'Quais bancos angolanos são aceitos?', a: 'Aceitamos transferências de todos os principais bancos em Angola, incluindo BAI, BFA, BIC, BCI e Standard Bank. As transações devem ser feitas via IBAN para facilitar a confirmação dos comprovativos.' },
    { q: 'Por que minha verificação de identidade (KYC) está pendente?', a: 'As verificações levam normalmente entre 15 minutos a 2 horas durante o horário comercial. Certifique-se de que as fotos do seu documento (BI ou Passaporte) estão legíveis e que a selfie corresponde ao documento enviado.' },
    { q: 'O que fazer se o vendedor não liberar os ativos?', a: 'Se você realizou o pagamento e enviou o comprovativo, aguarde 15 minutos. Se não houver resposta, clique no botão "Abrir Disputa". Nossa equipe de suporte entrará em contato em menos de 10 minutos para mediar o caso.' },
  ];

  return (
    <div className="flex-1 flex flex-col gap-8 py-8 px-4 md:px-10 lg:px-20 xl:px-40 max-w-[1400px] mx-auto w-full pb-32 lg:pb-10 font-display">
      <div className="flex flex-wrap gap-2 py-4">
        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Home</span>
        <span className="text-gray-300 text-xs font-bold">/</span>
        <span className="text-primary text-xs font-black uppercase tracking-widest">Central de Ajuda</span>
      </div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-blue-800 p-12 md:p-20 text-center text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="relative z-10 flex flex-col items-center gap-8 max-w-3xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter">Como podemos ajudar?</h1>
            <p className="text-white/80 text-base md:text-xl font-medium">Encontre respostas rápidas sobre segurança e negociação em Kwanza (AOA).</p>
          </div>
          <div className="w-full max-w-xl relative group">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl group-focus-within:text-primary transition-colors">search</span>
            <input 
              className="w-full h-16 md:h-20 pl-16 pr-32 rounded-2xl bg-white text-gray-900 placeholder:text-gray-400 font-bold text-lg border-none shadow-xl focus:ring-4 focus:ring-white/20 transition-all outline-none"
              placeholder="Pesquise sua dúvida..."
            />
            <button className="absolute right-3 top-3 bottom-3 px-6 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-primary/20">
              Buscar
            </button>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <div className="space-y-8 mt-8">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Categorias Principais</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -8 }}
              className="flex flex-col gap-6 p-8 bg-white dark:bg-[#192633] rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all group cursor-pointer"
            >
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <span className="material-symbols-outlined text-3xl font-bold">{cat.icon}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight">{cat.title}</h3>
                <p className="text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-widest opacity-80">{cat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto w-full space-y-10 mt-16">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight text-center">Dúvidas Frequentes (FAQ)</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.details 
              key={idx}
              className="group bg-white dark:bg-[#192633] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none appearance-none outline-none">
                <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">{faq.q}</span>
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform duration-300">expand_more</span>
              </summary>
              <div className="px-6 pb-6 pt-2 text-sm font-medium text-gray-500 dark:text-[#92adc9] leading-relaxed border-t border-gray-50 dark:border-white/5">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </div>
      </div>

      {/* Support CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary/5 dark:bg-primary/10 rounded-[3rem] p-12 md:p-20 text-center border-2 border-primary/10 mt-20 relative overflow-hidden"
      >
        <div className="absolute -top-10 -left-10 size-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 size-40 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-10">
          <div className="space-y-4">
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Ainda precisa de ajuda?</h3>
            <p className="text-gray-500 dark:text-[#92adc9] text-base font-bold uppercase tracking-widest leading-loose">Nossa equipe de suporte técnico está disponível 24/7 para ajudar você.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-primary/30 active:scale-95 group">
              <span className="material-symbols-outlined group-hover:animate-bounce">chat</span>
               Chat ao Vivo
            </button>
            <button className="flex items-center gap-3 px-10 py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-white/5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95">
              <span className="material-symbols-outlined">mail</span>
               Enviar E-mail
            </button>
          </div>
        </div>
      </motion.div>

      <footer className="mt-20 py-10 border-t border-gray-100 dark:border-white/5 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          © 2024 KwanzaConnect Support. Segurança e Transparência em Angola.
        </p>
      </footer>
    </div>
  );
};

export default HelpCenterPage;
