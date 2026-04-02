import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  gamificationSettingsSchema,
  type GamificationSettingsFormValues,
} from '../schemas';
import { cn } from '../lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
type FrequencyOption = 'daily' | 'weekly' | 'monthly';

// ─── Toggle Switch ────────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
  disabled?: boolean;
}
const Toggle: React.FC<ToggleProps> = ({ checked, onChange, id, disabled }) => (
  <button
    type="button"
    id={id}
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={cn(
      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed',
      checked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
    )}
  >
    <motion.span
      layout
      className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0"
      animate={{ x: checked ? 20 : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    />
  </button>
);

// ─── Section heading ──────────────────────────────────────────────────────────
const SectionHeading: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
  <div className="flex items-center gap-2 px-1 pb-2 pt-6">
    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>{icon}</span>
    <h2 className="text-base font-bold text-gray-900 dark:text-white font-display">{title}</h2>
  </div>
);

// ─── List row ─────────────────────────────────────────────────────────────────
interface RowProps {
  icon: string;
  label: string;
  description?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
const Row: React.FC<RowProps> = ({ icon, label, description, right, onClick, disabled }) => (
  <motion.div
    className={cn(
      'flex items-center gap-4 px-4 min-h-[60px] justify-between border-b border-gray-100 dark:border-gray-800 last:border-0',
      onClick && !disabled && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
      disabled && 'opacity-50'
    )}
    onClick={!disabled ? onClick : undefined}
    whileHover={onClick && !disabled ? { x: 2 } : {}}
    transition={{ duration: 0.15 }}
  >
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center rounded-xl bg-secondary/10 dark:bg-primary/10 shrink-0 size-10 text-secondary dark:text-primary">
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="shrink-0 flex items-center">
      {right ?? (
        onClick && (
          <span className="material-symbols-outlined text-gray-400" style={{ fontSize: 20 }}>chevron_right</span>
        )
      )}
    </div>
  </motion.div>
);

// ─── AI Settings Panel ────────────────────────────────────────────────────────
interface AIFormValues {
  recognitionThreshold: number;
  routeOptimizationEnabled: boolean;
  retrainingFrequency: FrequencyOption;
}

const AISettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [values, setValues] = useState<AIFormValues>({
    recognitionThreshold: 85,
    routeOptimizationEnabled: true,
    retrainingFrequency: 'weekly',
  });

  const freqOptions: { label: string; value: FrequencyOption }[] = [
    { label: 'Diário', value: 'daily' },
    { label: 'Semanal', value: 'weekly' },
    { label: 'Mensal', value: 'monthly' },
  ];

  const handleSave = () => {
    toast.success('Parâmetros de IA guardados!');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 shadow-2xl"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 22 }}>psychology</span>
            <h3 className="font-bold text-gray-900 dark:text-white font-display">Parâmetros de IA</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Threshold slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Limiar de Reconhecimento
              </label>
              <span className="text-sm font-bold text-primary font-mono">{values.recognitionThreshold}%</span>
            </div>
            <input
              type="range" min={50} max={99} step={1}
              value={values.recognitionThreshold}
              onChange={(e) => setValues((v) => ({ ...v, recognitionThreshold: Number(e.target.value) }))}
              className="w-full h-2 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-primary cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">50%</span>
              <span className="text-xs text-gray-400">99%</span>
            </div>
          </div>

          {/* Route optimization toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Otimização de Rotas</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Activa o algoritmo de otimização automática</p>
            </div>
            <Toggle
              id="route-opt"
              checked={values.routeOptimizationEnabled}
              onChange={(v) => setValues((prev) => ({ ...prev, routeOptimizationEnabled: v }))}
            />
          </div>

          {/* Retraining frequency */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Frequência de Re-treinamento
            </label>
            <div className="grid grid-cols-3 gap-2">
              {freqOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValues((v) => ({ ...v, retrainingFrequency: opt.value }))}
                  className={cn(
                    'rounded-xl py-2.5 text-sm font-medium border transition-all duration-200',
                    values.retrainingFrequency === opt.value
                      ? 'bg-primary/10 border-primary/30 text-primary dark:text-blue-400'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} className="flex-1 btn-primary py-2.5">
            Guardar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const SettingsPage: React.FC = () => {
  const [globalPush, setGlobalPush] = useState(true);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<GamificationSettingsFormValues>({
    resolver: zodResolver(gamificationSettingsSchema),
    defaultValues: { maxPointsPerDay: 1000 },
  });

  const onSaveGamification = (data: GamificationSettingsFormValues) => {
    toast.promise(
      new Promise((r) => setTimeout(r, 800)),
      {
        loading: 'A guardar configurações...',
        success: `Limite de pontos actualizado para ${data.maxPointsPerDay}/dia`,
        error: 'Erro ao guardar configurações.',
      }
    );
    setHasChanges(false);
  };

  const handlePushToggle = (val: boolean) => {
    setGlobalPush(val);
    setHasChanges(true);
    toast.success(val ? 'Notificações push activadas.' : 'Notificações push desactivadas.');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const sectionVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
  };

  return (
    <>
      <div className="flex flex-col min-h-screen pb-20 md:pb-6">
        {/* Header */}
        <motion.header
          className="sticky top-0 z-10 flex items-center justify-between bg-secondary text-white px-4 sm:px-6 py-4 shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-1.5 hover:bg-white/10 transition-colors" onClick={() => window.history.back()}>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>arrow_back</span>
            </button>
            <h1 className="text-lg font-bold font-display tracking-tight">Configurações Gerais</h1>
          </div>
          <AnimatePresence>
            {hasChanges && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                type="button"
                onClick={() => {
                  toast.success('Todas as alterações guardadas.');
                  setHasChanges(false);
                }}
                className="text-sm font-bold text-white hover:text-blue-200 transition-colors px-3 py-1.5 rounded-lg bg-white/10"
              >
                Salvar
              </motion.button>
            )}
            {!hasChanges && (
              <span className="text-sm font-medium text-white/40 cursor-not-allowed select-none">Salvar</span>
            )}
          </AnimatePresence>
        </motion.header>

        <motion.div
          className="flex-1 px-4 sm:px-6 max-w-2xl w-full mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ── IA ───────────────────────────────────────────────────────────── */}
          <motion.div variants={sectionVariants}>
            <SectionHeading icon="psychology" title="Inteligência Artificial" />
            <div className="card overflow-hidden">
              <Row
                icon="psychology"
                label="Parâmetros de Reconhecimento"
                description="Ajuste o limiar de confiança da IA"
                onClick={() => setAiPanelOpen(true)}
              />
              <Row
                icon="route"
                label="Otimização de Rotas"
                description="Algoritmo de rota mais eficiente"
                onClick={() => setAiPanelOpen(true)}
              />
              <Row
                icon="model_training"
                label="Frequência de Re-treinamento"
                description="Quando o modelo deve ser re-treinado"
                onClick={() => setAiPanelOpen(true)}
              />
            </div>
          </motion.div>

          {/* ── Gamificação ───────────────────────────────────────────────────── */}
          <motion.div variants={sectionVariants}>
            <SectionHeading icon="scoreboard" title="Gamificação e Recompensas" />
            <div className="card overflow-hidden">
              <form onSubmit={handleSubmit(onSaveGamification)}>
                <div className="flex items-start gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-center rounded-xl bg-secondary/10 dark:bg-primary/10 shrink-0 size-10 text-secondary dark:text-primary mt-1">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>scoreboard</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Limite Máximo de Pontos/Dia</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2">
                      Define o tecto de pontos que um utilizador pode acumular diariamente.
                    </p>
                    <div className="flex items-center gap-2">
                      <Controller
                        name="maxPointsPerDay"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            onChange={(e) => { field.onChange(Number(e.target.value)); setHasChanges(true); }}
                            className={cn(
                              'w-28 rounded-xl border px-3 py-2 text-sm text-right font-mono',
                              'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800',
                              'text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all',
                              errors.maxPointsPerDay && 'border-red-400'
                            )}
                          />
                        )}
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">pts</span>
                      <motion.button
                        type="submit"
                        className="btn-primary py-2 px-4 text-xs ml-auto"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Guardar
                      </motion.button>
                    </div>
                    {errors.maxPointsPerDay && (
                      <p className="text-xs text-red-500 mt-1">{errors.maxPointsPerDay.message}</p>
                    )}
                  </div>
                </div>
              </form>
              <Row
                icon="workspace_premium"
                label='Regras para "Badges"'
                description="Configure as conquistas e recompensas"
                onClick={() => toast('Gestão de badges em breve!', { icon: '🏆' })}
              />
            </div>
          </motion.div>

          {/* ── Notificações ─────────────────────────────────────────────────── */}
          <motion.div variants={sectionVariants}>
            <SectionHeading icon="notifications" title="Notificações" />
            <div className="card overflow-hidden">
              <Row
                icon="notifications"
                label="Notificações Push Globais"
                description="Activa ou desactiva notificações para todos os utilizadores"
                right={
                  <Toggle id="global-push" checked={globalPush} onChange={handlePushToggle} />
                }
              />
              <Row
                icon="edit_notifications"
                label="Templates de Notificação"
                description="Edite os modelos de mensagem"
                onClick={() => toast('Editor de templates em breve!', { icon: '✏️' })}
              />
            </div>
          </motion.div>

          {/* ── Legal ────────────────────────────────────────────────────────── */}
          <motion.div variants={sectionVariants}>
            <SectionHeading icon="gavel" title="Legal e Conteúdo" />
            <div className="card overflow-hidden">
              <Row
                icon="gavel"
                label="Termos de Uso e Privacidade"
                description="v2.1 — Actualizado em Jan 2024"
                onClick={() => toast('A abrir termos...', { icon: '📄' })}
              />
              <Row
                icon="quiz"
                label="Gestão de FAQs"
                description="14 perguntas frequentes publicadas"
                onClick={() => toast('Editor de FAQs em breve!', { icon: '❓' })}
              />
            </div>
          </motion.div>

          {/* ── Zona de Perigo ───────────────────────────────────────────────── */}
          <motion.div variants={sectionVariants}>
            <SectionHeading icon="dangerous" title="Zona de Perigo" />
            <div className="card overflow-hidden border-red-200 dark:border-red-900/50">
              <Row
                icon="delete_forever"
                label="Limpar todos os logs"
                description="Esta acção é irreversível"
                right={
                  <motion.button
                    type="button"
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    onClick={() => toast.error('Confirmação necessária para esta acção.', { duration: 4000 })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Limpar
                  </motion.button>
                }
              />
              <Row
                icon="restart_alt"
                label="Reiniciar configurações"
                description="Repor para os valores padrão"
                right={
                  <motion.button
                    type="button"
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 transition-colors"
                    onClick={() => { reset(); toast('Configurações repostas.', { icon: '🔄' }); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Repor
                  </motion.button>
                }
              />
            </div>
          </motion.div>

          <div className="h-8" />
        </motion.div>
      </div>

      {/* AI Panel Modal */}
      <AnimatePresence>
        {aiPanelOpen && <AISettingsPanel onClose={() => setAiPanelOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default SettingsPage;
