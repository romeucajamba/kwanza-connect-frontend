import React, { useMemo, useState, useRef } from 'react';
import { 
  ShieldCheck,
  Settings,
  Award,
  Edit3,
  Camera,
  User,
  Clock,
  AlertCircle,
  Star,
  MessageSquare,
  Loader2,
  X,
  Globe,
  Activity,
  Briefcase,
  MapPin,
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransactions, useUserReviews } from '@services/transactions.hooks';
import { useUpdateProfile, useUpdateAvatar, useSubmitKYC } from '@services/auth.hooks';
import { useCurrencies } from '@services/rates.hooks';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { useForm } from 'react-hook-form';
import { getAvatarUrl } from '@lib/media';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const PerfilPage: React.FC = () => {
  const { id: profileId } = useParams<{ id: string }>();
  const currentUser = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  
  // Se houver um ID na URL, visualizamos o perfil de outro, caso contrário, o nosso
  const isOwnProfile = !profileId || profileId === currentUser?.id;
  const targetUserId = profileId || currentUser?.id || '';

  const { data: transactions } = useTransactions();
  const { data: reviews, isLoading: isLoadingReviews } = useUserReviews(targetUserId);
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutate: updateAvatar, isPending: isUpdatingAvatar } = useUpdateAvatar();
  const { mutate: submitKYC, isPending: isSubmittingKYC } = useSubmitKYC();

  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [kycDocs, setKycDocs] = useState<{ front: File | null, back: File | null }>({ front: null, back: null });

  const { data: currencies } = useCurrencies();
  const user = isOwnProfile ? currentUser : null; // Nota: Em prod, buscaríamos os dados do user alvo via hook

  const { register, handleSubmit, reset } = useForm({
    values: {
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      city: user?.city || '',
      bio: user?.bio || '',
      occupation: user?.occupation || '',
      is_available: user?.is_available || false,
      preferred_give_currency: user?.preferred_give_currency || 'AOA',
      preferred_want_currency: user?.preferred_want_currency || 'USD',
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    if (!transactions) return { count: 0, volume: 0, rating: 0 };
    const completed = transactions.filter((tx: any) => tx.status === 'completed');
    const volume = completed.reduce((acc: number, tx: any) => acc + Number(tx.give_amount || 0), 0);
    
    const avgRating = reviews && reviews.length > 0
      ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length
      : 0;

    return { count: completed.length, volume, rating: avgRating };
  }, [transactions, reviews]);

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatar(file);
    }
  };

  const onSubmit = (data: any) => {
    updateProfile(data);
  };

  const handleKYCSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      doc_type: formData.get('doc_type'),
      doc_number: formData.get('doc_number'),
      front_image: kycDocs.front,
      back_image: kycDocs.back,
    };

    if (!data.front_image || !data.back_image) {
      return; 
    }

    submitKYC(data, {
      onSuccess: () => {
        setIsKYCModalOpen(false);
        setKycDocs({ front: null, back: null });
      }
    });
  };


  const avatarUrl = getAvatarUrl(user?.avatar, user?.email);

  return (
    <div className="w-full mx-auto max-w-7xl pb-12">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black tracking-tighter">Meu Perfil</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base font-normal">Veja e atualize suas informações pessoais e status de verificação.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Left Column: Avatar & KYC */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="flex flex-col gap-4 items-center text-center p-8 bg-white dark:bg-[#192633] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
              
              <div className="relative group">
                <Avatar className={`size-32 border-4 border-white dark:border-[#111922] shadow-xl ${isUpdatingAvatar ? 'opacity-50' : ''}`}>
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-3xl bg-slate-100 dark:bg-slate-800">
                    <User className="size-16 text-slate-400" />
                  </AvatarFallback>
                </Avatar>
                {isUpdatingAvatar && (
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="size-6 text-primary animate-spin" />
                   </div>
                )}
                <input 
                  type="file" ref={fileInputRef} onChange={onAvatarChange} 
                  accept="image/*" className="hidden" 
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-primary hover:bg-primary/90 text-white rounded-full p-2.5 shadow-lg transition-transform hover:scale-110 border-2 border-white dark:border-[#192633]"
                >
                  <Camera className="size-5" />
                </button>
              </div>

              <div className="flex flex-col justify-center items-center gap-1 mt-2">
                <p className="text-gray-900 dark:text-white text-xl font-bold tracking-tight">{user?.full_name}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{user?.email}</p>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 mt-3 transition-colors"
                >
                  Alterar Foto
                </button>
              </div>
            </div>

            {/* KYC Status Card */}
            <div className={`flex flex-col p-6 rounded-xl border relative overflow-hidden shadow-sm ${
              user?.verification_status === 'approved' 
              ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20' 
              : user?.verification_status === 'submitted'
              ? 'bg-amber-50/50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20'
              : 'bg-rose-50/50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/20'
            }`}>
              <div className={`absolute top-0 left-0 w-1.5 h-full ${
                user?.verification_status === 'approved' ? 'bg-emerald-500' : user?.verification_status === 'submitted' ? 'bg-amber-500' : 'bg-rose-500'
              }`} />
              
              <div className="flex items-center justify-between mb-4 pl-2">
                <h2 className="text-gray-900 dark:text-white text-lg font-bold tracking-tight">Verificação KYC</h2>
                {user?.verification_status === 'approved' ? (
                  <ShieldCheck className="size-5 text-emerald-500" />
                ) : user?.verification_status === 'submitted' ? (
                  <Clock className="size-5 text-amber-500" />
                ) : (
                  <AlertCircle className="size-5 text-rose-500" />
                )}
              </div>

              <div className="flex flex-col gap-4 pl-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 dark:text-gray-400">Status Atual</span>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center justify-center size-2.5 rounded-full animate-pulse ${
                      user?.verification_status === 'approved' ? 'bg-emerald-500' : user?.verification_status === 'submitted' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                    <p className={`text-lg font-black uppercase tracking-tight ${
                      user?.verification_status === 'approved' ? 'text-emerald-500' : user?.verification_status === 'submitted' ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {user?.verification_status === 'approved' ? 'Aprovado' : user?.verification_status === 'submitted' ? 'Em Análise' : 'Pendente'}
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${
                  user?.verification_status === 'approved' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300' 
                  : user?.verification_status === 'submitted'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300'
                }`}>
                  <p className="text-sm font-medium leading-relaxed">
                    {user?.verification_status === 'approved' 
                      ? 'Parabéns! Sua conta está totalmente verificada e você tem acesso a todos os limites.'
                      : user?.verification_status === 'submitted'
                      ? 'Seus documentos estão sendo revisados pela nossa equipe de compliance.'
                      : 'Para realizar transações maiores e ter mais segurança, por favor complete sua verificação KYC.'}
                  </p>
                  {user?.verification_status === 'submitted' && (
                    <div className="flex items-center gap-2 text-xs font-bold mt-3 opacity-80 uppercase tracking-widest">
                      <Clock className="size-3.5" />
                      <span>Estimativa: 24 a 48 horas úteis</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-white/10 pt-4 mt-2 flex flex-col gap-2">
                   {user?.verification_status !== 'approved' && user?.verification_status !== 'submitted' && (
                     <button 
                       onClick={() => setIsKYCModalOpen(true)}
                       className="w-full flex items-center justify-center gap-2 h-10 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                     >
                       <ShieldCheck className="size-4" />
                       Verificar Documentos
                     </button>
                   )}
                   <button 
                     onClick={() => navigate('/settings')}
                     className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-primary transition-all uppercase tracking-widest px-2"
                   >
                     <Settings className="size-3.5" />
                     Gerir Segurança
                   </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Forms */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="flex flex-col p-8 bg-white dark:bg-[#192633] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm relative">
               <h2 className="text-gray-900 dark:text-white text-xl font-bold tracking-tight mb-8">Informações Pessoais</h2>
               
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2.5 ml-1">Nome Completo</label>
                    <div className="relative group">
                      <input 
                        {...register('full_name')}
                        className="w-full bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-white transition-all focus:border-primary/50 outline-none" 
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Edit3 className="size-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2.5 ml-1">Endereço de E-mail</label>
                    <div className="relative group">
                      <input 
                        readOnly disabled
                        className="w-full bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-white opacity-40 cursor-not-allowed" 
                        value={user?.email} 
                      />
                    </div>
                    <p className="text-[9px] text-primary font-black uppercase tracking-widest mt-2 ml-1 flex items-center gap-1.5 opacity-80">
                      <ShieldCheck className="size-3" />
                      E-mail Verificado
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2.5 ml-1">Número de Telefone</label>
                    <div className="relative group">
                      <input 
                        {...register('phone')}
                        className="w-full bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-white transition-all focus:border-primary/50 outline-none" 
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Edit3 className="size-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2.5 ml-1">Cidade</label>
                    <div className="relative group">
                      <input 
                        {...register('city')}
                        className="w-full bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-white transition-all focus:border-primary/50 outline-none" 
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <MapPin className="size-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2.5 ml-1">Ocupação / Profissão</label>
                    <div className="relative group">
                      <input 
                        {...register('occupation')}
                        className="w-full bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-white transition-all focus:border-primary/50 outline-none" 
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Briefcase className="size-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2.5 ml-1">Moeda que Costumo Ter</label>
                    <select 
                      {...register('preferred_give_currency')}
                      className="w-full bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none appearance-none"
                    >
                      {Array.isArray(currencies) && currencies.map((c: any) => (
                        <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2.5 ml-1">Moeda que Costumo Precisar</label>
                    <select 
                      {...register('preferred_want_currency')}
                      className="w-full bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none appearance-none"
                    >
                      {Array.isArray(currencies) && currencies.map((c: any) => (
                        <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2.5 ml-1">Sobre Mim (Biografia)</label>
                    <textarea 
                      {...register('bio')}
                      rows={4}
                      className="w-full bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm font-medium text-slate-900 dark:text-white transition-all focus:border-primary/50 outline-none resize-none"
                      placeholder="Conte um pouco sobre suas experiências em trocas P2P..."
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-xl">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Status de Disponibilidade</p>
                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Indique se está pronto para aceitar novas propostas agora.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        {...register('is_available')}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                    </label>
                  </div>

                  <div className="sm:col-span-2 pt-6 mt-2 border-t border-slate-100 dark:border-white/5">
                    <div className="bg-slate-50 dark:bg-[#111922] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <Award className="size-6" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Performance e Histórico</p>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                   <Star key={s} className={`size-3 ${stats.rating >= s ? 'fill-amber-500 text-amber-500' : 'text-slate-200 dark:text-white/10'}`} />
                                ))}
                             </div>
                             <span className="text-xs font-bold text-slate-900 dark:text-white">{stats.rating.toFixed(1)}</span>
                             <span className="text-slate-200 dark:text-white/10">•</span>
                             <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Baseado em {stats.count} operações.</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                         <p className="text-2xl font-black text-primary uppercase tracking-tighter">{stats.rating >= 4.5 ? 'Elite' : user?.is_verified ? 'Verificado' : 'Novato'}</p>
                         <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1">Status da Rede</p>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Section */}
                  <div className="sm:col-span-2 mt-4">
                     <h3 className="text-gray-900 dark:text-white text-lg font-bold tracking-tight mb-6 flex items-center gap-2">
                        <MessageSquare className="size-5 text-primary" />
                        Avaliações dos Parceiros
                     </h3>
                     
                     {isLoadingReviews ? (
                        <div className="flex justify-center p-10">
                           <Loader2 className="size-6 text-primary animate-spin" />
                        </div>
                     ) : reviews && reviews.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                           {reviews.map((review: any) => (
                              <div key={review.id} className="p-5 bg-slate-50/50 dark:bg-[#111922]/50 border border-slate-100 dark:border-white/5 rounded-2xl">
                                 <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-1">
                                       {[1, 2, 3, 4, 5].map((s) => (
                                          <Star key={s} className={`size-2.5 ${review.rating >= s ? 'fill-amber-500 text-amber-500' : 'text-slate-200 dark:text-white/10'}`} />
                                       ))}
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                       {format(new Date(review.created_at), "dd MMM, yyyy")}
                                    </span>
                                 </div>
                                 <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                    "{review.comment || 'Sem comentário.'}"
                                 </p>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="p-10 text-center bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                           <Award className="size-8 text-slate-200 dark:text-white/5 mx-auto mb-3" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Ainda não recebeu avaliações.</p>
                        </div>
                     )}
                  </div>

                  <div className="sm:col-span-2 flex justify-end gap-4 mt-4">
                    <button 
                      type="button" onClick={() => reset()}
                      className="px-8 h-12 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all outline-none"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" disabled={isUpdatingProfile}
                      className="px-10 h-12 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all active:scale-95 flex items-center justify-center gap-2 outline-none disabled:opacity-50"
                    >
                      {isUpdatingProfile && <Loader2 className="size-4 animate-spin" />}
                      Salvar Alterações
                    </button>
                  </div>
               </form>
            </div>
          </div>
        </div>
      </div>

      {/* Custom KYC Submission Modal */}
      <AnimatePresence>
        {isKYCModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsKYCModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#192633] rounded-3xl shadow-2xl overflow-hidden border border-white/10"
            >
              <form onSubmit={handleKYCSubmit}>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        Verificação de <span className="text-primary italic">Identidade</span>
                      </h2>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                        Segurança e transparência P2P
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsKYCModalOpen(false)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Tipo de Documento</label>
                      <select 
                        name="doc_type" 
                        required 
                        defaultValue="BI"
                        className="w-full h-12 px-4 bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-primary/50 transition-all appearance-none"
                      >
                        <option value="BI">Bilhete de Identidade (BI)</option>
                        <option value="PASSPORT">Passaporte</option>
                        <option value="DRIVERS_LICENSE">Carta de Condução</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Número do Documento</label>
                      <input 
                        name="doc_number"
                        required
                        placeholder="ex: 000000000LA000"
                        className="w-full h-12 px-4 bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-primary/50 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Frente do Doc</label>
                        <div className="relative aspect-[4/3] bg-slate-50 dark:bg-[#111922] border border-dashed border-slate-200 dark:border-white/10 rounded-xl overflow-hidden group hover:border-primary/50 transition-colors">
                          {kycDocs.front ? (
                            <img src={URL.createObjectURL(kycDocs.front)} className="w-full h-full object-cover" alt="Frente" />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-300 pointer-events-none">
                              <Camera className="size-6" />
                              <span className="text-[8px] font-black uppercase tracking-widest">Súbir Frente</span>
                            </div>
                          )}
                          <input 
                            type="file" 
                            required
                            accept="image/*"
                            onChange={(e) => setKycDocs(prev => ({ ...prev, front: e.target.files?.[0] || null }))}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Verso do Doc</label>
                        <div className="relative aspect-[4/3] bg-slate-50 dark:bg-[#111922] border border-dashed border-slate-200 dark:border-white/10 rounded-xl overflow-hidden group hover:border-primary/50 transition-colors">
                          {kycDocs.back ? (
                            <img src={URL.createObjectURL(kycDocs.back)} className="w-full h-full object-cover" alt="Verso" />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-300 pointer-events-none">
                              <Camera className="size-6" />
                              <span className="text-[8px] font-black uppercase tracking-widest">Súbir Verso</span>
                            </div>
                          )}
                          <input 
                            type="file" 
                            required
                            accept="image/*"
                            onChange={(e) => setKycDocs(prev => ({ ...prev, back: e.target.files?.[0] || null }))}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 space-y-3">
                    <button 
                      type="submit"
                      disabled={isSubmittingKYC || !kycDocs.front || !kycDocs.back}
                      className="w-full h-12 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmittingKYC ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                      Enviar para Análise
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsKYCModalOpen(false)}
                      className="w-full h-10 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors outline-none"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PerfilPage;
