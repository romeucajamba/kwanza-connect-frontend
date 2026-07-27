import React, { useMemo, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Calculator,
  RefreshCcw,
  Zap,
  ShieldCheck,
  DollarSign,
  Banknote,
  ChevronDown,
  AlignLeft,
} from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOfferSchema, type CreateOfferFormValues } from '@/schemas';
import { useCreateOffer } from '@/services/offers.hooks';
import toast from 'react-hot-toast';
import { useCurrencies, useExchangeRates } from '@/services/rates.hooks';

// ─── CurrencySelect ───────────────────────────────────────────────────────────
const CurrencySelect = ({
  value,
  onChange,
  currencies,
}: {
  value: string;
  onChange: (v: string) => void;
  currencies: any[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = currencies?.find((c) => c.code === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2 bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5 rounded-lg pl-3 pr-2 py-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-all outline-none"
      >
        {selected ? (
          <>
            <span className="text-base leading-none">{selected.flag_emoji || selected.code[0]}</span>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{selected.code}</span>
          </>
        ) : (
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">{value}</span>
        )}
        <ChevronDown className={`size-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-[100] overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5">
              {!currencies || currencies.length === 0 ? (
                <div className="p-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">A Carregar...</div>
              ) : (
                currencies.map((c) => (
                  <button
                    key={c.id || c.code}
                    type="button"
                    onClick={() => { onChange(c.code); setIsOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${value === c.code ? 'bg-primary/5 text-primary' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none">{c.flag_emoji || c.code[0]}</span>
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">{c.code}</span>
                        <span className="text-[8px] font-bold opacity-60 mt-1 max-w-[90px] truncate block text-left">{c.name || 'Moeda'}</span>
                      </div>
                    </div>
                    {value === c.code && <CheckCircle2 className="size-3.5 text-primary" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AVAILABLE_PLATFORMS = [
  "Multicaixa Express", "Aplicações Bancárias", "PayPay África",
  "Unitel Money", "Afrimoney", "e-Kwanza", "AkiPaga", "Agiliza",
  "eKumbu", "BNIX", "Wise", "Payoneer", "PayPal", "Remitly",
  "Binance", "Bybit", "outra"
] as const;

type PaymentMethodType = typeof AVAILABLE_PLATFORMS[number];

// ─── FazerOfertaPage ──────────────────────────────────────────────────────────
const FazerOfertaPage: React.FC = () => {
  const { data: currencies } = useCurrencies();
  const { data: rates } = useExchangeRates();
  const { mutate: createOffer, isPending } = useCreateOffer();
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateOfferFormValues>({
    resolver: zodResolver(createOfferSchema),
    defaultValues: {
      give_currency_code: 'USD',
      want_currency_code: 'AOA',
      give_amount: '',
      want_amount: '',
      offer_type: 'sell',
      payment_methods: [],
      notes: '',
    },
  });

  const give_currency_code = watch('give_currency_code');
  const want_currency_code = watch('want_currency_code');
  const give_amount = watch('give_amount');
  const want_amount = watch('want_amount');
  const offer_type = watch('offer_type');
  const selectedMethods = watch('payment_methods') || [];

  const toggleMethod = (method: PaymentMethodType) => {
    const current = selectedMethods;
    if (current.includes(method)) {
      setValue('payment_methods', current.filter(m => m !== method), { shouldValidate: true });
    } else {
      setValue('payment_methods', [...current, method], { shouldValidate: true });
    }
  };

  const marketRate = useMemo(() => {
    if (!rates) return 0;
    const rateItem = (rates as any[]).find(
      (r) => r.from_currency.code === give_currency_code && r.to_currency.code === want_currency_code
    );
    if (rateItem) return rateItem.rate;
    const inverseRate = (rates as any[]).find(
      (r) => r.from_currency.code === want_currency_code && r.to_currency.code === give_currency_code
    )?.rate;
    return inverseRate ? 1 / inverseRate : 0;
  }, [rates, give_currency_code, want_currency_code]);

  const marketRateDisplay = (rates as any[])?.find(
    (r: any) => r.from_currency.code === give_currency_code && r.to_currency.code === want_currency_code
  )?.rate ?? 0;

  useEffect(() => {
    if (give_amount && !isNaN(Number(give_amount))) {
      setValue('want_amount', (Number(give_amount) * marketRate).toFixed(2), { shouldValidate: true });
    } else {
      setValue('want_amount', '');
    }
  }, [give_amount, marketRate, setValue]);

  const onSubmit: SubmitHandler<CreateOfferFormValues> = async (data) => {
    // Formatar como decimal com 2 casas para garantir compatibilidade com o backend Django
    const formatDecimal = (val: string) => parseFloat(val).toFixed(2);

    // Guarda: bloqueia submit se want_amount for zero (sem taxa de câmbio disponível)
    const wantAmountNum = parseFloat(data.want_amount);
    if (!wantAmountNum || wantAmountNum <= 0) {
      toast.error('Não há taxa de câmbio disponível para este par de moedas. Tente outro par ou volte mais tarde.');
      return;
    }

    const getLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve(null);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({
            latitude: Number(pos.coords.latitude.toFixed(8)),
            longitude: Number(pos.coords.longitude.toFixed(8))
          }),
          (err) => {
            console.warn("Geolocation permission denied or timeout.", err);
            toast.error("Localização indisponível. A oferta prosseguirá usando o seu Perfil.");
            resolve(null);
          },
          { timeout: 5000, enableHighAccuracy: false }
        );
      });
    };

    setIsDetectingLocation(true);
    const coords = await getLocation();
    setIsDetectingLocation(false);

    createOffer(
      {
        give_currency_code: data.give_currency_code,
        want_currency_code: data.want_currency_code,
        give_amount: formatDecimal(data.give_amount),
        want_amount: formatDecimal(data.want_amount),
        offer_type: data.offer_type,
        payment_methods: data.payment_methods,
        notes: data.notes,
        latitude: coords?.latitude || null,
        longitude: coords?.longitude || null,
      },
      {
        onSuccess: () => {
          reset({
            give_currency_code: data.give_currency_code,
            want_currency_code: data.want_currency_code,
            give_amount: '',
            want_amount: '',
            offer_type: data.offer_type,
            payment_methods: [],
            notes: '',
          });
        },
      }
    );
  };

  const exchangeRate =
    parseFloat(give_amount) > 0
      ? (parseFloat(want_amount || '0') / parseFloat(give_amount)).toFixed(2)
      : '0.00';

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold leading-tight tracking-tight uppercase">
            Publicar <span className="text-primary italic">Oferta</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full opacity-50 pointer-events-none" />

            <form onSubmit={handleSubmit(onSubmit)} className="p-5 md:p-6 space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Tipo de Oferta */}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Eu quero</span>
                    <span className="text-primary">
                      1 {give_currency_code} = {marketRate.toFixed(4)} {want_currency_code} (Mercado)
                    </span>
                  </div>
                  <div className="flex p-1 bg-slate-100 dark:bg-[#111922] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setValue('offer_type', 'sell')}
                      className={`flex-1 h-10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${offer_type === 'sell' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Vender
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('offer_type', 'buy')}
                      className={`flex-1 h-10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${offer_type === 'buy' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Comprar
                    </button>
                  </div>
                </div>

                {/* Para Entregar */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    Para Entregar
                  </label>
                  <div
                    className={`flex items-center gap-2.5 p-4 bg-slate-50 dark:bg-[#111922] rounded-xl border transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary ${errors.give_amount ? 'border-red-400' : 'border-slate-100 dark:border-white/5'}`}
                  >
                    <input
                      {...register('give_amount')}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="flex-1 bg-transparent border-none p-0 text-xl font-black text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-200 outline-none w-full"
                    />
                    <CurrencySelect
                      value={give_currency_code}
                      onChange={(v) => setValue('give_currency_code', v, { shouldValidate: true })}
                      currencies={(currencies as any[]) || []}
                    />
                  </div>
                  {errors.give_amount && (
                    <p className="text-red-500 text-[10px] font-bold ml-1">{errors.give_amount.message}</p>
                  )}
                </div>

                {/* Para Receber */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex justify-between">
                    <span>Para Receber (Automático)</span>
                    <span className="text-primary opacity-80">Mercado</span>
                  </label>
                  <div
                    className={`flex items-center gap-2.5 p-4 bg-slate-100/50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-white/5 opacity-90`}
                  >
                    <input
                      {...register('want_amount')}
                      type="number"
                      step="0.01"
                      min="0"
                      readOnly
                      placeholder="0.00"
                      className="flex-1 bg-transparent border-none p-0 text-xl font-black text-slate-500 dark:text-slate-400 focus:ring-0 placeholder:text-slate-300 outline-none w-full cursor-not-allowed"
                    />
                    <CurrencySelect
                      value={want_currency_code}
                      onChange={(v) => setValue('want_currency_code', v, { shouldValidate: true })}
                      currencies={(currencies as any[]) || []}
                    />
                  </div>
                  {errors.want_amount && (
                    <p className="text-red-500 text-[10px] font-bold ml-1">{errors.want_amount.message}</p>
                  )}
                </div>

                {/* Removido o campo manual de cidade. O GPS capturará durante o submit para KYC/Anti-Fraude */}

                {/* Plataformas de Pagamento Suportadas */}
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    Como deseja receber/enviar os fundos? *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_PLATFORMS.map((method) => {
                      const isSelected = selectedMethods.includes(method);
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => toggleMethod(method)}
                          className={`px-3 py-2 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-all border ${isSelected ? 'bg-primary border-primary text-white shadow-md' : 'bg-slate-50 dark:bg-[#111922] border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300'}`}
                        >
                          {method}
                        </button>
                      );
                    })}
                  </div>
                  {errors.payment_methods && (
                    <p className="text-red-500 text-[10px] font-bold ml-1">{errors.payment_methods.message as string}</p>
                  )}
                </div>

                {/* Notas/Instruções */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    Notas ou Outras Instruções (Opcional)
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-primary transition-colors">
                      <AlignLeft className="size-4" />
                    </div>
                    <textarea
                      {...register('notes')}
                      rows={2}
                      placeholder="Ex: Respondo apenas pela manhã..."
                      className={`w-full bg-slate-50 dark:bg-[#111922] border rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none ${errors.notes ? 'border-red-400 focus:ring-red-400' : 'border-slate-100 dark:border-white/5'}`}
                    />
                  </div>
                  {errors.notes && (
                    <p className="text-red-500 text-[10px] font-bold ml-1">{errors.notes.message as string}</p>
                  )}
                </div>
              </div>

              {/* Aviso: sem taxa de câmbio disponível */}
              {marketRate === 0 && give_currency_code && want_currency_code && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                  <span className="text-amber-500 text-base leading-none mt-0.5">⚠️</span>
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-relaxed">
                    Sem taxa de câmbio disponível para o par {give_currency_code}/{want_currency_code}. Escolha outro par de moedas ou aguarde a actualização das taxas.
                  </p>
                </div>
              )}

              {/* Rate Summary */}
              {marketRate > 0 && (
                <div className="p-5 bg-primary/5 rounded-xl border border-primary/10 flex flex-col sm:flex-row items-center gap-6 group">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="size-10 rounded-xl bg-white dark:bg-[#111922] shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Calculator className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-70">
                        Taxa Câmbio Oferecida
                      </p>
                      <p className="text-lg font-black text-primary uppercase tracking-tight">
                        1 {give_currency_code} = {exchangeRate} {want_currency_code}
                      </p>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-slate-200 dark:bg-white/5 hidden sm:block" />
                  <div className="flex flex-col items-center sm:items-end">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-60">
                      Referência Mercado
                    </span>
                    <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      ~ {marketRateDisplay.toFixed(4)}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit — ícones com CSS show/hide para evitar crash React insertBefore */}
              <button
                type="submit"
                disabled={isPending || isDetectingLocation || marketRate === 0}
                className="w-full h-14 bg-primary text-white rounded-xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-primary/95 disabled:opacity-50 outline-none"
              >
                <RefreshCcw className={`size-4 ${isPending || isDetectingLocation ? 'animate-spin' : 'hidden'}`} />
                <Zap className={`size-4 ${isPending || isDetectingLocation ? 'hidden' : ''}`} />
                {isDetectingLocation ? 'A aguardar GPS (Segurança)...' : 'Finalizar & Publicar no Mercado'}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar info */}
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
                  { icon: CheckCircle2, title: 'Confiança', desc: 'KYC obrigatório.' },
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
            <h3 className="text-emerald-500 text-[9px] font-black uppercase tracking-widest mb-2 opacity-80">
              Negociação Direta
            </h3>
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
