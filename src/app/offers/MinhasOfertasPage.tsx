import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle,
  ArrowRightLeft,
  Pause,
  Play,
  X,
  Users,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '@/constants';
import { getAvatarUrl } from '@/lib/media';
import {
  useMyOffers,
  usePauseOffer,
  useResumeOffer,
  useCloseOffer,
  useOfferInterests,
  useAcceptInterest,
  useRejectInterest,
} from '@/services/offers.hooks';
import type { Offer, OfferInterest } from '@/types';

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: Offer['status'] }) => {
  const map = {
    active:  { label: 'Activa',    cls: 'bg-emerald-500/10 text-emerald-500' },
    paused:  { label: 'Pausada',   cls: 'bg-amber-500/10 text-amber-500' },
    closed:  { label: 'Encerrada', cls: 'bg-slate-200/60 dark:bg-white/5 text-slate-400' },
    expired: { label: 'Expirada',  cls: 'bg-red-500/10 text-red-400' },
  };
  const { label, cls } = map[status] ?? map.closed;
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${cls}`}>
      {label}
    </span>
  );
};

// ─── Interest Status Badge ─────────────────────────────────────────────────────
const InterestStatusBadge = ({ status }: { status: OfferInterest['status'] }) => {
  const map = {
    pending:   { icon: Clock,        cls: 'text-amber-500', label: 'Pendente' },
    accepted:  { icon: CheckCircle2, cls: 'text-emerald-500', label: 'Aceite' },
    rejected:  { icon: XCircle,      cls: 'text-red-400', label: 'Rejeitado' },
    cancelled: { icon: XCircle,      cls: 'text-slate-400', label: 'Cancelado' },
  };
  const { icon: Icon, cls, label } = map[status] ?? map.pending;
  return (
    <span className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-widest ${cls}`}>
      <Icon className="size-3" /> {label}
    </span>
  );
};

