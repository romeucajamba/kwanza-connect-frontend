import type { LogSeverity } from '../types';

export const formatTimestamp = (iso: string): string => {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = diff / (1000 * 60 * 60);
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (hours < 1) {
    const mins = Math.floor(diff / (1000 * 60));
    return `Há ${mins} min`;
  }
  if (isToday) {
    return `Hoje, ${date.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleString('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const severityColor: Record<LogSeverity, string> = {
  critical: '#FF3B30',
  warning: '#FF9500',
  system: '#007AFF',
  info: '#34C759',
};

export const severityBg: Record<LogSeverity, string> = {
  critical: 'bg-red-500/10 text-red-500 dark:text-red-400',
  warning: 'bg-orange-500/10 text-orange-500 dark:text-orange-400',
  system: 'bg-blue-500/10 text-blue-500 dark:text-blue-400',
  info: 'bg-green-500/10 text-green-500 dark:text-green-400',
};

export const roleLabel: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  volunteer: 'Voluntário',
  system: 'Sistema / IA',
};

export const cn = (...classes: (string | undefined | false | null)[]): string =>
  classes.filter(Boolean).join(' ');
