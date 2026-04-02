import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CambioMercadoPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { pair: 'USD / AOA', price: '825.50', change: '+0.45%', trend: 'up', vol: '12.5M AOA', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR-t2Jj-rG0Fs-2JsBwcT43kloLZGQBmgQuSohZjBT1Cy0-acd61zjubaMaPJ2dH5nC-MYqmcvw1AnzxpDNe2vKMT-xEfVHiQxxjcYmGIgVh81yZEbR0yt4Lb-fXsputGRP3w7q5F41HBhxzUAy9smpfkT3RzuxVenfuXRQOKLr-Vd181feTiCLuq5Dm_cTTZjqDjHop26X5ZgxHCha0NKb2xJzCjFTgMIJNk1VrooATIKVdGNJIdlaTPxMOFQLyTjIGz98_NJuDA' },
    { pair: 'EUR / AOA', price: '890.20', change: '+0.12%', trend: 'up', vol: '8.2M AOA', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoEei1fZYCi09eQhemVE8fRBuCFSmbFtz49JxQidsaKxz1EVi5N5-HwIO0TMn537t_bAmkRc22fzMklZn-Qkbt0bW7_2YtKTCvSJIEuITg4eQK8hZAKpuRuQyZYq77Ilr8uv1FV5dliFoAGavWCRl3phDpMdtoZXKWJFVP2ZAWf79Q2QqG4-YmD_pNDRw3K291ASF1V72gOgE5f0aGGwOLi17DWdNQ5M8PsUxsOipMl2_nyvF_E3_mJBLWH2v9v13KtNxOFgablBs' },
    { pair: 'BRL / AOA', price: '165.30', change: '-0.05%', trend: 'down', vol: '2.1M AOA', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD34a4B4ROSIwqMzS3n_81pnXeeQNBNR6NVGOZWVcdHDbJBnvnjvalDEQYn2cXyRFv__Z8KgUq3l50Sn6vgag1uv9VRxThNc93EEIR9YYVcSYrxv2rCUqA-5GtHiEy9POpHnf2fZhFiRPoW34svyiFAdcqq-HVNzH5LnUhjpfkiS_UPcB_JD1ShHPVSgNYJrQmzvaD5Rvh3LbTt6mvDt9uUjMw8MgJoHu2RyEVBPc2eCunI3vL7jJXOuRr6_z3bkZ0d8n6f_b-0J7o' },
    { pair: 'CNY / AOA', price: '113.80', change: '0.00%', trend: 'flat', vol: '15.3M AOA', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVfaMK6IT-ouAtNBKfA9063jBCekJFnJlw9QNjfTiYoVpzuSSAoouV7ElSkqw_zIGcjtamWb8e4C7gvzr4_MF3KgE3EOPv3shisDjZTHLzXxOsY28bSzr2Wmn6KXxSZ9NdoT9vgB-VomW-yEZ46rccJvgxBVD9UbrqMAM6NKnpU5UFCTuNdG1_uTewDdFRVzSv_tUlkcKzbHJLFqTflKaz099EIqs_BF4jZbgIW5Mt6NKYSbAcmFw_H3MjhBP45lM5vhU93wtlkww' },
  ];

  const currencies = [
    { code: 'USD', name: 'Dólar Americano', buy: '820.00', sell: '835.50', var: '+0.5%', trend: 'up', color: 'emerald', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYInKosskpXNkjxZI4f-Q4ofyAcuJxts6lOA66TASJRrWAcK3N7URfyEBrga5xB76Yo90ZY3XIzPOO3ybIkV1PtlIGr7LGt6kANkBy4NPrc4uqDqM2_cUHpTKC-Bnx26GukE4zD8JecOkcH-kN-80X6GU0VvmISJ2Ajvm8_hsk7f5X9yC3-Zs5ETaztE0PJimJFjfcH3lz0hR2O8WYJ69uzJjiHL-TPTzyq_P-jgDzbFOoQ8Ga-2C05FD8VzCcyu1RbMB4l5plNLw' },
    { code: 'EUR', name: 'Euro', buy: '885.10', sell: '902.40', var: '+0.2%', trend: 'up', color: 'emerald', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc6rqnP1ChcJh9_ybj8tLzPj4rR8cCDblew02XpgwLiYD5NIiovggm1mt000mWigjlcVeswBM94sKgIIeVhGkqBatZjm0ZfCmhIjOkuaxgktLFIfmTh2ATEL60pyKthIKjhP90cW2r7fiBp76S9TOs1zTAmfRNL90iofjvQodMny4cIXU8WemhEbTEh_VykgVcG2xK2UBeBo4I-_Wx0gZ--Fa8GdHke0Bs_QmX6nGPu1vvWbBsUKiU-nrUFZcyCnJO0XfOgRja_yE' },
    { code: 'GBP', name: 'Libra Esterlina', buy: '1020.50', sell: '1050.00', var: '-0.1%', trend: 'down', color: 'rose', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYHQZZ0jP73X5sFxyL-Z9g1UYhq9U0IP33YxNM9_19h6s2WO0_nBF87703pn8tQQ8_NR5_7BD4N8a0SQUIA6l2M15gsQTLZUF7wOgl7c7ThhVr3wTu387AVQCkYU1n1S-64F0QeCIcvGyREQFa2Bj1MtOiGmKUQzWMUPdNGKofhRg5KJM0LRM9UDpNeh9KmaWqbkk3fquRgBfy9GIHmMPvi-fksCAJ3HhIuftYRy5cRyURDARBL86eab9gqCZ2VmomTAr8-OTcQWs' },
    { code: 'BRL', name: 'Real Brasileiro', buy: '165.30', sell: '172.10', var: '-0.05%', trend: 'down', color: 'rose', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVME5JG6pIl4QTdlIlI6C0J3yQLVB5J4eFhBptOnZShASFen0iYp2tnQjHX8uSSwAR1hHFoxXkxmqV6aWXjmFtmvyjcqUrsF8IInn3fPdR5Cbo_n1towLNPPfXWQl953U96-lz6Y9z1abx3R1ORoyO994Vd-9I41wVtS9Lz9N5jFstp8R_xJYuQzJxsbL665-Z0-ZMTgn0dLp2xRqqINkjHOMNRuxrTpIeWrpE_Z9Ty93iZRf_-98dbNs0o-rCe1YcwWh6tsgLYLo' },
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 py-8 px-4 md:px-10 lg:px-20 xl:px-40 max-w-[1400px] mx-auto w-full pb-32 lg:pb-10">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-end gap-4 px-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-black dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Mercado de Câmbio
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-500 ring-1 ring-inset ring-emerald-500/20 uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live
            </span>
          </div>
          <p className="text-gray-500 dark:text-[#92adc9] text-base font-medium">
            Taxas de câmbio oficiais atualizadas em tempo real. Base: Kwanza (AOA).
          </p>
        </div>
        <div className="text-right text-sm text-gray-400 dark:text-[#92adc9] font-bold">
          <p>Próxima atualização em: <span className="font-mono text-primary">{timeLeft}s</span></p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 overflow-hidden">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col gap-2 rounded-2xl p-6 border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c2a38] shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${stat.flag})` }} />
                <p className="text-black dark:text-white text-sm font-black uppercase tracking-wider">{stat.pair}</p>
              </div>
              <span className={`material-symbols-outlined ${stat.trend === 'up' ? 'text-emerald-500' : stat.trend === 'down' ? 'text-rose-500' : 'text-slate-400'}`}>
                {stat.trend === 'up' ? 'trending_up' : stat.trend === 'down' ? 'trending_down' : 'trending_flat'}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-black dark:text-white text-2xl font-black">{stat.price}</p>
              <p className={`text-xs font-black px-2 py-0.5 rounded ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {stat.change}
              </p>
            </div>
            <p className="text-gray-400 dark:text-[#92adc9] text-[10px] uppercase font-bold tracking-widest mt-1">Vol: {stat.vol}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters & Table */}
      <div className="px-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c2a38] text-black dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              placeholder="Buscar moeda (ex: USD, EUR, GBP)"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 h-12 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[20px]">star</span>
              Favoritos
            </button>
            <button className="flex items-center justify-center h-12 w-12 rounded-xl bg-white dark:bg-[#1c2a38] border border-gray-100 dark:border-white/5 text-gray-500 hover:text-primary transition-all">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c2a38] shadow-xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-gray-50 dark:bg-[#1a2632]">
                <tr>
                  <th className="px-6 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Moeda</th>
                  <th className="px-6 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-right">Compra (AOA)</th>
                  <th className="px-6 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-right">Venda (AOA)</th>
                  <th className="px-6 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-right">Var. 24h</th>
                  <th className="px-6 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-center">Gráfico</th>
                  <th className="px-6 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {currencies.map((curr, idx) => (
                  <tr key={idx} className="group hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-800 shadow-sm" style={{ backgroundImage: `url(${curr.flag})` }} />
                        <div>
                          <p className="text-sm font-black text-black dark:text-white uppercase tracking-wider">{curr.code}</p>
                          <p className="text-[10px] font-bold text-gray-400">{curr.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-black text-black dark:text-white font-mono">{curr.buy}</td>
                    <td className="px-6 py-4 text-right text-sm font-black text-black dark:text-white font-mono">{curr.sell}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 text-sm font-black ${curr.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        <span className="material-symbols-outlined text-[20px]">{curr.trend === 'up' ? 'arrow_drop_up' : 'arrow_drop_down'}</span>
                        {curr.var}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <svg viewBox="0 0 100 30" width="80" height="24" className={curr.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}>
                          <path 
                            d={curr.trend === 'up' ? "M0 25 L20 15 L40 20 L60 5 L80 10 L100 0" : "M0 5 L20 20 L40 10 L60 25 L80 15 L100 30"} 
                            fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" 
                          />
                        </svg>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest py-2 px-6 rounded-xl transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-95">
                        Trocar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CambioMercadoPage;
