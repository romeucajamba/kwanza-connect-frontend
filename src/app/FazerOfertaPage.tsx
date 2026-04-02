import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  CheckCircle2, 
  Calculator,
  RefreshCcw,
  Zap,
  LayoutDashboard,
  ArrowLeft,
  ShieldCheck,
  DollarSign,
  Banknote
} from 'lucide-react';
import { useCreateOffer } from '../services/offers.hooks';
import { useCurrencies } from '../services/rates.hooks';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FazerOfertaPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: currencies } = useCurrencies();
  const { mutate: createOffer, isPending } = useCreateOffer();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    give_currency: 'USD',
    give_amount: '',
    receive_currency: 'AOA',
    receive_amount: '',
    payment_method: 'Multicaixa Express',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const giveCurrency = currencies?.find(c => c.code === formData.give_currency);
    const receiveCurrency = currencies?.find(c => c.code === formData.receive_currency);

    if (!giveCurrency || !receiveCurrency) {
      toast.error('Moeda inválida ou não carregada');
      return;
    }

    createOffer({
      give_currency: giveCurrency.id,
      receive_currency: receiveCurrency.id,
      give_amount: parseFloat(formData.give_amount),
      receive_amount: parseFloat(formData.receive_amount),
    }, {
      onSuccess: () => {
        toast.success('Oferta publicada com sucesso!');
        setFormData({
          ...formData,
          give_amount: '',
          receive_amount: '',
        });
        setStep(1);
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Erro ao publicar oferta';
        toast.error(message);
      }
    });
  };

  const exchangeRate = parseFloat(formData.give_amount) > 0 
    ? (parseFloat(formData.receive_amount || '0') / parseFloat(formData.give_amount)).toFixed(2)
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
            
            <form onSubmit={handleCreate} className="p-5 md:p-6 space-y-4 relative z-10">
              {/* Simple Step Indicator */}
              <div className="flex items-center gap-3 mb-4">
                 <div className={`size-7 rounded-lg flex items-center justify-center font-bold text-[10px] transition-all ${step >= 1 ? 'bg-primary text-white shadow-md' : 'bg-slate-50 text-slate-300'}`}>01</div>
                 <div className={`flex-1 h-0.5 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-slate-100 dark:bg-white/5'}`} />
                 <div className={`size-7 rounded-lg flex items-center justify-center font-bold text-[10px] transition-all ${step >= 2 ? 'bg-primary text-white shadow-md' : 'bg-slate-50 text-slate-300'}`}>02</div>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Para Entregar</label>
                          <div className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-[#111922] rounded-lg border border-transparent focus-within:border-primary/20 transition-all shadow-inner">
                             <input 
                               type="number" step="0.01" className="flex-1 bg-transparent border-none p-0 text-lg font-bold text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-200" 
                               placeholder="1.000,00" value={formData.give_amount} onChange={(e) => setFormData({...formData, give_amount: e.target.value})}
                             />
                             <select className="bg-transparent border-none text-[9px] font-bold text-primary focus:ring-0 cursor-pointer pr-8 uppercase tracking-widest" value={formData.give_currency} onChange={(e) => setFormData({...formData, give_currency: e.target.value})}>
                                {currencies?.map(c => <option key={c.id} value={c.code}>{c.code}</option>) || <option>USD</option>}
                             </select>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Para Receber</label>
                          <div className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-[#111922] rounded-lg border border-transparent focus-within:border-primary/20 transition-all shadow-inner">
                             <input 
                               type="number" step="0.01" className="flex-1 bg-transparent border-none p-0 text-lg font-bold text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-200" 
                               placeholder="850.000,00" value={formData.receive_amount} onChange={(e) => setFormData({...formData, receive_amount: e.target.value})}
                             />
                             <select className="bg-transparent border-none text-[9px] font-bold text-primary focus:ring-0 cursor-pointer pr-8 uppercase tracking-widest" value={formData.receive_currency} onChange={(e) => setFormData({...formData, receive_currency: e.target.value})}>
                                {currencies?.map(c => <option key={c.id} value={c.code}>{c.code}</option>) || <option>AOA</option>}
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-4 group">
                       <div className="size-9 rounded-lg bg-white dark:bg-[#111922] shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Calculator className="size-4" />
                       </div>
                       <div className="flex-1">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-70">Taxa Câmbio Calculada</p>
                          <p className="text-base font-bold text-primary uppercase tracking-tight">1 {formData.give_currency} = {exchangeRate} {formData.receive_currency}</p>
                       </div>
                    </div>

                    <button type="button" onClick={() => setStep(2)} className="w-full h-11 bg-primary text-white rounded-lg font-bold uppercase text-[10px] tracking-widest shadow-md shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary/95 transition-all group">
                       Pagamentos & Segurança
                       <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Método de Transferência</label>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {['Multicaixa Express', 'IBAN Angola', 'Wise / Revolut', 'Binance Pay'].map(m => (
                             <button 
                                key={m} type="button" onClick={() => setFormData({...formData, payment_method: m})}
                                className={`p-3 rounded-lg border transition-all flex items-center justify-between group/opt ${formData.payment_method === m ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-slate-100 dark:border-white/5 hover:border-primary/20 text-slate-500 bg-slate-50/50 dark:bg-white/5'}`}
                             >
                                <span className="text-[10px] font-bold uppercase tracking-tight">{m}</span>
                                <div className={`size-4 rounded-full border flex items-center justify-center transition-all ${formData.payment_method === m ? 'border-primary bg-primary text-white shadow-inner' : 'border-slate-300 dark:border-slate-700'}`}>
                                   {formData.payment_method === m && <CheckCircle2 className="size-2.5" />}
                                </div>
                             </button>
                          ))}
                       </div>
                    </div>
                    
                    <div className="p-4 bg-slate-900 rounded-xl text-white flex items-center gap-3">
                       <ShieldCheck className="size-5 text-primary flex-shrink-0" />
                       <p className="text-[8px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">Activos bloqueados via Smart Escrow após início da negociação.</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                       <button 
                         type="button" onClick={() => setStep(1)} 
                         className="flex-1 h-11 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-lg font-bold uppercase text-[9px] tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                       >
                          <ArrowLeft className="size-3.5" />
                          <span>Voltar</span>
                       </button>
                       <button 
                         type="submit" disabled={isPending} 
                         className="flex-[2] h-11 bg-primary text-white rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-primary/95 disabled:opacity-50"
                       >
                          {isPending ? <RefreshCcw className="size-3.5 animate-spin" /> : <Zap className="size-3.5" />}
                          Finalizar & Publicar
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 dark:bg-black rounded-xl p-5 md:p-6 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 flex flex-col gap-6">
                 <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="size-9 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                       <Zap className="size-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-tight">Dicas PRO</h3>
                 </div>
                 <ul className="space-y-5">
                    {[
                      { icon: DollarSign, title: 'Mercado', desc: 'Preços médios.' },
                      { icon: Banknote, title: 'Límites', desc: 'Minímimo de $10.' },
                      { icon: ShieldCheck, title: 'Segurança', desc: 'KYC obrigatório.' }
                    ].map((item, i) => (
                       <li key={i} className="flex gap-3">
                          <div className="size-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0">
                             <item.icon className="size-3.5 text-primary" />
                          </div>
                          <div>
                             <h4 className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1.5">{item.title}</h4>
                             <p className="text-[9px] text-white/40 font-medium leading-relaxed uppercase tracking-wide opacity-80">{item.desc}</p>
                          </div>
                       </li>
                    ))}
                 </ul>
              </div>
           </div>

           <div className="p-6 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-center relative">
              <h3 className="text-emerald-500 text-[9px] font-bold uppercase tracking-widest mb-2 opacity-80">Facto Local</h3>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic opacity-80">
                IBAN Angola permite transferências directas entre bancos locais em tempo real.
              </p>
           </div>
        </div>
      </div>
    </div>

  );
};

export default FazerOfertaPage;
