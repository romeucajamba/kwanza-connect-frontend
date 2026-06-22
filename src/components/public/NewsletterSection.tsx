import { useState } from 'react';
import { Mail, CheckCircle2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setEmail('');
      }, 5000);
    }, 1800);
  };

  return (
    <section className="py-24 relative overflow-hidden" id="contacto">
      <div className="absolute inset-0 bg-surface-elevated/30 z-0" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-8 md:p-12 text-center border-border-subtle relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-32 bg-primary/10 blur-[80px] pointer-events-none" />

          <AnimatePresence mode="wait">
            {status !== 'success' ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                {/* Icon with shake animation when sending */}
                <motion.div
                  animate={status === 'sending' ? { rotate: [0, -15, 15, -10, 10, 0], y: [0, -6, 0] } : {}}
                  transition={{ duration: 0.6, repeat: status === 'sending' ? Infinity : 0, repeatDelay: 0.4 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface border border-border-subtle mb-6 shadow-sm"
                >
                  <Mail className={`w-8 h-8 transition-colors duration-300 ${status === 'sending' ? 'text-blue-500' : 'text-primary'}`} />
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 tracking-tight">
                  Fique a par das novidades
                </h2>
                <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
                  Subscreva a nossa newsletter e receba atualizações sobre novas
                  listagens de moedas, taxas de câmbio e dicas de trading P2P.
                </p>

                <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={handleSubmit}>
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="O seu melhor e-mail"
                      disabled={status === 'sending'}
                      className="w-full h-14 px-5 rounded-xl bg-input-bg border border-border-subtle text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-text-secondary/50 disabled:opacity-60"
                      required
                    />
                    {/* Animated progress line when sending */}
                    {status === 'sending' && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-blue-500 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.8, ease: 'easeInOut' }}
                      />
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={status === 'sending'}
                    whileTap={{ scale: 0.97 }}
                    className="h-14 px-8 bg-primary hover:bg-primary-hover disabled:opacity-70 text-black font-bold rounded-xl shadow-[0_0_15px_rgba(253,185,19,0.15)] hover:shadow-[0_0_25px_rgba(253,185,19,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    {status === 'sending' ? (
                      <>
                        <motion.div
                          animate={{ x: [0, 6, 0], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 0.7, repeat: Infinity }}
                        >
                          <Send className="w-4 h-4" />
                        </motion.div>
                        <span>A enviar...</span>
                      </>
                    ) : (
                      'Subscrever'
                    )}
                  </motion.button>
                </form>

                <p className="text-xs text-text-secondary/70 mt-4">
                  Não enviamos spam. Pode cancelar a subscrição a qualquer momento.
                </p>
              </motion.div>
            ) : (
              /* SUCCESS STATE */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="flex flex-col items-center gap-5 py-4"
              >
                {/* Animated checkmark with sparkles */}
                <div className="relative w-24 h-24">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }}
                    className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </motion.div>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-primary"
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        x: Math.cos((i * Math.PI * 2) / 6) * 48,
                        y: Math.sin((i * Math.PI * 2) / 6) * 48,
                        scale: [0, 1.2, 0],
                      }}
                      transition={{ delay: 0.2 + i * 0.07, duration: 0.7 }}
                      style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4 }}
                    />
                  ))}
                </div>

                <div>
                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-text-primary mb-2"
                  >
                    Subscrito com sucesso! 🎉
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="text-text-secondary"
                  >
                    Enviámos um e-mail de confirmação para{' '}
                    <span className="text-primary font-semibold">{email}</span>.
                    <br />Verifique a sua caixa de entrada!
                  </motion.p>
                </div>

                {/* Countdown bar until reset */}
                <div className="w-full max-w-xs h-1 bg-border-subtle rounded-full overflow-hidden mt-2">
                  <motion.div
                    className="h-full bg-green-500 rounded-full"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
