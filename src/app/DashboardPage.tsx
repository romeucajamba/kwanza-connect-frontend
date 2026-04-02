import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { APP_ROUTES } from '@constants';

const DashboardPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const balances = [
    { label: 'Kwanza Angolano', value: '1.500.000,00 AOA', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArA_kHDOOeaEENQEP68Cjekm20956GFyjsLwadimeLc7dZznKfN1TIhpqziJ0mxKvi8JkC1uGdBwqcIU2aettE65o1va39stiyOAWtVzFNy_2g_HVdz6cjXASrYs6yjZwZvu49wTpQY5SbDneHTdlpH59PCVC63rLNal0cgX3P1PXeJzuczzPnJqHbVmevU0mHTmaAxxeLk1eQqLD750W4YZr1p2-3Tap4ZnfhfbM1i_PR-bPMZukKo5QS9shW5cHv36NI7id8GmU' },
    { label: 'Dólar Americano', value: '2.000,00 USD', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8X3nvHVOpG-TcyosNq2zH8ozAIqigxXvxgRpHQC8gFoZbsP3drt2WMK-m2ibyYN09UI84eAg5tQRZECqpECAWYS2sBngMXrEUb3RbwYkKFKwvrxFh6kX0SP-vUA0_Tub8BVZvFVocVdtFav0WsLti8IrV1S68i7Ey5mqpvPTgHvRPCTESGy6h5I_UuZYk5M-vRxV62MWxSSTTz0wNHjIblit4ModobiOERNLm9yffqzvsxapAOCEI7BmsMvzasEJizqht4CgBpNk' },
    { label: 'Euro', value: '1.800,00 EUR', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6s7zlSgfK-FcECxOgUd8MHZbzxoNqXlsRBTzzF_D03afGH9wTLLDXIcuJdBNdja_Qx4GLYiu5bBGlKpIrpRrh4u4KoTUo28KUO46KFnJ1_0KFzcr5z9zyvubWxEfANL_QbkIgjQpkZ1vNjq35ELJs1w2nBlccdsWE6g6LfmC3VLCW8u4j0EUMzOd3rwYkXlXN1Noo99t8hwYSP_oH6XtUiBYLZogDlpTJ8OWf_qQCgsuqpBeghva0qrDdFVUe4_5nKv3dQGAdniQ' },
  ];

  const quickActions = [
    { icon: 'currency_exchange', label: 'Converter', path: APP_ROUTES.CONVERSAO },
    { icon: 'send', label: 'Enviar', path: APP_ROUTES.P2P_BROWSE },
    { icon: 'call_received', label: 'Receber', path: APP_ROUTES.P2P_BROWSE },
    { icon: 'groups', label: 'Trocas P2P', path: APP_ROUTES.P2P_BROWSE },
  ];

  const transactions = [
    { type: 'Recebimento', amount: '+ $500.00 USD', date: '15 de Julho, 2024', status: 'Concluída', icon: 'arrow_downward', color: 'text-emerald-500' },
    { type: 'Envio', amount: '- 150.000,00 AOA', date: '14 de Julho, 2024', status: 'Concluída', icon: 'arrow_upward', color: 'text-rose-500' },
    { type: 'Conversão', amount: '€100 para $108.50', date: '12 de Julho, 2024', status: 'Concluída', icon: 'currency_exchange', color: 'text-primary' },
    { type: 'Recebimento', amount: '+ 2.000.000,00 AOA', date: '10 de Julho, 2024', status: 'Pendente', icon: 'arrow_downward', color: 'text-emerald-500' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col gap-8 mt-8 px-4 md:px-8 lg:px-20 xl:px-40 max-w-[1400px] mx-auto w-full pb-32 lg:pb-10"
    >
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-black dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            Dashboard de Controlo
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Bem-vindo de volta, {user?.username}!</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="size-8 rounded-full border-2 border-white dark:border-background-dark bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">+12 ativos hoje</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Main Balance Card */}
          <motion.div variants={itemVariants} className="group relative overflow-hidden flex flex-col items-stretch justify-start rounded-2xl shadow-xl bg-white dark:bg-[#192633] border border-gray-100 dark:border-white/5 transition-all hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-10 -mt-10 blur-2xl group-hover:bg-primary/20 transition-colors" />
            <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 p-8 relative z-10">
              <p className="text-gray-500 dark:text-[#92adc9] text-sm font-semibold uppercase tracking-wider">Saldo Total Consolidado</p>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <p className="text-black dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.015em]">
                    1.500.000,00 <span className="text-primary">AOA</span>
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm font-medium mt-1">≈ 1.807,23 USD • 1.666,67 EUR</p>
                </div>
                <button className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all">
                  <span className="material-symbols-outlined mr-2">add_circle</span>
                  <span className="truncate">Adicionar Fundos</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Wallets List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {balances.map((balance, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="flex flex-col gap-4 p-5 rounded-2xl bg-white dark:bg-[#192633] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="size-10 rounded-full border-2 border-gray-100 dark:border-gray-800 overflow-hidden shadow-inner">
                    <img src={balance.flag} alt={balance.label} className="w-full h-full object-cover" />
                  </div>
                  <span className="material-symbols-outlined text-gray-300 dark:text-gray-600">more_vert</span>
                </div>
                <div>
                  <p className="text-black dark:text-white text-lg font-black leading-tight">{balance.value.split(' ')[0]} <span className="text-primary text-sm font-bold">{balance.value.split(' ')[1]}</span></p>
                  <p className="text-gray-500 dark:text-[#92adc9] text-xs font-semibold uppercase">{balance.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Quick Actions Panel */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#192633] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-black dark:text-white text-xl font-black leading-tight tracking-[-0.015em] mb-6">Ações Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, idx) => (
                <button 
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className="group flex flex-col items-center justify-center gap-3 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all active:scale-95"
                >
                  <div className="size-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-[24px]">{action.icon}</span>
                  </div>
                  <span className="text-black dark:text-white text-xs font-bold uppercase tracking-wider">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Promotional Card */}
          <motion.div 
            variants={itemVariants}
            className="rounded-2xl bg-gradient-to-br from-primary to-blue-700 p-6 text-white overflow-hidden relative"
          >
            <div className="absolute -bottom-4 -right-4 size-24 bg-white/10 rounded-full blur-2xl" />
            <h3 className="text-lg font-black pr-10">Convide seus amigos e ganhe bônus!</h3>
            <p className="text-xs text-white/80 mt-2">Ganhe até 5% em taxas por cada amigo indicado.</p>
            <button className="mt-4 px-4 py-2 bg-white text-primary text-xs font-black rounded-lg hover:bg-white/90 transition-all active:scale-95">Indicar Agora</button>
          </motion.div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#192633] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-black dark:text-white text-2xl font-black leading-tight tracking-[-0.015em]">Atividade Recente</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Suas últimas transações na plataforma</p>
          </div>
          <button 
            onClick={() => navigate(APP_ROUTES.HISTORICO)}
            className="flex items-center gap-2 text-primary font-bold hover:underline transition-all"
          >
            <span>Ver Tudo</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
        <div className="overflow-x-auto -mx-6 md:mx-0">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Tipo</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Valor</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Data</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={idx} className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors border-b border-gray-50 dark:border-white/5 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${tx.color} group-hover:scale-110 transition-transform shadow-sm`}>
                        <span className="material-symbols-outlined text-[20px]">{tx.icon}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{tx.type}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-black text-gray-900 dark:text-white">{tx.amount}</td>
                  <td className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400">{tx.date}</td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                      tx.status === 'Concluída' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
