import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOffers, useCurrencies, useCreateOffer, useExpressInterest } from '@services/offers.hooks';
import { useAuthStore } from '@store/authStore';
import toast from 'react-hot-toast';

const FazerOfertaPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { data: offers, isLoading: offersLoading } = useOffers();
  const { data: currencies, isLoading: currenciesLoading } = useCurrencies();
  const { mutate: createOffer, isPending: creatingOffer } = useCreateOffer();
  const { mutate: expressInterest } = useExpressInterest();

  const [type, setType] = useState<'buy' | 'sell'>('buy');
  const [giveCurrencyId, setGiveCurrencyId] = useState('');
  const [wantCurrencyId, setWantCurrencyId] = useState('');
  const [giveAmount, setGiveAmount] = useState('');
  const [wantAmount, setWantAmount] = useState('');

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giveCurrencyId || !wantCurrencyId || !giveAmount || !wantAmount) {
      toast.error('Preencha todos os campos');
      return;
    }
    createOffer({
      give_currency: giveCurrencyId,
      give_amount: parseFloat(giveAmount),
      want_currency: wantCurrencyId,
      want_amount: parseFloat(wantAmount),
      offer_type: type,
    });
  };

  const handleInterest = (offerId: string) => {
    expressInterest({ offerId, message: 'Olá, gostaria de negociar esta oferta.' });
  };

  if (offersLoading || currenciesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="size-12 border-4 border-primary border-t-transparent rounded-full" 
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-8 py-8 px-4 md:px-10 lg:px-20 xl:px-40 max-w-[1400px] mx-auto w-full pb-32 lg:pb-10 font-display transition-colors">
      <div className="flex flex-wrap justify-between gap-4 items-center">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tighter uppercase">Mercado P2P</h1>
          <p className="text-gray-500 dark:text-[#92adc9] text-base font-medium">Negocie moedas diretamente com outros usuários de forma segura.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Marketplace List */}
          <div className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#192633] overflow-hidden shadow-xl">
            <div className="flex border-b border-gray-50 dark:border-white/5 bg-gray-50 dark:bg-[#101922]/50">
              <button 
                onClick={() => setType('buy')}
                className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all ${
                  type === 'buy' ? 'text-primary border-b-4 border-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
                }`}
              >
                Comprar
              </button>
              <button 
                onClick={() => setType('sell')}
                className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all ${
                  type === 'sell' ? 'text-primary border-b-4 border-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
                }`}
              >
                Vender
              </button>
            </div>
            <div className="p-6">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input 
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-[#101922] border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="Buscar por moeda ou usuário"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {offers?.length === 0 && (
              <div className="p-12 text-center bg-white dark:bg-[#192633] rounded-3xl border-2 border-dashed border-gray-100 dark:border-white/5">
                <p className="text-gray-500 font-bold">Nenhuma oferta encontrada para este critério.</p>
              </div>
            )}
            
            {offers?.map((offer, idx) => (
              <motion.div 
                key={offer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#192633] shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="flex flex-col gap-6 flex-1 w-full">
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-full border-4 border-gray-50 dark:border-[#101922] shadow-sm bg-background-light dark:bg-background-dark flex items-center justify-center overflow-hidden">
                      <img 
                        src={offer.owner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${offer.owner.id}`} 
                        alt={offer.owner.full_name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1">
                        {offer.owner.full_name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-emerald-500 !text-sm">verified</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{offer.owner.is_verified ? 'Verificado' : 'Não Verificado'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">Dá</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">
                        {offer.give_amount.toLocaleString('pt-AO')} <span className="text-primary">{offer.give_currency.code}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">Pede</p>
                      <p className="text-sm font-black text-emerald-500">
                        {offer.want_amount.toLocaleString('pt-AO')} {offer.want_currency.code}
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">Localização</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">{offer.city || 'Digital'}</p>
                    </div>
                  </div>
                </div>
                {offer.owner.id !== user?.id && (
                  <button 
                    onClick={() => handleInterest(offer.id)}
                    className="w-full sm:w-auto px-8 h-12 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-primary/20 active:scale-95"
                  >
                    Negociar Agora
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Create Offer Sidebar */}
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
            
            <form onSubmit={handleCreateOffer} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vou Entregar</label>
                <div className="flex gap-2">
                  <input 
                    value={giveAmount}
                    onChange={(e) => setGiveAmount(e.target.value)}
                    className="flex-1 h-14 px-6 rounded-2xl bg-gray-50 dark:bg-[#101922] border-none text-xl font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/30 transition-all outline-none" 
                    placeholder="0.00" 
                    type="number" 
                    required
                  />
                  <select 
                    value={giveCurrencyId}
                    onChange={(e) => setGiveCurrencyId(e.target.value)}
                    className="px-6 h-14 bg-gray-100 dark:bg-[#233648] rounded-2xl text-xs font-black uppercase tracking-widest border-none outline-none cursor-pointer hover:bg-gray-200 transition-colors"
                    required
                  >
                    <option value="">Selecione</option>
                    {currencies?.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                 <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-xl">sync_alt</span>
                 </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Desejo Receber</label>
                <div className="flex gap-2">
                  <input 
                    value={wantAmount}
                    onChange={(e) => setWantAmount(e.target.value)}
                    className="flex-1 h-14 px-6 rounded-2xl bg-gray-50 dark:bg-[#101922] border-none text-xl font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/30 transition-all outline-none" 
                    placeholder="0.00" 
                    type="number" 
                    required
                  />
                  <select 
                    value={wantCurrencyId}
                    onChange={(e) => setWantCurrencyId(e.target.value)}
                    className="px-6 h-14 bg-gray-100 dark:bg-[#233648] rounded-2xl text-xs font-black uppercase tracking-widest border-none outline-none cursor-pointer hover:bg-gray-200 transition-colors"
                    required
                  >
                    <option value="">Selecione</option>
                    {currencies?.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={creatingOffer}
                className="w-full h-16 bg-primary hover:bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/30 active:scale-95 disabled:opacity-50"
              >
                {creatingOffer ? 'Processando...' : 'Publicar Agora'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FazerOfertaPage;
