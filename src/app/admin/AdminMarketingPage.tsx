import React, { useState } from 'react';
import { Megaphone, Mail, PlayCircle, Loader2, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSendBroadcast, useAdminSubscribers } from '@/services/admin.hooks';
import toast from 'react-hot-toast';

const AdminMarketingPage: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [targetAudience, setTargetAudience] = useState<'all' | 'specific'>('all');
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

    const { mutate: sendBroadcast, isPending } = useSendBroadcast();
    const { data: subscribersData, isLoading: isLoadingSubscribers } = useAdminSubscribers();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!subject.trim() || !content.trim()) {
            toast.error('Preencha o assunto e o corpo do e-mail.');
            return;
        }

        if (targetAudience === 'specific' && selectedEmails.length === 0) {
            toast.error('Selecione ao menos um destinatário.');
            return;
        }

        const payload: any = { subject, content, target_audience: targetAudience };
        if (targetAudience === 'specific') {
            payload.specific_emails = selectedEmails;
        }

        sendBroadcast(
            payload,
            {
                onSuccess: () => {
                    toast.success('Campanha enviada com sucesso para a fila de disparo!');
                    setSubject('');
                    setContent('');
                    setSelectedEmails([]);
                },
                onError: (err: any) => {
                    console.error(err);
                    toast.error('Ocorreu um erro ao disparar a campanha.');
                },
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                        <Megaphone className="size-6 text-primary" />
                        Marketing & Anúncios
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Crie campanhas e envie comunicados a todos os subscritores e utilizadores da KwanzaConnect, ou selecione manualmente a lista de e-mails.
                    </p>
                </div>
            </div>

            {/* Main Container Layer (Glassmorphism) */}
            <div className="glass-card rounded-3xl p-6 sm:p-10 border border-border-subtle relative overflow-hidden bg-white/50 dark:bg-[#111922]/50 shadow-sm">

                {/* BG Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] pointer-events-none rounded-full" />

                <form onSubmit={handleSubmit} className="relative z-10 max-w-4xl mx-auto space-y-8">

                    <div className="space-y-2">
                        <label htmlFor="subject" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                            Assunto do E-mail
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                            <input
                                id="subject"
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Exemplo: Novas Ofertas Disponíveis no KwanzaConnect!"
                                disabled={isPending}
                                className="w-full h-14 pl-11 pr-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400 disabled:opacity-60"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                            Corpo do Anúncio (Texto)
                        </label>
                        <div className="relative">
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Escreva a novidade ou comunicado oficial para os subscritores..."
                                disabled={isPending}
                                rows={10}
                                className="w-full p-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400 disabled:opacity-60 resize-none font-medium text-sm leading-relaxed"
                                required
                            />
                        </div>
                        <p className="text-xs text-slate-400 font-medium ml-1">
                            * A mensagem chegará ao e-mail dos destinatários exatamente como foi redigida, acrescida da assinatura KwanzaConnect.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                            Público Alvo
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="targetAudience"
                                    value="all"
                                    checked={targetAudience === 'all'}
                                    onChange={() => setTargetAudience('all')}
                                    className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                                />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Todos os Subscritores & Utilizadores</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="targetAudience"
                                    value="specific"
                                    checked={targetAudience === 'specific'}
                                    onChange={() => setTargetAudience('specific')}
                                    className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                                />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Destinatários Específicos</span>
                            </label>
                        </div>

                        <AnimatePresence>
                            {targetAudience === 'specific' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex flex-col gap-3 mt-4 p-5 rounded-2xl bg-white dark:bg-[#111922] border border-slate-200 dark:border-white/10 shadow-inner">
                                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <CheckSquare className="size-4 text-primary" />
                                                Selecione os Destinatários ({selectedEmails.length}/{subscribersData?.length || 0})
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedEmails(subscribersData?.map((s: any) => s.email) || [])}
                                                    className="text-xs font-bold text-primary hover:underline uppercase"
                                                >
                                                    Todos
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedEmails([])}
                                                    className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white uppercase transition-colors"
                                                >
                                                    Limpar
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                            {isLoadingSubscribers ? (
                                                <div className="flex justify-center p-4"><Loader2 className="size-5 animate-spin text-slate-400" /></div>
                                            ) : (subscribersData || []).length > 0 ? (
                                                (subscribersData || []).map((sub: any) => (
                                                    <label key={sub.email} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-white/5">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedEmails.includes(sub.email)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) setSelectedEmails(prev => [...prev, sub.email]);
                                                                else setSelectedEmails(prev => prev.filter(email => email !== sub.email));
                                                            }}
                                                            className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 bg-white dark:bg-[#0b1117] transition-all"
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-slate-700 dark:text-gray-200 leading-none">{sub.email}</span>
                                                            <span className="text-[10px] font-black uppercase tracking-widest mt-1 text-slate-400">
                                                                {sub.type === 'user' ? 'Utilizador Registado' : 'Lead (Newsletter)'}
                                                            </span>
                                                        </div>
                                                    </label>
                                                ))
                                            ) : (
                                                <p className="text-sm text-slate-400 p-4 text-center">Nenhum e-mail encontrado na base de dados.</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-white/10">
                        <motion.button
                            whileTap={isPending ? {} : { scale: 0.98 }}
                            type="submit"
                            disabled={isPending}
                            className="h-14 px-10 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-black rounded-xl shadow-[0_0_20px_rgba(253,185,19,0.2)] hover:shadow-[0_0_30px_rgba(253,185,19,0.4)] transition-all flex items-center gap-3 uppercase tracking-wider text-sm"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    A Disparar...
                                </>
                            ) : (
                                <>
                                    <PlayCircle className="size-5" />
                                    Enviar Disparo em Massa
                                </>
                            )}
                        </motion.button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AdminMarketingPage;
