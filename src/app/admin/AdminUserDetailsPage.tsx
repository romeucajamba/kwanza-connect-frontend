import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useAdminUserDetails, useVerifyKYC, useUpdateUserStatus,
  useAdminSuspendUser, useAdminLiftSuspension, useAdminDeleteUser,
} from '@/services/admin.hooks';
import {
  ShieldCheck, ShieldAlert, Ban, CheckCircle2, AlertTriangle,
  ArrowLeft, Trash2, Clock, ShieldOff, PlayCircle,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getAvatarUrl } from '@/lib/media';
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ── Tipos de duração ────────────────────────────────────────────────────────
const SUSPENSION_OPTIONS: { label: string; days: 1 | 2 | 3 | 4 | 7 }[] = [
  { label: '1 dia', days: 1 },
  { label: '2 dias', days: 2 },
  { label: '3 dias', days: 3 },
  { label: '4 dias', days: 4 },
  { label: '1 semana', days: 7 },
];

// ── Modal de confirmação genérico ───────────────────────────────────────────
const ConfirmModal: React.FC<{
  title: string;
  message: string;
  confirmLabel: string;
  confirmClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}> = ({ title, message, confirmLabel, confirmClass = 'bg-red-500 text-white', onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="bg-white dark:bg-[#111922] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 w-full max-w-md p-6 space-y-4">
      <h3 className="text-base font-black text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500">{message}</p>
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
        >Cancelar</button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 ${confirmClass}`}
        >{loading ? 'A processar…' : confirmLabel}</button>
      </div>
    </div>
  </div>
);

// ── Página principal ────────────────────────────────────────────────────────
const AdminUserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading } = useAdminUserDetails(id!);

  const { mutate: updateKyc, isPending: isKycPending } = useVerifyKYC();
  const { mutate: updateStatus, isPending: isBlocking } = useUpdateUserStatus();
  const { mutate: suspendUser, isPending: isSuspending } = useAdminSuspendUser();
  const { mutate: liftSuspension, isPending: isLifting } = useAdminLiftSuspension();
  const { mutate: deleteUser, isPending: isDeleting } = useAdminDeleteUser();

  const [rejectReason, setRejectReason] = useState('');
  const [suspendDays, setSuspendDays] = useState<1 | 2 | 3 | 4 | 7>(1);
  const [confirm, setConfirm] = useState<'block' | 'delete' | 'suspend' | null>(null);

  if (isLoading) return (
    <div className="flex justify-center items-center py-24">
      <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return (
    <div className="p-12 text-center text-slate-500 font-bold">Utilizador não encontrado.</div>
  );

  const doc = user.identity_document;

  // ── Estado de suspensão ──
  const isSuspended = !!user.suspended_until && !isPast(new Date(user.suspended_until));
  const isBlocked = !user.is_active;

  const accountStatusBadge = () => {
    if (isBlocked) return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500">
        <Ban className="size-3" /> Bloqueado
      </span>
    );
    if (isSuspended) return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500">
        <Clock className="size-3" />
        Suspenso até {format(new Date(user.suspended_until!), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500">
        <CheckCircle2 className="size-3" /> Activo
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Confirm modals */}
      {confirm === 'block' && (
        <ConfirmModal
          title="Bloquear conta"
          message={`${user.full_name} não conseguirá fazer login. A conta continuará a existir e pode ser desbloqueada a qualquer momento.`}
          confirmLabel="Bloquear"
          onConfirm={() => { updateStatus({ userId: user.id, action: 'block' }); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
          loading={isBlocking}
        />
      )}
      {confirm === 'delete' && (
        <ConfirmModal
          title="Eliminar conta permanentemente"
          message={`Esta ação é irreversível. A conta de ${user.full_name} será removida definitivamente da base de dados.`}
          confirmLabel="Eliminar definitivamente"
          onConfirm={() => { deleteUser(user.id); setConfirm(null); navigate('/admin/users'); }}
          onCancel={() => setConfirm(null)}
          loading={isDeleting}
        />
      )}
      {confirm === 'suspend' && (
        <ConfirmModal
          title={`Suspender por ${SUSPENSION_OPTIONS.find(o => o.days === suspendDays)?.label}`}
          message={`${user.full_name} poderá fazer login mas perderá acesso às trocas P2P, chat, conversão, câmbio, histórico, ofertas e interesses durante esse período.`}
          confirmLabel="Suspender"
          confirmClass="bg-amber-500 text-white"
          onConfirm={() => { suspendUser({ userId: user.id, days: suspendDays }); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
          loading={isSuspending}
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/users')}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Detalhes do Utilizador</h1>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">{user.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Info + Moderação ─────────────────────────────────── */}
        <div className="bg-white dark:bg-[#111922] p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm space-y-6">

          {/* Avatar + nome */}
          <div className="flex items-center gap-4">
            <Avatar className="size-16 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm bg-primary/10">
              <AvatarImage src={getAvatarUrl(user.avatar, user.full_name)} className="rounded-2xl" />
              <AvatarFallback className="rounded-2xl bg-transparent">
                <span className="text-primary font-black text-2xl">{user.full_name.charAt(0)}</span>
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">{user.full_name}</h2>
              {user.username && (
                <p className="text-sm font-medium text-primary mt-0.5 truncate">@{user.username}</p>
              )}
              <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
              <div className="mt-1.5">{accountStatusBadge()}</div>
            </div>
          </div>

          {/* Dados básicos */}
          <div className="space-y-3 pt-5 border-t border-slate-100 dark:border-white/5">
            {[
              { label: 'Telefone', value: user.phone },
              { label: 'Província', value: user.province },
              { label: 'Município', value: user.municipality },
              { label: 'Bairro/Rua', value: user.neighborhood },
              { label: 'Ocupação', value: user.occupation },
              { label: 'Moeda (Oferece)', value: user.preferred_give_currency },
              { label: 'Moeda (Precisa)', value: user.preferred_want_currency },
              { label: 'Registo', value: new Date(user.date_joined).toLocaleDateString('pt-AO') },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">{label}</span>
                <span className="text-slate-900 dark:text-white font-medium text-right">{value || '—'}</span>
              </div>
            ))}
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="pt-4 border-t border-slate-100 dark:border-white/5">
              <span className="text-slate-500 font-bold text-sm block mb-2">Biografia</span>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{user.bio}</p>
            </div>
          )}

          {/* ── MODERAÇÃO ───────────────────────────────────────── */}
          <div className="pt-5 border-t border-slate-100 dark:border-white/5 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Moderação da Conta</h3>

            {/* Suspensão */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                <Clock className="size-3" /> Suspensão de Acesso
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                O utilizador pode fazer login mas perde acesso a: Trocas P2P, Chat, Conversão, Câmbio, Histórico, Ofertas, Interesses.
              </p>

              {isSuspended ? (
                // botão de terminar suspensão
                <button
                  onClick={() => liftSuspension(user.id)}
                  disabled={isLifting}
                  className="w-full py-2.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <PlayCircle className="size-4" />
                  {isLifting ? 'A processar…' : 'Terminar Suspensão'}
                </button>
              ) : (
                // selector de duração + botão suspender
                <div className="flex gap-2">
                  <select
                    value={suspendDays}
                    onChange={(e) => setSuspendDays(Number(e.target.value) as 1 | 2 | 3 | 4 | 7)}
                    className="flex-1 bg-white dark:bg-[#0d1520] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-amber-500/50"
                  >
                    {SUSPENSION_OPTIONS.map(opt => (
                      <option key={opt.days} value={opt.days}>{opt.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setConfirm('suspend')}
                    disabled={isSuspending || isBlocked}
                    className="px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors disabled:opacity-40 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Clock className="size-4" /> Suspender
                  </button>
                </div>
              )}
            </div>

            {/* Bloqueio */}
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1.5">
                <Ban className="size-3" /> Bloqueio de Conta
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                O utilizador não consegue fazer login. A conta continuará a existir até ser desbloqueada.
              </p>
              {isBlocked ? (
                <button
                  onClick={() => updateStatus({ userId: user.id, action: 'unblock' })}
                  disabled={isBlocking}
                  className="w-full py-2.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldOff className="size-4" />
                  {isBlocking ? 'A processar…' : 'Desbloquear Conta'}
                </button>
              ) : (
                <button
                  onClick={() => setConfirm('block')}
                  disabled={isBlocking}
                  className="w-full py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Ban className="size-4" /> Bloquear Conta
                </button>
              )}
            </div>

            {/* Eliminação */}
            <div className="rounded-xl border border-slate-200 dark:border-white/10 p-4 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Trash2 className="size-3" /> Eliminação Permanente
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Remove a conta definitivamente da base de dados. Ação irreversível.
              </p>
              <button
                onClick={() => setConfirm('delete')}
                disabled={isDeleting}
                className="w-full py-2.5 bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-red-500 hover:text-white transition-colors rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="size-4" /> Eliminar Conta
              </button>
            </div>
          </div>
        </div>

        {/* ── KYC Card ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111922] p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Verificação de Identidade (KYC)</h3>
            <div>
              {user.verification_status === 'approved' && (
                <span className="text-emerald-500 font-black uppercase text-[10px] tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1.5"><ShieldCheck className="size-3" /> Aprovado</span>
              )}
              {user.verification_status === 'pending' && (
                <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full">Pendente Envio</span>
              )}
              {user.verification_status === 'submitted' && (
                <span className="text-amber-500 font-black uppercase text-[10px] tracking-widest bg-amber-500/10 px-3 py-1 rounded-full flex items-center gap-1.5"><ShieldAlert className="size-3" /> Em Análise</span>
              )}
              {user.verification_status === 'rejected' && (
                <span className="text-red-500 font-black uppercase text-[10px] tracking-widest bg-red-500/10 px-3 py-1 rounded-full flex items-center gap-1.5"><AlertTriangle className="size-3" /> Rejeitado</span>
              )}
            </div>
          </div>

          {!doc ? (
            <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-[#0b1117] rounded-xl border border-dashed border-slate-200 dark:border-white/10">
              <ShieldAlert className="size-8 text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-500">Nenhum documento submetido ainda.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-[#0b1117] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tipo de Documento</span>
                  <span className="font-bold text-sm uppercase">{doc.doc_type === 'bi' ? 'Bilhete de Identidade' : doc.doc_type}</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-[#0b1117] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Número do Documento</span>
                  <span className="font-bold text-sm uppercase">{doc.doc_number}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Parte Frontal', url: doc.front_image_url, alt: 'Frente BI' },
                  { label: 'Parte Traseira', url: doc.back_image_url, alt: 'Trás BI' },
                ].map(({ label, url, alt }) => (
                  <div key={label}>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</span>
                    <div className="aspect-[1.58] bg-slate-100 dark:bg-[#0b1117] rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 relative group">
                      {url ? (
                        <img src={url} alt={alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-slate-400">Não disponível</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {user.verification_status === 'submitted' && (
                <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Ação de Avaliação</h4>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <button
                      onClick={() => updateKyc({ userId: user.id, action: 'approve' })}
                      disabled={isKycPending}
                      className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >Aprovar Documento</button>

                    <div className="flex-1 flex gap-2 w-full">
                      <input
                        type="text"
                        placeholder="Motivo da rejeição (opcional)"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-[#0b1117] border border-slate-200 dark:border-white/10 px-4 rounded-xl text-sm outline-none focus:border-red-500/50"
                      />
                      <button
                        onClick={() => updateKyc({ userId: user.id, action: 'reject', reason: rejectReason })}
                        disabled={isKycPending}
                        className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                      >Rejeitar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailsPage;
