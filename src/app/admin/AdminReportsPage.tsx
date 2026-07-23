import React, { useState } from 'react';
import { useAdminReports, useAdminReportAction, useUpdateUserStatus, useAdminSuspendUser, useAdminDeleteUser, useAdminReportDetail, useAdminLiftSuspension } from '@/services/admin.hooks';
import {
    CheckCircle2, XCircle, AlertTriangle, Eye, X, MessageSquare,
    User as UserIcon, Ban, Clock, Trash2, ShieldCheck, ArrowRightLeft
} from 'lucide-react';
import { Pagination } from '@components/ui/Pagination';
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar';
import { getAvatarUrl } from '@lib/media';

// ─── Types ───────────────────────────────────────────────────────────────────

type MiniUser = { id: string; full_name: string; email: string; avatar?: string } | null;

type ReportRecord = {
    id: string;
    reporter: MiniUser;
    reported_to: MiniUser;
    reason: string;
    status: string;
    admin_notes: string;
    room_id: string | null;
    created_at: string;
};

type ConfirmAction =
    | { type: 'block'; userId: string; userName: string }
    | { type: 'suspend'; userId: string; userName: string; days: 1 | 2 | 3 | 4 | 7 }
    | { type: 'delete'; userId: string; userName: string }
    | null;

