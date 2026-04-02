import React from 'react';
import { motion } from 'framer-motion';

const ReceberOfertaPage: React.FC = () => {
  const offers = [
    { 
      id: 1, 
      user: 'A. Silva', 
      avatar: 'https://i.pravatar.cc/150?u=asilva', 
      rating: '4.9 (231 trocas)', 
      trade: '100.00 USD → 85,050.00 AOA', 
      rate: '850.50 AOA/USD', 
      badge: 'Melhor Taxa',
      badgeColor: 'primary'
    },
    { 
      id: 2, 
      user: 'B. Costa', 
      avatar: 'https://i.pravatar.cc/150?u=bcosta', 
      rating: '4.8 (105 trocas)', 
      trade: '50.00 EUR → 46,000.00 AOA', 
      rate: '920.00 AOA/EUR'
    },
    { 
      id: 3, 
      user: 'C. Ferreira', 
      avatar: 'https://i.pravatar.cc/150?u=cferreira', 
      rating: '5.0 (88 trocas)', 
      trade: '1,250.00 USD → 1,064,000.00 AOA', 
      rate: '851.20 AOA/USD',
      badge: 'Alta Reputação',
      badgeColor: 'emerald'
    },
  ];

  return (
    <div className="flex-1 flex flex-col gap-8 py-8 px-4 md:px-10 lg:px-20 xl:px-40 max-w-[1400px] mx-auto w-full pb-32 lg:pb-10 font-display">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Creation Sidebar */}
        <div className="xl:col-span-1 order-2 xl:order-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-[#192633] p-8 shadow-2xl sticky top-24"
          >
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">Criar Nova Oferta</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-70">Publique sua oferta no mercado</p>
            </div>

            <form className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Eu quero trocar</label>
                <div className="flex gap-2">
                  <select className="w-1/3 h-14 bg-gray-100 dark:bg-[#233648] rounded-2xl text-xs font-black uppercase tracking-widest border-none outline-none">
                    <option>USD</option>
                    <option>AOA</option>
                  </select>
                  <input className="w-2/3 h-14 px-6 rounded-2xl bg-gray-50 dark:bg-[#101922] border-none text-lg font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/30 transition-all outline-none" placeholder="Valor" type="number" />
                </div>
              </div>

              <div className="flex justify-center">
                 <span className="material-symbols-outlined text-primary text-2xl animate-pulse">sync_alt</span>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Para receber</label>
                <div className="flex gap-2">
                  <select className="w-1/3 h-14 bg-gray-100 dark:bg-[#233648] rounded-2xl text-xs font-black uppercase tracking-widest border-none outline-none">
                    <option>AOA</option>
                    <option>USD</option>
                  </select>
                  <input className="w-2/3 h-14 px-6 rounded-2xl bg-gray-50 dark:bg-[#101922] border-none text-lg font-black text-gray-900 dark:text-white border-none outline-none" placeholder="Valor" readOnly type="number" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Taxa Proposta</label>
                <div className="relative">
                  <input className="w-full h-14 px-6 rounded-2xl bg-gray-50 dark:bg-[#101922] border-none text-sm font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/30 outline-none" defaultValue="1 USD = 851.35 AOA" />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary text-xl">auto_awesome</span>
                </div>
                <p className="text-[9px] font-black text-primary uppercase tracking-widest text-center">Taxa sugerida por nossa IA para conversão rápida</p>
              </div>

              <button className="w-full h-14 bg-primary hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/30 active:scale-95">
                Publicar Agora
              </button>
            </form>
          </motion.div>
        </div>

        {/* Market List */}
        <div className="xl:col-span-2 order-1 xl:order-2 flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">Ofertas Disponíveis</h1>
            <p className="text-gray-500 dark:text-[#92adc9] text-base font-medium">Encontre as melhores taxas para trocar seu saldo.</p>
          </div>

          <div className="rounded-[2rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-[#192633] p-2 shadow-xl">
             <div className="p-4">
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                  <input 
                    className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-[#101922] border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="Filtrar por moeda ou usuário..."
                  />
                </div>
             </div>
             <div className="flex gap-3 px-4 pb-4">
                <button className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Recomendado</span>
                </button>
                <button className="flex h-10 items-center justify-center gap-2 rounded-xl bg-gray-50 dark:bg-[#101922] px-4">
                  <span className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">Mais Recentes</span>
                </button>
             </div>
          </div>

          <div className="space-y-4">
            {offers.map((offer, idx) => (
              <motion.div 
                key={offer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] border transition-all hover:shadow-2xl cursor-pointer group ${
                  offer.badge ? 'border-primary/30 bg-primary/5 dark:bg-primary/20' : 'border-gray-100 dark:border-white/5 bg-white dark:bg-[#192633]'
                }`}
              >
                {offer.badge && (
                  <div className={`absolute -top-3 left-8 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${
                    offer.badgeColor === 'emerald' ? 'bg-emerald-500 text-white' : 'bg-primary text-white'
                  }`}>
                    {offer.badge}
                  </div>
                )}
                
                <div className="flex flex-col gap-6 flex-1 w-full">
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-full border-4 border-white dark:border-[#101922] shadow-xl bg-cover bg-center" style={{ backgroundImage: `url(${offer.avatar})` }} />
                    <div>
                      <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">{offer.user}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-yellow-500 !text-sm">star_rate</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{offer.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">Negociação</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white">{offer.trade}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">Taxa Final</p>
                        <p className="text-sm font-black text-primary">{offer.rate}</p>
                     </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                   <button className="flex-1 sm:flex-none size-14 rounded-2xl bg-gray-100 dark:bg-[#233648] flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                      <span className="material-symbols-outlined">chat_bubble</span>
                   </button>
                   <button className="flex-1 sm:flex-none h-14 px-10 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                      Aceitar Oferta
                   </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-10 border-4 border-dashed border-gray-100 dark:border-white/5 rounded-[3rem] text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nenhuma outra oferta encontrada para seus critérios</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceberOfertaPage;
