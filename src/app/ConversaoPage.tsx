import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ConversaoPage: React.FC = () => {
  const [amount, setAmount] = useState<number>(1000);
  const rate = 840.45;

  const candles = [
    { type: 'up', h1: 12, h2: 16, h3: 8 },
    { type: 'up', h1: 4, h2: 12, h3: 6 },
    { type: 'down', h1: 10, h2: 20, h3: 10 },
    { type: 'up', h1: 6, h2: 10, h3: 4 },
    { type: 'up', h1: 8, h2: 24, h3: 12 },
    { type: 'down', h1: 10, h2: 8, h3: 14 },
    { type: 'up', h1: 16, h2: 32, h3: 10 },
    { type: 'down', h1: 4, h2: 14, h3: 8 },
    { type: 'up', h1: 10, h2: 18, h3: 12 },
    { type: 'down', h1: 8, h2: 22, h3: 6 },
    { type: 'up', h1: 4, h2: 12, h3: 8 },
  ];

  return (
    <div className="flex-1 flex flex-col gap-8 py-8 px-4 md:px-10 lg:px-20 xl:px-40 max-w-[1400px] mx-auto w-full pb-32 lg:pb-10 font-display">
      <div className="flex flex-wrap justify-between items-end gap-3 mb-2">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-zinc-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Monitor de Mercado</h1>
          <p className="text-zinc-500 dark:text-[#92adc9] text-sm font-medium">Análise profissional de câmbio para negociações P2P seguras.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest leading-none">Mercado Aberto</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9 flex flex-col gap-6">
          {/* Candlestick Chart Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col rounded-2xl shadow-xl bg-white dark:bg-[#192633] border border-zinc-200 dark:border-[#233648] overflow-hidden"
          >
            <div className="p-4 border-b border-zinc-200 dark:border-[#233648] flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-black border-2 border-white dark:border-[#192633] shadow-sm">USD</div>
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-black border-2 border-white dark:border-[#192633] shadow-sm">AOA</div>
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight">USD/AOA</h2>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-zinc-500 font-bold">Spot: 840.45</span>
                      <span className="text-[10px] text-emerald-500 font-black">+1.2%</span>
                    </div>
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-zinc-200 dark:bg-[#233648] hidden sm:block"></div>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="flex bg-zinc-100 dark:bg-[#101922] p-1 rounded-xl">
                    {['1h', '4h', '1D', '1W'].map((t) => (
                      <button key={t} className={`px-4 py-1.5 text-[11px] font-black rounded-lg transition-all ${t === '1h' ? 'bg-white dark:bg-[#192633] shadow-sm text-primary' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-white'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg text-primary text-[10px] font-black hover:bg-primary hover:text-white transition-all">
                  <span className="material-symbols-outlined text-sm">show_chart</span>
                  MA(20), MA(50)
                </button>
              </div>
            </div>

            <div className="relative h-[400px] bg-white dark:bg-[#101922] p-4 flex items-end justify-between overflow-hidden">
               {/* Grid Simulation */}
               <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #233648 1px, transparent 1px), linear-gradient(to bottom, #233648 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
               
               <div className="flex items-end justify-around w-full h-[80%] pb-10 px-4 space-x-1 relative z-10 transition-all">
                  {candles.map((c, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: '100%' }}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col items-center flex-1 max-w-[14px] group cursor-pointer"
                    >
                      <div className={`w-[1px] h-${c.h1} ${c.type === 'up' ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ height: `${c.h1 * 4}px` }} />
                      <div className={`w-full h-${c.h2} ${c.type === 'up' ? 'bg-emerald-500' : 'bg-rose-500'} rounded-sm shadow-sm group-hover:brightness-125 transition-all`} style={{ height: `${c.h2 * 4}px` }} />
                      <div className={`w-[1px] h-${c.h3} ${c.type === 'up' ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ height: `${c.h3 * 4}px` }} />
                    </motion.div>
                  ))}
               </div>

               {/* Trend Lines Simulation */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
                 <motion.path 
                   initial={{ pathLength: 0 }}
                   animate={{ pathLength: 1 }}
                   transition={{ duration: 2 }}
                   d="M0 320 Q 100 280, 200 310 T 400 260 T 600 290 T 800 240 T 1000 270" 
                   fill="none" stroke="#137fec" strokeWidth="2" strokeOpacity="0.5"
                 />
                 <motion.path 
                   initial={{ pathLength: 0 }}
                   animate={{ pathLength: 1 }}
                   transition={{ duration: 2.5 }}
                   d="M0 340 Q 150 300, 300 330 T 600 280 T 900 310" 
                   fill="none" stroke="#fb923c" strokeWidth="2" strokeOpacity="0.3"
                 />
               </svg>

               {/* Y-Axis Labels */}
               <div className="absolute right-0 top-0 bottom-0 w-14 border-l border-zinc-200 dark:border-[#233648] bg-white/50 dark:bg-[#101922]/50 backdrop-blur-sm flex flex-col justify-between py-12 items-center text-[10px] font-black text-zinc-500">
                  <span>860.00</span>
                  <span>850.00</span>
                  <span className="text-emerald-500 bg-emerald-500/10 px-1 rounded ring-1 ring-emerald-500/20">840.45</span>
                  <span>830.00</span>
                  <span>820.00</span>
               </div>
            </div>

            <div className="bg-zinc-50 dark:bg-[#101922] p-4 flex justify-between border-t border-zinc-200 dark:border-[#233648] text-[10px] font-black uppercase text-zinc-500 tracking-widest">
              <span>Volume 24h: 1.2M <span className="text-primary font-black">USD</span></span>
              <span>Refesh em <span className="text-primary">15s</span></span>
            </div>
          </motion.div>

          {/* Calculator Card */}
          <div className="rounded-2xl shadow-xl bg-white dark:bg-[#192633] border border-zinc-200 dark:border-[#233648] p-8">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">calculate</span>
              Simulador de Câmbio P2P
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-6">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block text-center md:text-left">Valor a Trocar</label>
                  <div className="flex items-center group">
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="flex-1 bg-zinc-100 dark:bg-[#101922] border-2 border-transparent rounded-l-2xl h-16 px-6 text-2xl font-black focus:border-primary focus:bg-white dark:focus:bg-[#15202b] outline-none transition-all shadow-inner"
                    />
                    <div className="bg-zinc-200 dark:bg-[#233648] border-y-2 border-r-2 border-transparent rounded-r-2xl h-16 px-6 flex items-center font-black text-sm uppercase tracking-wider shadow-sm">
                      USD
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center -my-3">
                  <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:rotate-180 transition-transform duration-500 active:scale-90">
                    <span className="material-symbols-outlined text-xl">swap_vert</span>
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block text-center md:text-left">Desejo Receber (Est.)</label>
                  <div className="flex items-center">
                    <div className="flex-1 bg-zinc-100 dark:bg-[#101922] rounded-l-2xl h-16 px-6 flex items-center text-2xl font-black text-primary shadow-inner">
                      {(amount * rate).toLocaleString('pt-AO')}
                    </div>
                    <div className="bg-zinc-200 dark:bg-[#233648] rounded-r-2xl h-16 px-6 flex items-center font-black text-sm uppercase tracking-wider shadow-sm">
                      AOA
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between bg-primary/5 rounded-2xl p-8 border-2 border-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Taxa Média:</span>
                    <span className="font-black text-sm">1 USD = 840.45 AOA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Total Estimado:</span>
                    <span className="text-3xl font-black text-primary">{(amount * rate).toLocaleString('pt-AO')} AOA</span>
                  </div>
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 shadow-sm">
                    <span className="material-symbols-outlined text-amber-500 text-xl">info</span>
                    <p className="text-[10px] text-amber-800 dark:text-amber-400 leading-normal font-bold">
                      <strong>AVISO:</strong> Os valores finais de câmbio são negociados diretamente no Mural P2P. Esta ferramenta serve apenas como referência oficial.
                    </p>
                  </div>
                </div>
                <button className="w-full mt-8 bg-primary hover:bg-blue-600 text-white font-black h-14 rounded-2xl transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 group/btn hover:scale-[1.02] active:scale-95">
                  Acessar Mural P2P
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="rounded-2xl shadow-xl bg-white dark:bg-[#192633] border border-zinc-200 dark:border-[#233648] overflow-hidden"
          >
            <div className="p-4 border-b border-zinc-200 dark:border-[#233648] bg-zinc-50 dark:bg-[#101922]/50">
              <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500">psychology</span>
                Sentimento
              </h3>
            </div>
            <div className="p-6">
              <div className="flex justify-between text-[10px] font-black mb-3 tracking-widest">
                <span className="text-emerald-500">ALTA (68%)</span>
                <span className="text-rose-500">BAIXA (32%)</span>
              </div>
              <div className="w-full h-4 bg-zinc-100 dark:bg-[#101922] rounded-full overflow-hidden flex shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1 }} className="h-full bg-emerald-500" />
                <motion.div initial={{ width: 0 }} animate={{ width: '32%' }} transition={{ duration: 1 }} className="h-full bg-rose-500" />
              </div>
              <p className="mt-4 text-[10px] text-zinc-500 font-bold leading-relaxed opacity-70">
                Baseado em ordens nas últimas 4h no Mural P2P.
              </p>
            </div>
          </motion.div>

          <div className="rounded-2xl shadow-xl bg-white dark:bg-[#192633] border border-zinc-200 dark:border-[#233648] overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-[#233648] bg-zinc-50 dark:bg-[#101922]/50">
              <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">trending_up</span>
                Variação (24h)
              </h3>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-[#233648]">
              {[
                { label: 'EUR/AOA', val: '+1.45%', color: 'emerald' },
                { label: 'USD/AOA', val: '+1.20%', color: 'emerald' },
                { label: 'BRL/AOA', val: '-0.85%', color: 'rose' },
                { label: 'GBP/AOA', val: '+0.32%', color: 'emerald' },
              ].map((v, i) => (
                <div key={i} className="p-4 flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-[#101922] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-zinc-100 dark:bg-[#101922] flex items-center justify-center font-black text-[10px] shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                      {v.label.split('/')[0]}
                    </div>
                    <span className="text-xs font-black tracking-tight">{v.label}</span>
                  </div>
                  <span className={`text-[10px] font-black ${v.color === 'emerald' ? 'text-emerald-500' : 'text-rose-500'}`}>{v.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/10 relative group cursor-pointer shadow-indigo-500/20 shadow-lg">
            <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:scale-125 transition-transform">
               <span className="material-symbols-outlined text-primary">stars</span>
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-2 text-primary">Dica de Mercado</h4>
            <p className="text-[10px] text-zinc-600 dark:text-zinc-300 leading-relaxed font-bold">
              USD/AOA está em região de forte resistência. Monitore as ofertas de venda no mural para encontrar janelas de oportunidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversaoPage;
