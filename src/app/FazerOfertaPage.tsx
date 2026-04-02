import React from 'react';
import { motion } from 'framer-motion';

const FazerOfertaPage: React.FC = () => {
  const offers = [
    { id: 1, user: 'A. Silva', avatar: 'https://i.pravatar.cc/150?u=asilva', rating: '4.9 (231 trocas)', amount: '100.00 USD', rate: '850.50 AOA/USD', limits: '50 - 500 USD', type: 'USD' },
    { id: 2, user: 'B. Costa', avatar: 'https://i.pravatar.cc/150?u=bcosta', rating: '4.8 (105 trocas)', amount: '50.00 EUR', rate: '920.00 AOA/EUR', limits: '20 - 100 EUR', type: 'EUR' },
    { id: 3, user: 'C. Ferreira', avatar: 'https://i.pravatar.cc/150?u=cferreira', rating: '5.0 (88 trocas)', amount: '1.250.00 USD', rate: '851.20 AOA/USD', limits: '500 - 2000 USD', type: 'USD' },
  ];

  return (
    <div className="flex-1 flex flex-col gap-8 py-8 px-4 md:px-10 lg:px-20 xl:px-40 max-w-[1400px] mx-auto w-full pb-32 lg:pb-10 font-display">
      <div className="flex flex-wrap justify-between gap-4 items-center">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-gray-900 dark:text-white text-3xl md:text-5xl font-black leading-tight tracking-tighter">Mercado P2P</h1>
          <p className="text-gray-500 dark:text-[#92adc9] text-base font-medium">Negocie moedas diretamente com outros usuários de forma segura.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 h-12 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-primary/20 active:scale-95">
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Criar Nova Oferta
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Tabs and Search */}
          <div className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#192633] overflow-hidden shadow-xl">
            <div className="flex border-b border-gray-50 dark:border-white/5 bg-gray-50 dark:bg-[#101922]/50">
              <button className="flex-1 py-5 text-xs font-black uppercase tracking-widest text-primary border-b-4 border-primary">Comprar</button>
              <button className="flex-1 py-5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">Vender</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input 
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-[#101922] border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="Buscar por moeda ou usuário"
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {['Moeda: Todas', 'Valor', 'Reputação'].map((filter, i) => (
                  <button key={i} className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-gray-50 dark:bg-[#101922] px-4 border border-transparent hover:border-primary/30 transition-all whitespace-nowrap">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">{filter}</span>
                    <span className="material-symbols-outlined text-sm text-gray-400">keyboard_arrow_down</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Offers List */}
          <div className="space-y-4">
            {offers.map((offer, idx) => (
              <motion.div 
                key={offer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#192633] shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
              >
                <div className="flex flex-col gap-6 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-full border-4 border-gray-50 dark:border-[#101922] shadow-sm bg-cover bg-center group-hover:scale-105 transition-transform" style={{ backgroundImage: `url(${offer.avatar})` }} />
                    <div className="flex flex-col">
                      <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">{offer.user}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-yellow-500 !text-sm">star</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{offer.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">Valor</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">{offer.amount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">Taxa</p>
                      <p className="text-sm font-black text-primary">{offer.rate}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">Limites</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">{offer.limits}</p>
                    </div>
                  </div>
                </div>
                <button className="w-full sm:w-auto px-8 h-12 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group-hover:px-10">
                  Comprar {offer.type}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Creation Form */}
        <div className="xl:col-span-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-8 rounded-[2rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-[#192633] p-8 shadow-2xl sticky top-24"
          >
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">Publicar Oferta</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-70">Defina suas próprias condições</p>
            </div>
            
            <form className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valor Oferecido</label>
                <div className="flex gap-2">
                  <input className="flex-1 h-14 px-6 rounded-2xl bg-gray-50 dark:bg-[#101922] border-none text-xl font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/30 transition-all outline-none" placeholder="0.00" type="number" />
                  <select className="px-6 h-14 bg-gray-100 dark:bg-[#233648] rounded-2xl text-xs font-black uppercase tracking-widest border-none outline-none cursor-pointer hover:bg-gray-200 transition-colors">
                    <option>USD</option>
                    <option>EUR</option>
                    <option>AOA</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center group">
                 <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:rotate-180 transition-transform duration-700">
                    <span className="material-symbols-outlined text-xl">sync</span>
                 </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valor Desejado</label>
                <div className="flex gap-2">
                  <input className="flex-1 h-14 px-6 rounded-2xl bg-gray-50 dark:bg-[#101922] border-none text-xl font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/30 transition-all outline-none" placeholder="0.00" type="number" />
                  <select className="px-6 h-14 bg-gray-100 dark:bg-[#233648] rounded-2xl text-xs font-black uppercase tracking-widest border-none outline-none cursor-pointer hover:bg-gray-200 transition-colors">
                    <option>AOA</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Taxa Calculada</span>
                <p className="text-sm font-black text-gray-700 dark:text-gray-300">1 USD = 850.50 AOA</p>
              </div>

              <button className="w-full h-16 bg-primary hover:bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/30 active:scale-95">
                Publicar Oferta Agora
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FazerOfertaPage;
