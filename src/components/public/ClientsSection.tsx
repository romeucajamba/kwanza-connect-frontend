import { motion } from 'framer-motion';
import {
  CircleDollarSign,
  Globe,
  Wallet,
  Landmark,
  CreditCard,
  Banknote,
} from 'lucide-react';

export const ClientsSection = () => {
  const clients = [
   { name: 'Transferência Bancária', icon: Landmark, suffix: 'AOA' },
  { name: 'Carteira Digital', icon: Wallet, suffix: 'Cripto' },
  { name: 'Dinheiro Físico', icon: Banknote, suffix: 'Cash' },
  { name: 'Multicaixa Express', icon: CreditCard, suffix: 'AOA' },
  { name: 'Câmbio Internacional', icon: Globe, suffix: 'USD/EUR' },
  { name: 'Stablecoins', icon: CircleDollarSign, suffix: 'USDT/USDC' },
  ];

  // We duplicate the array to allow for a seamless infinite loop
  const duplicatedClients = [...clients, ...clients, ...clients];

  return (
    <section
      id="parceiros"
      className="py-24 relative overflow-hidden bg-background"
    >
      <div className="container mx-auto px-4 md:px-6 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 tracking-tight">
          Você escolhe com quem. Você escolhe como.
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Encontre pessoas prontas para trocar dinheiro consigo. Escolha a
          tecnologia que preferir para concluir a troca — transferência bancária,
          carteira digital, ou o método que combinarem entre si.
        </p>
      </div>

      <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[150px] before:bg-gradient-to-r before:from-background before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[150px] after:bg-gradient-to-l after:from-background after:to-transparent">
        <motion.div
          className="flex items-center gap-8 w-max"
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 20, // Adjust speed here
          }}
        >
          {duplicatedClients.map((client, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl glass-card min-w-[280px] shrink-0"
            >
              <client.icon className="w-8 h-8 text-primary" />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-text-primary leading-none">
                  {client.name}
                </span>
                <span className="text-xs text-text-secondary font-mono tracking-wider mt-1">
                  {client.suffix}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