// ─── Interesses de uma oferta ─────────────────────────────────────────────────
const InterestsList = ({ offerId }: { offerId: string }) => {
  const { data: interests, isLoading } = useOfferInterests(offerId);
  const { mutate: accept, isPending: accepting } = useAcceptInterest();
  const { mutate: reject, isPending: rejecting } = useRejectInterest();

  if (isLoading) {
    return (
      <div className="flex justify-center py-5">
        <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!interests || interests.length === 0) {
    return (
      <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest py-4 opacity-60">
        Nenhuma proposta recebida ainda.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 dark:divide-white/5">
      {interests.map((interest) => (
        <li key={interest.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-3">
          <div
            className="size-8 rounded-lg bg-center bg-cover flex-shrink-0 border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden bg-slate-100 dark:bg-white/5"
            style={{ backgroundImage: `url(${getAvatarUrl(interest.buyer.avatar, interest.buyer.full_name)})` }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase leading-none">
              {interest.buyer.full_name || interest.buyer.email.split('@')[0]}
            </p>
            {interest.message && (
              <p className="text-[9px] text-slate-400 mt-1 truncate max-w-[200px]">{interest.message}</p>
            )}
          </div>
          <InterestStatusBadge status={interest.status} />
          {interest.status === 'pending' && (
            <div className="flex gap-2 ml-auto">
              <button
                disabled={accepting || rejecting}
                onClick={() => accept(interest.id)}
                className="h-7 px-3 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center gap-1.5 relative overflow-hidden"
              >
                <RefreshCcw className={`size-2.5 animate-spin ${!accepting ? 'hidden' : 'block'}`} />
                <CheckCircle2 className={`size-2.5 ${accepting ? 'hidden' : 'block'}`} />
                <span>Aceitar</span>
              </button>
              <button
                disabled={accepting || rejecting}
                onClick={() => reject(interest.id)}
                className="h-7 px-3 bg-red-500/10 text-red-400 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5 relative overflow-hidden"
              >
                <RefreshCcw className={`size-2.5 animate-spin ${!rejecting ? 'hidden' : 'block'}`} />
                <XCircle className={`size-2.5 ${rejecting ? 'hidden' : 'block'}`} />
                <span>Rejeitar</span>
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

// ─── Card de Oferta ───────────────────────────────────────────────────────────
const OfferCard = ({ offer }: { offer: Offer }) => {
  const [expanded, setExpanded] = useState(false);
  const { mutate: pause, isPending: pausing } = usePauseOffer();
  const { mutate: resume, isPending: resuming } = useResumeOffer();
  const { mutate: close, isPending: closing } = useCloseOffer();

  const rate = offer.give_amount > 0
    ? (offer.want_amount / offer.give_amount).toFixed(4)
    : '—';

  const isClosed = offer.status === 'closed' || offer.status === 'expired';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex flex-wrap gap-3 items-center justify-between border-b border-slate-50 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className={`size-9 rounded-xl flex items-center justify-center ${offer.offer_type === 'sell' ? 'bg-primary/5 text-primary' : 'bg-emerald-500/5 text-emerald-500'}`}>
            <ArrowRightLeft className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {offer.give_currency.code} → {offer.want_currency.code}
              </span>
              <StatusBadge status={offer.status} />
            </div>
            <p className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
              ID: #{offer.id.slice(0, 8)} · {new Date(offer.created_at).toLocaleDateString('pt-AO')}
            </p>
          </div>
        </div>

        {/* Actions */}
        {!isClosed && (
          <div className="flex items-center gap-2">
            {offer.status === 'active' ? (
              <button
                disabled={pausing}
                onClick={() => pause(offer.id)}
                className="h-7 px-3 bg-amber-500/10 text-amber-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5 relative overflow-hidden"
              >
                <RefreshCcw className={`size-2.5 animate-spin ${!pausing ? 'hidden' : 'block'}`} />
                <Pause className={`size-2.5 ${pausing ? 'hidden' : 'block'}`} />
                <span>Pausar</span>
              </button>
            ) : offer.status === 'paused' ? (
              <button
                disabled={resuming}
                onClick={() => resume(offer.id)}
                className="h-7 px-3 bg-emerald-500/10 text-emerald-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5 relative overflow-hidden"
              >
                <RefreshCcw className={`size-2.5 animate-spin ${!resuming ? 'hidden' : 'block'}`} />
                <Play className={`size-2.5 ${resuming ? 'hidden' : 'block'}`} />
                <span>Retomar</span>
              </button>
            ) : null}
            <button
              disabled={closing}
              onClick={() => close(offer.id)}
              className="h-7 px-3 bg-red-500/10 text-red-400 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5 relative overflow-hidden"
            >
              <RefreshCcw className={`size-2.5 animate-spin ${!closing ? 'hidden' : 'block'}`} />
              <X className={`size-2.5 ${closing ? 'hidden' : 'block'}`} />
              <span>Encerrar</span>
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-wrap gap-4 items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        <span>
          <span className="text-slate-900 dark:text-white">{Number(offer.give_amount).toLocaleString('pt-AO')}</span>{' '}
          {offer.give_currency.code}
        </span>
        <ArrowRightLeft className="size-3 text-primary/40" />
        <span>
          <span className="text-primary">{Number(offer.want_amount).toLocaleString('pt-AO')}</span>{' '}
          {offer.want_currency.code}
        </span>
        <span className="ml-auto opacity-60">Taxa: 1 {offer.give_currency.code} = {rate}</span>
      </div>

      {/* Expandir Interesses */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 border-t border-slate-50 dark:border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Users className="size-3.5" /> Ver Propostas / Interesses
        </span>
        {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <InterestsList offerId={offer.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const MinhasOfertasPage: React.FC = () => {
  const { data: offers, isLoading } = useMyOffers();

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold leading-tight tracking-tight uppercase">
            Minhas <span className="text-primary italic">Ofertas</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-[9px] uppercase tracking-widest opacity-80">
            Gira as tuas ofertas P2P publicadas.
          </p>
        </div>
        <Link
          to={APP_ROUTES.P2P_POST}
          className="flex items-center justify-center gap-2 bg-primary text-white font-bold uppercase text-[10px] tracking-widest px-6 h-10 rounded-lg hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
        >
          <PlusCircle className="size-3.5" />
          Nova Oferta
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !offers || offers.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
          <ArrowRightLeft className="size-10 text-slate-200 dark:text-white/10 mb-4" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Sem ofertas</h3>
          <p className="text-[9px] text-slate-400 font-medium mt-1 opacity-60">
            Ainda não publicaste nenhuma oferta.
          </p>
          <Link
            to={APP_ROUTES.P2P_POST}
            className="mt-5 flex items-center gap-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-4 h-9 rounded-lg hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
          >
            <PlusCircle className="size-3" /> Criar Primeira Oferta
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {(offers as Offer[]).map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MinhasOfertasPage;
