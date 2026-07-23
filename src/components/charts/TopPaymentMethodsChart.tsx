import { useTopPaymentMethods } from '@/services/transactions.hooks';
import { CreditCard, Inbox } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#00C853', '#2962FF', '#FF6D00', '#FFD600', '#AA00FF', '#00BFA5', '#FF3D00', '#3E2723'];

export function TopPaymentMethodsChart() {
  const { data: metrics, isLoading } = useTopPaymentMethods();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#111922] p-6 rounded-2xl border border-slate-100 dark:border-white/5 h-[350px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Estado vazio: Sem dados de métodos de pagamento suficientes
  if (!metrics || metrics.length === 0) {
    return (
      <div className="bg-white dark:bg-[#111922] p-6 rounded-2xl border border-slate-100 dark:border-white/5 h-[350px] flex flex-col items-center justify-center">
        <div className="size-16 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-4">
          <Inbox className="size-8 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Sem Dados de Pagamento
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-[200px]">
          Não há ofertas publicadas suficientes para gerar o gráfico de plataformas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111922] p-6 rounded-2xl border border-slate-100 dark:border-white/5 h-[350px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Plataformas Mais Usadas</h3>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Nas ofertas publicadas</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={metrics}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="count"
              nameKey="method"
            >
              {metrics.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 25, 34, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', fontWeight: '500' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
