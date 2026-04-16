import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Calculator,
  RefreshCcw,
  Zap,
  LayoutDashboard,
  ShieldCheck,
  DollarSign,
  Banknote
} from 'lucide-react';
import { useCreateOffer } from '@/services/offers.hooks';
import { useCurrencies, useExchangeRates } from '@/services/rates.hooks';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FazerOfertaPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: currencies } = useCurrencies();
  const { data: rates } = useExchangeRates();
  const { mutate: createOffer, isPending } = useCreateOffer();
  
  const [formData, setFormData] = useState({
    give_currency: 'USD',
    give_amount: '',
    want_currency: 'AOA',
    want_amount: '',
    offer_type: 'sell' // Default to selling
  });

  const marketRate = useMemo(() => {
    if (!rates) return 0;
    const rateItem = rates.find(
      (r: any) => r.from_currency.code === formData.give_currency && r.to_currency.code === formData.want_currency
    );
    if (rateItem) return rateItem.rate;
    
    // Fallback: tentar o inverso se houver
    const inverseRate = rates.find(
      (r: any) => r.from_currency.code === formData.want_currency && r.to_currency.code === formData.give_currency
    )?.rate;
    
    if (inverseRate) return 1 / inverseRate;
    return 0;
  }, [rates, formData.give_currency, formData.want_currency]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.give_amount || !formData.want_amount) {
      toast.error('Preencha os valores da oferta');
      return;
    }

    const giveCurrency = currencies?.find(c => c.code === formData.give_currency);
    const wantCurrency = currencies?.find(c => c.code === formData.want_currency);

    if (!giveCurrency || !wantCurrency) {
      toast.error('Moeda inválida ou não carregada');
      return;
    }

    createOffer({
      give_currency: giveCurrency.id,
      want_currency: wantCurrency.id,
      give_amount: parseFloat(formData.give_amount),
      want_amount: parseFloat(formData.want_amount),
      offer_type: formData.offer_type,
      notes: `Troca de ${formData.give_currency} por ${formData.want_currency}`,
    }, {
      onSuccess: () => {
        setFormData({
          ...formData,
          give_amount: '',
          want_amount: '',
        });
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Erro ao publicar oferta';
        toast.error(message);
      }
    });
  };

  const exchangeRate = parseFloat(formData.give_amount) > 0 
    ? (parseFloat(formData.want_amount || '0') / parseFloat(formData.give_amount)).toFixed(2)
    : '0.00';

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* Header Compacto */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold leading-tight tracking-tight uppercase">
            Publicar <span className="text-primary italic">Oferta</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-[9px] uppercase tracking-widest opacity-80 leading-relaxed">
            Configure os seus limites e publique no mercado P2P.
          </p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center gap-2 bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-bold uppercase text-[9px] tracking-widest px-6 h-10 rounded-lg hover:bg-slate-50 transition-all shadow-sm shadow-black/5"
        >
          <LayoutDashboard className="size-3.5" />
          <span>Dashboard</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full opacity-50 pointer-events-none" />
            
            <form onSubmit={handleCreate} className="p-5 md:p-6 space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tipo de Oferta */}
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Eu quero</span>
                      <span className="text-primary">1 {formData.give_currency} = {marketRate.toFixed(4)} {formData.want_currency} (Mercado)</span>
                    </div>
                    <div className="flex p-1 bg-slate-100 dark:bg-[#111922] rounded-xl">
                      <button 
                        type="button" onClick={() => setFormData({...formData, offer_type: 'sell'})}
                        className={`flex-1 h-10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.offer_type === 'sell' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Vender
                      </button>
                      <button 
                        type="button" onClick={() => setFormData({...formData, offer_type: 'buy'})}
                        className={`flex-1 h-10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.offer_type === 'buy' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Comprar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Para Entregar</label>
                    <div className="flex items-center gap-2.5 p-4 bg-slate-50 dark:bg-[#111922] rounded-xl border border-slate-100 dark:border-white/5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                        <input 
                          type="number" step="0.01" className="flex-1 bg-transparent border-none p-0 text-xl font-black text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-200 outline-none" 
                          placeholder="0.00" value={formData.give_amount} onChange={(e) => setFormData({...formData, give_amount: e.target.value})}
                        />
                        <select 
                          className="bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5 rounded-lg text-[10px] font-black text-primary px-3 py-1.5 focus:ring-0 cursor-pointer uppercase tracking-widest outline-none" 
                          value={formData.give_currency} onChange={(e) => setFormData({...formData, give_currency: e.target.value})}
                        >
                          {currencies?.map(c => <option key={`give-${c.id}`} value={c.code}>{c.code}</option>) || <option>USD</option>}
                        </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Para Receber</label>
                    <div className="flex items-center gap-2.5 p-4 bg-slate-50 dark:bg-[#111922] rounded-xl border border-slate-100 dark:border-white/5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                        <input 
                          type="number" step="0.01" className="flex-1 bg-transparent border-none p-0 text-xl font-black text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-200 outline-none" 
                          placeholder="0.00" value={formData.want_amount} onChange={(e) => setFormData({...formData, want_amount: e.target.value})}
                        />
                        <select 
                          className="bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5 rounded-lg text-[10px] font-black text-primary px-3 py-1.5 focus:ring-0 cursor-pointer uppercase tracking-widest outline-none" 
                          value={formData.want_currency} onChange={(e) => setFormData({...formData, want_currency: e.target.value})}
                        >
                          {currencies?.map(c => <option key={`want-${c.id}`} value={c.code}>{c.code}</option>) || <option>AOA</option>}
                        </select>
                    </div>
                  </div>
              </div>

              <div className="p-5 bg-primary/5 rounded-xl border border-primary/10 flex flex-col sm:flex-row items-center gap-6 group">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="size-10 rounded-xl bg-white dark:bg-[#111922] shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Calculator className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-70">Taxa Câmbio Oferecida</p>
                      <p className="text-lg font-black text-primary uppercase tracking-tight">1 {formData.give_currency} = {exchangeRate} {formData.want_currency}</p>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-slate-200 dark:bg-white/5 hidden sm:block" />
                  <div className="flex flex-col items-center sm:items-end">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-60">Referência Mercado</span>
                      <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
                         ~ {(rates?.find((r: any) => r.from_currency.code === formData.give_currency && r.to_currency.code === formData.want_currency)?.rate || 0).toFixed(4)}
                      </p>
                  </div>
              </div>

              <div className="p-5 bg-slate-900 rounded-xl text-white flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <ShieldCheck className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[10px] font-black uppercase tracking-tight mb-0.5">Segurança Inteligente</h4>
                    <p className="text-[9px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">Os activos são bloqueados via Smart Escrow após o início da negociação no chat.</p>
                  </div>
              </div>

              <button 
                type="submit" disabled={isPending} 
                className="w-full h-14 bg-primary text-white rounded-xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-primary/95 disabled:opacity-50 outline-none"
              >
                {isPending ? <RefreshCcw className="size-4 animate-spin" /> : <Zap className="size-4" />}
                Finalizar & Publicar no Mercado
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <DollarSign className="size-5 text-white" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-tight">Resumo P2P</h3>
                  </div>
                  <ul className="space-y-6">
                    {[
                      { icon: DollarSign, title: 'Sem Taxas', desc: 'Publicação gratuita.' },
                      { icon: Banknote, title: 'Limites', desc: 'A partir de 10 unidades.' },
                      { icon: CheckCircle2, title: 'Confiança', desc: 'KYC obrigatório.' }
                    ].map((item, i) => (
                        <li key={i} className="flex gap-4">
                          <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                              <item.icon className="size-4 text-primary" />
                          </div>
                          <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest leading-none mb-1.5">{item.title}</h4>
                              <p className="text-[9px] text-white/40 font-bold uppercase tracking-wide opacity-80">{item.desc}</p>
                          </div>
                        </li>
                    ))}
                  </ul>
              </div>
            </div>

            <div className="p-6 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-center relative flex flex-col items-center">
              <ShieldCheck className="size-8 text-emerald-500 mb-3 opacity-40" />
              <h3 className="text-emerald-500 text-[9px] font-black uppercase tracking-widest mb-2 opacity-80">Negociação Direta</h3>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-widest opacity-80">
                Os utilizadores vão acordar os métodos de pagamento (Multicaixa, Binance, etc.) através do chat seguro.
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FazerOfertaPage;
