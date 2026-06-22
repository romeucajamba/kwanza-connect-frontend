import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminUserDetails, useVerifyKYC, useUpdateUserStatus } from '@/services/admin.hooks';
import { ShieldCheck, ShieldAlert, Ban, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

const AdminUserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading } = useAdminUserDetails(id!);
  const { mutate: updateKyc, isPending: isKycPending } = useVerifyKYC();
  const { mutate: updateStatus, isPending: isStatusPending } = useUpdateUserStatus();

  const [rejectReason, setRejectReason] = useState('');

  if (isLoading) return <div className="flex justify-center p-12"><span>Carregando detalhes...</span></div>;
  if (!user) return <div className="p-12 text-center"><span>Utilizador não encontrado.</span></div>;

  const doc = user.identity_document;

  return (
    <div className="space-y-6">
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
        
        {/* Info Card */}
        <div className="bg-white dark:bg-[#111922] p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-2xl">
              {user.full_name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{user.full_name}</h2>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-bold">Telefone</span>
              <span className="text-slate-900 dark:text-white font-medium">{user.phone || '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-bold">Data de Registo</span>
              <span className="text-slate-900 dark:text-white font-medium">{new Date(user.date_joined).toLocaleDateString('pt-AO')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-bold">Estado da Conta</span>
              {user.is_active ? (
                <span className="text-emerald-500 font-black uppercase text-[10px] tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">Activo</span>
              ) : (
                <span className="text-red-500 font-black uppercase text-[10px] tracking-widest bg-red-500/10 px-2 py-0.5 rounded">Bloqueado</span>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Ações de Conta</h3>
            {user.is_active ? (
              <button 
                onClick={() => updateStatus({ userId: user.id, action: 'block' })}
                disabled={isStatusPending}
                className="w-full py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <Ban className="size-4" /> Bloquear Utilizador
              </button>
            ) : (
              <button 
                onClick={() => updateStatus({ userId: user.id, action: 'unblock' })}
                disabled={isStatusPending}
                className="w-full py-2.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="size-4" /> Desbloquear Utilizador
              </button>
            )}
          </div>
        </div>

        {/* KYC Card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111922] p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Verificação de Identidade (KYC)</h3>
            <div>
              {user.verification_status === 'approved' && <span className="text-emerald-500 font-black uppercase text-[10px] tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1.5"><ShieldCheck className="size-3" /> Aprovado</span>}
              {user.verification_status === 'pending' && <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full">Pendente Envio</span>}
              {user.verification_status === 'submitted' && <span className="text-amber-500 font-black uppercase text-[10px] tracking-widest bg-amber-500/10 px-3 py-1 rounded-full flex items-center gap-1.5"><ShieldAlert className="size-3" /> Submetido / Em Análise</span>}
              {user.verification_status === 'rejected' && <span className="text-red-500 font-black uppercase text-[10px] tracking-widest bg-red-500/10 px-3 py-1 rounded-full flex items-center gap-1.5"><AlertTriangle className="size-3" /> Rejeitado</span>}
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
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Parte Frontal</span>
                  <div className="aspect-[1.58] bg-slate-100 dark:bg-[#0b1117] rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 relative group">
                    {doc.front_image ? (
                      <img src={`http://localhost:8000${doc.front_image}`} alt="Frente BI" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-slate-400">Não disponível</div>
                    )}
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Parte Traseira</span>
                  <div className="aspect-[1.58] bg-slate-100 dark:bg-[#0b1117] rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 relative group">
                    {doc.back_image ? (
                      <img src={`http://localhost:8000${doc.back_image}`} alt="Trás BI" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-slate-400">Não disponível</div>
                    )}
                  </div>
                </div>
              </div>

              {doc.status === 'pending' && (
                <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Ação de Avaliação</h4>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <button 
                      onClick={() => updateKyc({ userId: user.id, action: 'approve' })}
                      disabled={isKycPending}
                      className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      Aprovar Documento
                    </button>
                    
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
                        className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white transition-colors"
                      >
                        Rejeitar
                      </button>
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
