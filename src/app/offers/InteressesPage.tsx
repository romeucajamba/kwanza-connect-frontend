import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightLeft,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Inbox,
  User as UserIcon
} from 'lucide-react';
import { useMyInterests, useCancelInterest } from '@/services/offers.hooks';
import { getAvatarUrl } from '@/lib/media';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { OfferInterest } from '@/types';

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusMap: Record<
  OfferInterest['status'],
  { icon: React.ElementType; cls: string; label: string }
> = {
  pending:   { icon: Clock,        cls: 'text-amber-500 bg-amber-500/10',     label: 'Aguarda Resposta' },
  accepted:  { icon: CheckCircle2, cls: 'text-emerald-500 bg-emerald-500/10', label: 'Aceite — Chat Criado' },
  rejected:  { icon: XCircle,      cls: 'text-red-400 bg-red-500/10',         label: 'Rejeitado' },
  cancelled: { icon: XCircle,      cls: 'text-slate-400 bg-slate-100 dark:bg-white/5', label: 'Cancelado' },
};

const StatusPill = ({ status }: { status: OfferInterest['status'] }) => {
  const { icon: Icon, cls, label } = statusMap[status] ?? statusMap.pending;
  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${cls}`}>
      <Icon className="size-3" /> {label}
    </span>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const InteressesPage: React.FC = () => {
  const { data: interests, isLoading } = useMyInterests();
  const { mutate: cancel, isPending: cancelling, variables: cancellingId } = useCancelInterest();

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Header */}
      <div className="flex flex-col">
        <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold leading-tight tracking-tight uppercase">
          Meus <span className="text-primary italic">Interesses</span>
        </h1>
        <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-[9px] uppercase tracking-widest opacity-80">
          Propostas que enviaste a ofertas de outros utilizadores.
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !interests || interests.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
          <Inbox className="size-10 text-slate-200 dark:text-white/10 mb-4" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            Nenhum interesse enviado
          </h3>
          <p className="text-[9px] text-slate-400 font-medium mt-1 opacity-60">
            Explora o mercado e manifesta interesse em ofertas disponíveis.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {(interests as OfferInterest[]).map((interest, i) => {
            const isCancellingThis = cancelling && cancellingId === interest.id;
            const canCancel = interest.status === 'pending';

            return (
              <motion.div
                key={interest.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="size-11 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden bg-slate-50 dark:bg-white/5">
                    <AvatarImage src={getAvatarUrl(interest.offer?.owner?.avatar, interest.offer?.owner?.full_name)} />
                    <AvatarFallback className="rounded-xl">
                      <UserIcon className="size-5 text-slate-400" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-primary/10 border-2 border-white dark:border-[#192633] flex items-center justify-center text-primary">
                    <ArrowRightLeft className="size-2.5" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {interest.offer?.owner?.full_name || 'Utilizador'} • #{interest.id.slice(0, 8)}
                    </span>
                    <StatusPill status={interest.status} />
                  </div>
                  {interest.message && (
                    <p className="text-[9px] text-slate-400 font-medium truncate max-w-xs">
                      "{interest.message}"
                    </p>
                  )}
                  <p className="text-[8px] text-slate-400 mt-1 uppercase tracking-widest opacity-60">
                    {new Date(interest.created_at).toLocaleString('pt-AO')}
                  </p>
                </div>

                {/* Cancel */}
                {canCancel && (
                  <button
                    disabled={isCancellingThis}
                    onClick={() => cancel(interest.id)}
                    className="h-8 px-4 bg-red-500/10 text-red-400 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0"
                  >
                    {isCancellingThis ? (
                      <RefreshCcw className="size-3 animate-spin" />
                    ) : (
                      <XCircle className="size-3" />
                    )}
                    Cancelar
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InteressesPage;
