import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, Activity, Eye, EyeOff } from 'lucide-react';
import { useAdminLogin } from '@/services/admin.hooks';
import { APP_ROUTES } from '@/constants';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const AdminLoginPage: React.FC = () => {
  const { mutate: login, isPending } = useAdminLogin();
  const [showPassword, setShowPassword] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen bg-[#0b1117] flex items-center justify-center p-4 selection:bg-primary/30">
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-2xl shadow-primary/20">
            <ShieldCheck className="size-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Kwanza<span className="text-primary italic">Admin</span></h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Portal de Gestão Segura</p>
        </div>

        <div className="bg-[#111922] p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Correio Eletrónico Corporativo
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

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Palavra-Passe de Acesso
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

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 mt-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Activity className="size-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs font-medium text-slate-500">
              Novo administrador?{' '}
              <Link to={APP_ROUTES.ADMIN_REGISTER} className="font-bold text-primary hover:underline">
                Criar conta de staff
              </Link>
            </p>
            <div className="mt-4">
              <Link to={APP_ROUTES.LOGIN} className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-white transition-colors">
                &larr; Voltar à aplicação principal
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminLoginPage;
