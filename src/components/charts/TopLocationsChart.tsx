import { useTopLocations } from '@services/transactions.hooks';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';
import { useSettingsStore } from '@store/authStore';

export const TopLocationsChart = () => {
  const { data: locations, isLoading } = useTopLocations();
  const theme = useSettingsStore((s) => s.theme);

  if (isLoading) {
    return (
      <div className="w-full h-[200px] flex flex-col items-center justify-center bg-slate-50/50 dark:bg-[#111922]/50 rounded-2xl border border-slate-100 dark:border-white/5 mb-6">
        <Loader2 className="size-5 text-primary animate-spin mb-2" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A carregar locais em destaque...</p>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-[#111922]/50 rounded-2xl border border-slate-100 dark:border-white/5 p-4 md:p-6 flex flex-col mb-6">
        <div className="mb-4 flex flex-col items-start gap-1">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            Locais Mais Activos
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Áreas com maior volume de trocas concluídas na plataforma
          </p>
        </div>
        <div className="w-full h-[200px] flex items-center justify-center bg-slate-50/50 dark:bg-[#111922]/50 rounded-2xl border border-slate-100 dark:border-white/5 border-dashed">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-4">Ainda não existem dados suficientes de locais de trocas.</p>
        </div>
      </div>
    );
  }

  // Define colors based on theme
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b'; // slate-400 or slate-500

  // Format data for Recharts, handling very long city names
  const chartData = locations.map(loc => ({
    name: loc.city.length > 12 ? loc.city.substring(0, 10) + '...' : loc.city,
    fullName: loc.city,
    exchanges: loc.exchanges
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#192633] p-3 rounded-lg shadow-xl border border-slate-100 dark:border-white/10">
          <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase mb-1">{payload[0].payload.fullName}</p>
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
            {payload[0].value} {payload[0].value === 1 ? 'Troca' : 'Trocas'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white dark:bg-[#111922]/50 rounded-2xl border border-slate-100 dark:border-white/5 p-4 md:p-6 flex flex-col mb-6">
      <div className="mb-4 flex flex-col items-start gap-1">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">
          Locais Mais Activos
        </h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Áreas com maior volume de trocas concluídas na plataforma
        </p>
      </div>
      
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: textColor }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: textColor }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }} />
            <Bar 
              dataKey="exchanges" 
              radius={[4, 4, 0, 0]} 
              barSize={32}
            >
              {
                chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#38bdf8' : (theme === 'dark' ? '#1e293b' : '#e2e8f0')} />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
