import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@store/authStore';

const profileSchema = z.object({
  fullName: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  bi: z.string().min(10, 'BI inválido'),
  address: z.string().min(5, 'Morada muito curta'),
  currentPassword: z.string().min(6, 'Senha necessária para confirmar'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const PerfilPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.username || 'Diassonama Nlando',
      email: user?.email || 'd.nlando@example.com',
      bi: '001234567LA098',
      address: 'Rua da Liberdade, Luanda, Angola',
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log('Update profile:', data);
    // Logic for updating profile
  };

  const paymentMethods = [
    { name: 'Visa', detail: '**** **** **** 1234', logo: 'https://cdn-icons-png.flaticon.com/512/349/349221.png' },
    { name: 'PayPal', detail: 'd.nlan...@example.com', logo: 'https://cdn-icons-png.flaticon.com/512/174/174861.png' },
    { name: 'Unitel Money', detail: '*** *** 456', logo: 'https://www.unitelmoney.ao/wp-content/uploads/2021/08/logo-unitel-money.png' },
  ];

  return (
    <div className="flex-1 flex flex-col gap-8 py-10 px-4 md:px-10 lg:px-20 xl:px-40 max-w-[1400px] mx-auto w-full pb-32 lg:pb-10 font-display">
      <div className="flex flex-col gap-2">
        <h1 className="text-gray-900 dark:text-white text-3xl md:text-5xl font-black tracking-tighter">Meu Perfil</h1>
        <p className="text-gray-500 dark:text-[#92adc9] text-base font-medium">Gerencie suas informações pessoais, segurança e métodos de pagamento.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6 items-center text-center p-8 bg-white dark:bg-[#192633] rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl"
          >
            <div className="relative group">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-4 border-primary/20 shadow-2xl transition-all group-hover:scale-105" 
                style={{ backgroundImage: `url(${user?.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.username})` }} 
              />
              <button className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-2.5 shadow-xl hover:scale-110 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-lg">photo_camera</span>
              </button>
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white text-2xl font-black tracking-tight">{user?.username || 'Usuário'}</h2>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-sm tracking-tight">{user?.email}</p>
            </div>
            <div className="w-full h-[1px] bg-gray-50 dark:bg-white/5" />
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Nível</span>
                <span className="text-sm font-black text-primary">Prata</span>
              </div>
              <div className="w-[1px] h-8 bg-gray-50 dark:bg-white/5" />
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Membro desde</span>
                <span className="text-sm font-black text-gray-700 dark:text-gray-300">Out 2023</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col p-8 bg-white dark:bg-[#192633] rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl text-yellow-500">verified_user</span>
            </div>
            <h2 className="text-gray-900 dark:text-white text-xl font-black mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-yellow-500">verified</span>
              Verificação KYC
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Status Atual</span>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-yellow-500 animate-pulse"></span>
                  <p className="text-lg font-black text-yellow-500">Em Análise</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-bold">
                  Sua documentação está sendo revisada. Isso pode levar de 24h a 48h úteis.
                </p>
              </div>
              <button className="mt-2 flex items-center justify-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:underline">
                <span className="material-symbols-outlined text-sm">contact_support</span>
                Suporte de Verificação
              </button>
            </div>
          </motion.div>
        </div>

        {/* Main Content Info */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col p-8 bg-white dark:bg-[#192633] rounded-3xl border border-gray-100 dark:border-white/5 shadow-2xl"
          >
            <h2 className="text-gray-900 dark:text-white text-2xl font-black tracking-tight mb-8">Informações Pessoais</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input 
                    {...register('fullName')}
                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 dark:bg-[#101922] border-2 border-transparent focus:border-primary/50 text-gray-900 dark:text-white font-bold outline-none transition-all"
                  />
                  {errors.fullName && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest ml-1">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Endereço de E-mail</label>
                  <input 
                    {...register('email')}
                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 dark:bg-[#101922] border-2 border-transparent focus:border-primary/50 text-gray-900 dark:text-white font-bold outline-none transition-all"
                  />
                  {errors.email && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest ml-1">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Número do BI</label>
                  <input 
                    {...register('bi')}
                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 dark:bg-[#101922] border-2 border-transparent focus:border-primary/50 text-gray-900 dark:text-white font-bold outline-none transition-all"
                  />
                  {errors.bi && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest ml-1">{errors.bi.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Morada</label>
                  <input 
                    {...register('address')}
                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 dark:bg-[#101922] border-2 border-transparent focus:border-primary/50 text-gray-900 dark:text-white font-bold outline-none transition-all"
                   />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 dark:bg-white/5 space-y-6">
                <div className="max-w-md space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirmar com Senha</label>
                  <input 
                    type="password"
                    {...register('currentPassword')}
                    placeholder="Sua senha atual"
                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 dark:bg-[#101922] border-2 border-transparent focus:border-primary/50 text-gray-900 dark:text-white font-bold outline-none transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  className="px-10 h-14 bg-primary hover:bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 uppercase tracking-widest text-xs"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </motion.div>

          {/* Payment Methods Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col p-8 bg-white dark:bg-[#192633] rounded-3xl border border-gray-100 dark:border-white/5 shadow-2xl"
          >
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <h2 className="text-gray-900 dark:text-white text-2xl font-black tracking-tight">Métodos de Pagamento</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-black text-[10px] uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">add_circle</span>
                Adicionar Novo
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method, idx) => (
                <div key={idx} className="flex items-center p-5 bg-gray-50 dark:bg-[#101922] rounded-2xl border border-transparent hover:border-primary/30 transition-all group">
                  <div className="size-12 rounded-xl bg-white dark:bg-[#192633] flex items-center justify-center p-2 shadow-sm mr-4 group-hover:scale-110 transition-transform">
                    <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-black text-sm text-gray-900 dark:text-white">{method.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 tracking-wider font-mono">{method.detail}</p>
                  </div>
                  <button className="text-gray-400 hover:text-rose-500 transition-colors p-2">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
