import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  LifeBuoy, 
  Phone, 
  Mail, 
  ExternalLink,
  MessageSquare,
  FileText
} from 'lucide-react';

const HelpCenterPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const faqs = [
    { q: 'Como funciona o Escrow P2P?', a: 'O KwanzaConnect bloqueia os ativos do vendedor assim que houver interesse. O ativo só é libertado quando o comprador confirmar o envio do comprovativo e o vendedor validar o recebimento.' },
    { q: 'Quais as taxas de carregamento?', a: 'O carregamento de saldo via Multicaixa é gratuito. As taxas aplicam-se apenas no momento da negociação P2P, sendo uma das mais baixas do mercado angolano.' },
    { q: 'É seguro enviar BI pela plataforma?', a: 'Sim. Utilizamos encriptação de ponta-a-ponta e seguimos os padrões RGPD para garantir que seus dados sensíveis nunca sejam expostos.' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* Search Header Compacto */}
      <div className="bg-slate-900 rounded-xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg flex flex-col items-center text-center gap-4">
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full opacity-50 pointer-events-none" />
         <div className="relative z-10 space-y-1">
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight leading-none">Centro de <span className="text-primary italic">Suporte</span></h1>
            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest max-w-xs mx-auto">Como podemos ajudar-te a transacionar hoje?</p>
         </div>
         <div className="relative w-full max-w-lg group z-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/30 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Digite sua dúvida ou problema..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-white/20 text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex flex-wrap justify-center gap-4 relative z-10 opacity-60">
            <div className="flex items-center gap-2">
               <ShieldCheck className="size-3.5 text-primary" />
               <span className="text-[8px] font-bold uppercase tracking-widest text-white/60">Garantia Kwanza</span>
            </div>
            <div className="flex items-center gap-2">
               <Zap className="size-3.5 text-primary" />
               <span className="text-[8px] font-bold uppercase tracking-widest text-white/60">24/7 Suporte Directo</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
         
         <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Quick Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {[
                 { icon: LifeBuoy, label: 'Primeiro Passo', desc: 'Guia de início.' },
                 { icon: ShieldCheck, label: 'Segurança', desc: 'Sua conta PRO.' },
                 { icon: FileText, label: 'Documentação', desc: 'Termos e API.' },
               ].map((cat, i) => (
                  <button key={i} className="bg-white dark:bg-[#192633] p-4 rounded-lg border border-slate-100 dark:border-white/5 shadow-sm text-center hover:shadow-md hover:translate-y-[-2px] transition-all group flex flex-col items-center gap-2">
                     <div className="size-8 rounded-lg bg-slate-50 dark:bg-[#111922] shadow-inner flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <cat.icon className="size-4" />
                     </div>
                     <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">{cat.label}</h4>
                     <p className="text-[8px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">{cat.desc}</p>
                  </button>
               ))}
            </div>

            {/* FAQs */}
            <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md p-5 md:p-6 flex flex-col gap-6">
               <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-lg">
                     <HelpCircle className="size-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Dúvidas Frequentes</h3>
               </div>
               <div className="space-y-3">
                  {faqs.map((faq, i) => (
                     <div key={i} className="p-4 bg-slate-50 dark:bg-[#111922] rounded-lg border border-transparent hover:border-primary/5 transition-all group cursor-default">
                        <div className="flex justify-between items-center mb-2">
                           <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">{faq.q}</p>
                           <ChevronRight className="size-3.5 text-slate-300 group-hover:text-primary transition-transform group-hover:rotate-90" />
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tight opacity-70">{faq.a}</p>
                     </div>
                  ))}
               </div>
               <button className="w-full h-11 border-2 border-slate-50 dark:border-white/5 rounded-lg font-bold uppercase text-[9px] tracking-widest text-slate-400 hover:text-primary transition-all">Ver Toda Documentação</button>
            </div>
         </div>

         {/* Sidebar Connect */}
         <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md p-6 flex flex-col gap-6">
               <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Canais Directos</h3>
               <div className="space-y-4">
                  {[
                    { icon: MessageSquare, label: 'Chat Online 24/7', desc: 'Até 5m' },
                    { icon: Mail, label: 'Suporte Email', desc: 'Até 24h' },
                    { icon: Phone, label: 'Linha Telefónica', desc: 'Exclusivo VIP' }
                  ].map((chan, i) => (
                     <button key={i} className="w-full flex items-center gap-3 group p-1 transition-all">
                        <div className="size-9 rounded-lg bg-slate-50 dark:bg-[#111922] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                           <chan.icon className="size-4 text-primary" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                           <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight truncate">{chan.label}</p>
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60">Espera: {chan.desc}</p>
                        </div>
                        <ChevronRight className="size-3 text-slate-200 group-hover:translate-x-1 transition-transform" />
                     </button>
                  ))}
               </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/5 text-center flex flex-col items-center gap-4">
               <div className="size-11 rounded-lg bg-white dark:bg-[#111922] shadow-md flex items-center justify-center text-primary">
                  <ExternalLink className="size-5" />
               </div>
               <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-widest shadow-sm opacity-80">Siga nossas actualizações técnicas no canal de status.</p>
               <button className="w-full py-3 bg-primary text-white rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform">Aceder Status</button>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default HelpCenterPage;
