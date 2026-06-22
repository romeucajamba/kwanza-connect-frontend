import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, User, Key, ArrowRight, Activity, Eye, EyeOff } from 'lucide-react';
import { useAdminRegister } from '@/services/admin.hooks';
import { APP_ROUTES } from '@/constants';

const registerSchema = z.object({
  full_name: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  password_confirm: z.string(),
  admin_secret_key: z.string().min(1, 'Chave secreta é obrigatória'),
}).refine(data => data.password === data.password_confirm, {
  message: "As senhas não coincidem",
  path: ["password_confirm"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const AdminRegisterPage: React.FC = () => {
  const { mutate: registerUser, isPending } = useAdminRegister();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showSecret, setShowSecret] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <div className="min-h-screen bg-[#0b1117] flex items-center justify-center p-4 selection:bg-primary/30">
      
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6 shadow-2xl shadow-amber-500/20">
            <ShieldAlert className="size-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Novo Administrador</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Acesso Restrito</p>
        </div>

        <div className="bg-[#111922] p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
                  <input
                    type="text"
                    {...register('full_name')}
                    className={`w-full pl-12 pr-4 py-3.5 bg-black/20 border ${errors.full_name ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'} rounded-xl text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary/50 outline-none transition-all`}
                    placeholder="João Silva"
                  />
                </div>
                {errors.full_name && <p className="mt-1.5 ml-1 text-xs font-bold text-red-500">{errors.full_name.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  Email Corporativo
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full pl-12 pr-4 py-3.5 bg-black/20 border ${errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'} rounded-xl text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary/50 outline-none transition-all`}
                    placeholder="admin@kwanzaconnect.ao"
                  />
                </div>
                {errors.email && <p className="mt-1.5 ml-1 text-xs font-bold text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    className={`w-full pl-12 pr-12 py-3.5 bg-black/20 border ${errors.password ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'} rounded-xl text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary/50 outline-none transition-all`}
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 ml-1 text-xs font-bold text-red-500">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register('password_confirm')}
                    className={`w-full pl-12 pr-12 py-3.5 bg-black/20 border ${errors.password_confirm ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'} rounded-xl text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary/50 outline-none transition-all`}
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                {errors.password_confirm && <p className="mt-1.5 ml-1 text-xs font-bold text-red-500">{errors.password_confirm.message}</p>}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-white/5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2 ml-1">
                Chave Secreta de Administração
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-amber-500/50" />
                <input
                  type={showSecret ? "text" : "password"}
                  {...register('admin_secret_key')}
                  className={`w-full pl-12 pr-12 py-3.5 bg-black/20 border ${errors.admin_secret_key ? 'border-red-500/50' : 'border-amber-500/30 focus:border-amber-500'} rounded-xl text-white placeholder:text-slate-600 focus:ring-1 focus:ring-amber-500 outline-none transition-all`}
                  placeholder="Insira o código de segurança do sistema"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500/50 hover:text-amber-500 transition-colors"
                >
                  {showSecret ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {errors.admin_secret_key && <p className="mt-1.5 ml-1 text-xs font-bold text-red-500">{errors.admin_secret_key.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 mt-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Activity className="size-4 animate-spin" />
                  <span>A Criar Conta...</span>
                </>
              ) : (
                <>
                  <span>Registar Administrador</span>
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs font-medium text-slate-500">
              Já tens uma conta admin?{' '}
              <Link to={APP_ROUTES.ADMIN_LOGIN} className="font-bold text-primary hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminRegisterPage;