// Duration options for suspension
const SUSPENSION_OPTIONS: { label: string; days: 1 | 2 | 3 | 4 | 7 }[] = [
    { label: '1 dia', days: 1 },
    { label: '2 dias', days: 2 },
    { label: '3 dias', days: 3 },
    { label: '4 dias', days: 4 },
    { label: '1 semana', days: 7 },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────


// ─── Confirmation Modal ───────────────────────────────────────────────────────

const ConfirmActionModal = ({
    action,
    onConfirm,
    onCancel,
    isPending,
}: {
    action: ConfirmAction;
    onConfirm: () => void;
    onCancel: () => void;
    isPending: boolean;
}) => {
    if (!action) return null;

    const config = {
        block: {
            icon: <Ban className="size-6 text-rose-500" />,
            title: 'Bloquear Conta',
            desc: `Bloquear a conta de "${action.userName}" vai impedir o utilizador de fazer login e de aceder a qualquer funcionalidade da plataforma — imediatamente.`,
            confirmLabel: 'Confirmar Bloqueio',
            color: 'bg-rose-500 hover:bg-rose-600',
        },
        suspend: {
            icon: <Clock className="size-6 text-amber-500" />,
            title: `Suspender por ${action.type === 'suspend' ? SUSPENSION_OPTIONS.find(o => o.days === action.days)?.label : ''} `,
            desc: `"${action.userName}" poderá fazer login mas perderá acesso a: Trocas P2P, Chat, Conversão, Câmbio, Histórico, Ofertas e Interesses durante esse período.`,
            confirmLabel: 'Confirmar Suspensão',
            color: 'bg-amber-500 hover:bg-amber-600',
        },
        delete: {
            icon: <Trash2 className="size-6 text-red-600" />,
            title: 'Eliminar Conta',
            desc: `Esta ação é irreversível. A conta de "${action.userName}" será desativada e anonimizada. Todos os dados de acesso serão eliminados permanentemente.`,
            confirmLabel: 'Eliminar Definitivamente',
            color: 'bg-red-600 hover:bg-red-700',
        },
    }[action.type];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onCancel}>
            <div className="w-full max-w-md bg-white dark:bg-[#111922] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 p-6" onClick={e => e.stopPropagation()}>
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="size-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                        {config.icon}
                    </div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">{config.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{config.desc}</p>
                    <div className="flex gap-3 w-full pt-2">
                        <button
                            onClick={onCancel}
                            className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            disabled={isPending}
                            onClick={onConfirm}
                            className={`flex-1 h-10 rounded-xl text-white text-sm font-black disabled:opacity-50 transition-colors ${config.color}`}
                        >
                            {isPending ? 'A processar...' : config.confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Report Detail Modal ──────────────────────────────────────────────────────

const ReportDetailModal = ({
    report,
    onClose,
    onReportAction,
    isActing,
}: {
    report: ReportRecord;
    onClose: () => void;
    onReportAction: (action: 'review' | 'dismiss') => void;
    isActing: boolean;
}) => {
    const { data: detail, isLoading: loadingDetail } = useAdminReportDetail(report.id);
    const messages: any[] = detail?.messages ?? [];
    const transaction: any = detail?.transaction ?? null;
    const loadingMsgs = loadingDetail;
    const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
    const [suspendDays, setSuspendDays] = useState<1 | 2 | 3 | 4 | 7>(1);

    const { mutate: blockUser, isPending: isBlocking } = useUpdateUserStatus();
    const { mutate: suspendUser, isPending: isSuspending } = useAdminSuspendUser();
    const { mutate: deleteUser, isPending: isDeleting } = useAdminDeleteUser();
    const { mutate: liftSuspension, isPending: isLifting } = useAdminLiftSuspension();

    const isMutating = isBlocking || isSuspending || isDeleting || isLifting;

    const handleConfirm = () => {
        if (!confirmAction) return;
        const cb = { onSuccess: () => { setConfirmAction(null); onClose(); } };
        if (confirmAction.type === 'block') {
            blockUser({ userId: confirmAction.userId, action: 'block' }, cb);
        } else if (confirmAction.type === 'suspend') {
            suspendUser({ userId: confirmAction.userId, days: confirmAction.days }, cb);
        } else if (confirmAction.type === 'delete') {
            deleteUser(confirmAction.userId, cb);
        }
    };

    const reportedUser = report.reported_to;
    const reportedIsBlocked = reportedUser && detail?.reported_is_active === false;
    const reportedIsSuspended = reportedUser && detail?.reported_suspended_until && !isPast(new Date(detail.reported_suspended_until));

    return (
        <>
            {confirmAction && (
                <ConfirmActionModal
                    action={confirmAction}
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirmAction(null)}
                    isPending={isMutating}
                />
            )}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
                <div
                    className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-[#111922] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                <AlertTriangle className="size-4 text-rose-500" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Detalhes da Denúncia</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {format(new Date(report.created_at), "dd MMM yyyy, HH:mm", { locale: ptBR })}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center transition-colors">
                            <X className="size-4 text-slate-500" />
                        </button>
                    </div>

                    {/* Scrollable body */}
                    <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                        {/* Users involved */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Denunciante', user: report.reporter, color: 'text-primary', bg: 'bg-primary/5 border-primary/10' },
                                { label: 'Arguido (Reportado)', user: report.reported_to, color: 'text-rose-500', bg: 'bg-rose-500/5 border-rose-500/10' },
                            ].map(({ label, user, color, bg }) => (
                                <div key={label} className={`rounded-xl border p-4 ${bg}`}>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${color}`}>{label}</p>
                                    {user ? (
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-9">
                                                <AvatarImage src={getAvatarUrl(user.avatar)} />
                                                <AvatarFallback className="text-[11px] font-black bg-slate-200 dark:bg-white/10">
                                                    {user.full_name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <Link to={`/admin/users/${user.id}`} className={`text-xs font-black hover:underline ${color}`} onClick={onClose}>
                                                    {user.full_name}
                                                </Link>
                                                <p className="text-[10px] text-slate-400 font-bold">{user.email}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <UserIcon className="size-4" />
                                            <span className="text-xs font-bold">Utilizador removido</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Motivo */}
                        <div className="rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 p-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">Motivo da Denúncia</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{report.reason}</p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado:</span>
                            {report.status === 'pending' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500"><AlertTriangle className="size-3" /> Pendente</span>}
                            {report.status === 'reviewed' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="size-3" /> Verificado</span>}
                            {report.status === 'dismissed' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-slate-500/10 text-slate-500"><XCircle className="size-3" /> Ignorado</span>}
                        </div>

                        {/* Moderation Actions on the reported user */}
                        {reportedUser && (
                            <div className="rounded-xl border border-slate-100 dark:border-white/5 p-4 space-y-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <ShieldCheck className="size-4 text-slate-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Sanções sobre o Arguido
                                    </span>
                                </div>

                                {/* Suspensão — dropdown + botão */}
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Suspensão de acesso</p>
                                    {reportedIsSuspended ? (
                                        <button
                                            onClick={() => liftSuspension(reportedUser.id)}
                                            disabled={isLifting}
                                            className="w-full inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                        >
                                            <CheckCircle2 className="size-3" /> Terminar Suspensão
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <select
                                                value={suspendDays}
                                                onChange={(e) => setSuspendDays(Number(e.target.value) as 1 | 2 | 3 | 4 | 7)}
                                                className="flex-1 bg-white dark:bg-[#0d1520] border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-amber-500/50"
                                            >
                                                {SUSPENSION_OPTIONS.map(opt => (
                                                    <option key={opt.days} value={opt.days}>{opt.label}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => setConfirmAction({ type: 'suspend', userId: reportedUser.id, userName: reportedUser.full_name, days: suspendDays })}
                                                disabled={isMutating || reportedIsBlocked === true}
                                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase hover:bg-amber-500/20 transition-colors disabled:opacity-40"
                                            >
                                                <Clock className="size-3" /> Suspender
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Bloqueio */}
                                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Bloqueio de conta</p>
                                    {reportedIsBlocked ? (
                                        <button
                                            onClick={() => blockUser({ userId: reportedUser.id, action: 'unblock' })}
                                            disabled={isBlocking}
                                            className="w-full inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                        >
                                            <CheckCircle2 className="size-3" /> Desbloquear Conta
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setConfirmAction({ type: 'block', userId: reportedUser.id, userName: reportedUser.full_name })}
                                            disabled={isMutating}
                                            className="w-full inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                                        >
                                            <Ban className="size-3" /> Bloquear Conta
                                        </button>
                                    )}
                                </div>

                                {/* Eliminação */}
                                <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                                    <button
                                        onClick={() => setConfirmAction({ type: 'delete', userId: reportedUser.id, userName: reportedUser.full_name })}
                                        disabled={isMutating}
                                        className="w-full inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-red-600/10 text-red-600 text-[10px] font-black uppercase hover:bg-red-600/20 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 className="size-3" /> Eliminar Conta Permanentemente
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Chat messages */}
                        {report.room_id && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <MessageSquare className="size-4 text-slate-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Histórico da Conversa</span>
                                </div>
                                <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0d1520] overflow-hidden">
                                    {loadingMsgs ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    ) : messages && messages.length > 0 ? (
                                        <div className="flex flex-col gap-1 p-4 max-h-64 overflow-y-auto">
                                            {messages.map((msg: any) => {
                                                const isReporter = msg.sender?.id === report.reporter?.id;
                                                return (
                                                    <div key={msg.id} className={`flex flex-col gap-0.5 ${isReporter ? 'items-start' : 'items-end'}`}>
                                                        <div className={`flex items-center gap-1.5 ${isReporter ? 'flex-row' : 'flex-row-reverse'}`}>
                                                            <Avatar className="size-5">
                                                                <AvatarImage src={getAvatarUrl(msg.sender?.avatar)} />
                                                                <AvatarFallback className="text-[9px] bg-slate-200 dark:bg-white/10">
                                                                    {msg.sender?.full_name?.charAt(0)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-[10px] font-black text-slate-500">{msg.sender?.full_name}</span>
                                                        </div>
                                                        <div className={`max-w-[75%] px-3 py-2 rounded-xl text-xs ${isReporter
                                                            ? 'bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 rounded-tl-sm border border-slate-100 dark:border-white/5'
                                                            : 'bg-primary text-white rounded-tr-sm'
                                                            }`}>
                                                            {msg.content || <span className="italic opacity-50">[ficheiro]</span>}
                                                        </div>
                                                        <span className="text-[9px] text-slate-400 px-1">
                                                            {format(new Date(msg.created_at), 'dd/MM HH:mm')}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center py-8 text-xs text-slate-400 font-bold">
                                            Sem mensagens nesta conversa.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Transaction */}
                        {transaction && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <ArrowRightLeft className="size-4 text-slate-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transação Associada</span>
                                </div>
                                <div className="rounded-xl border border-slate-100 dark:border-white/5 p-4 space-y-3">
                                    {/* Amounts */}
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Deu</p>
                                            <p className="text-base font-black text-slate-800 dark:text-white">
                                                {parseFloat(transaction.give_amount).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                                                <span className="ml-1.5 text-xs font-bold text-slate-500">{transaction.give_currency?.code}</span>
                                            </p>
                                        </div>
                                        <ArrowRightLeft className="size-4 text-slate-300 shrink-0" />
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Recebeu</p>
                                            <p className="text-base font-black text-slate-800 dark:text-white">
                                                {parseFloat(transaction.want_amount).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                                                <span className="ml-1.5 text-xs font-bold text-slate-500">{transaction.want_currency?.code}</span>
                                            </p>
                                        </div>
                                    </div>
                                    {/* Participants + Status */}
                                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-1">Vendedor</p>
                                            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">{transaction.seller?.full_name ?? '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">Comprador</p>
                                            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">{transaction.buyer?.full_name ?? '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Estado</p>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${transaction.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                                transaction.status === 'disputed' ? 'bg-rose-500/10 text-rose-500' :
                                                    transaction.status === 'cancelled' ? 'bg-slate-500/10 text-slate-500' :
                                                        'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                {transaction.status === 'completed' ? 'Concluída' :
                                                    transaction.status === 'disputed' ? 'Em Disputa' :
                                                        transaction.status === 'cancelled' ? 'Cancelada' : 'Pendente'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400">
                                        {format(new Date(transaction.created_at), "dd MMM yyyy, HH:mm", { locale: ptBR })}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer — report resolution actions */}
                    {report.status === 'pending' && (
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                            <p className="text-[10px] text-slate-400 font-bold mr-auto uppercase tracking-widest">Resolução da denúncia:</p>
                            <button
                                disabled={isActing}
                                onClick={() => onReportAction('dismiss')}
                                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-slate-500/10 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-500/20 disabled:opacity-50 transition-colors"
                            >
                                <XCircle className="size-3.5" /> Ignorar
                            </button>
                            <button
                                disabled={isActing}
                                onClick={() => onReportAction('review')}
                                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                            >
                                <CheckCircle2 className="size-3.5" /> Marcar Resolvida
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminReportsPage: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
    const itemsPerPage = 10;

    const { data: reportsData, isLoading } = useAdminReports({ status: statusFilter });
    const { mutate: updateReportAction, isPending: isActing } = useAdminReportAction();

    React.useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    const allReports: ReportRecord[] = reportsData?.data || [];
    const totalPages = Math.ceil(allReports.length / itemsPerPage);
    const paginatedReports = allReports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleReportAction = (action: 'review' | 'dismiss') => {
        if (!selectedReport) return;
        updateReportAction({ reportId: selectedReport.id, action }, {
            onSuccess: () => setSelectedReport(null),
        });
    };

    return (
        <div className="space-y-6">
            {selectedReport && (
                <ReportDetailModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                    onReportAction={handleReportAction}
                    isActing={isActing}
                />
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Moderação</h1>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Gestão de Denúncias e Disputas</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"
                    >
                        <option value="">Estado (Todos)</option>
                        <option value="pending">Pendentes</option>
                        <option value="reviewed">Verificados / Sancionados</option>
                        <option value="dismissed">Ignorados</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-[#111922] border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Data</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Denunciante</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Arguido</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Motivo</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-sm text-slate-500">
                                        <span>Carregando queixas...</span>
                                    </td>
                                </tr>
                            ) : allReports.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-sm text-slate-500">
                                        <span>Nenhuma queixa encontrada.</span>
                                    </td>
                                </tr>
                            ) : (
                                paginatedReports.map((r) => (
                                    <tr key={r.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-300">
                                            {format(new Date(r.created_at), 'dd MMM yyyy, HH:mm', { locale: ptBR })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link to={`/admin/users/${r.reporter?.id}`} className="text-xs font-bold text-primary hover:underline">
                                                {r.reporter?.full_name ?? '—'}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link to={`/admin/users/${r.reported_to?.id}`} className="text-xs font-bold text-rose-500 hover:underline">
                                                {r.reported_to?.full_name ?? '—'}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                                            {r.reason}
                                        </td>
                                        <td className="px-6 py-4">
                                            {r.status === 'pending' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500"><AlertTriangle className="size-3" /> Pendente</span>}
                                            {r.status === 'reviewed' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="size-3" /> Verificado</span>}
                                            {r.status === 'dismissed' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-slate-500/10 text-slate-500"><XCircle className="size-3" /> Ignorado</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedReport(r)}
                                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                            >
                                                <Eye className="size-3" /> Ver Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {totalPages > 1 && (
                        <div className="border-t border-slate-100 dark:border-white/5 px-4 bg-white dark:bg-[#111922]">
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminReportsPage;
