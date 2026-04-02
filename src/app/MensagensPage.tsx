import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Plus,
  Paperclip,
  Smile,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { format } from 'date-fns';

const MensagensPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [messageText, setMessageText] = useState('');
  
  // Mock data normalized
  const chats = [
    { id: 1, name: 'João P2P', lastMsg: 'O comprovativo já foi enviado.', time: '12:45', unread: 2, status: 'online' },
    { id: 2, name: 'Maria Cambio', lastMsg: 'Podemos fechar a 850?', time: 'Ontem', unread: 0, status: 'offline' },
    { id: 3, name: 'Suporte Kwanza', lastMsg: 'A sua conta foi verificada.', time: 'Segunda', unread: 0, status: 'online' },
  ];

  const messages = [
    { id: 1, sender: 2, text: 'Olá, estou interessado na sua oferta de USD.', timestamp: new Date().setHours(10, 30) },
    { id: 2, sender: 1, text: 'Com certeza! O valor mínimo é $100.', timestamp: new Date().setHours(10, 35) },
    { id: 3, sender: 2, text: 'Perfeito. Vou iniciar o trade agora.', timestamp: new Date().setHours(12, 45) },
  ];

  const user = { id: 1 }; // Mock user

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageText('');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full gap-6 pb-4 overflow-hidden mt-2">
      
      {/* Sidebar de Conversas Compacta */}
      <aside className={`flex-col bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md overflow-hidden transition-all duration-300 flex w-full md:w-80 lg:w-96 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
         <div className="p-4 border-b border-slate-50 dark:border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
               <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Conversas</h2>
               <button className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all">
                  <Plus className="size-4" />
               </button>
            </div>
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-300 group-focus-within:text-primary transition-colors" />
               <input 
                  type="text" 
                  placeholder="Pesquisar mensagens..."
                  className="w-full bg-slate-50 dark:bg-[#111922] border-none rounded-lg pl-10 pr-4 py-2 text-[11px] font-medium focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-300"
               />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar">
            {chats.map(chat => (
               <button 
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-4 flex items-center gap-3 border-b border-slate-50 dark:border-white/5 transition-all hover:bg-slate-50 dark:hover:bg-white/5 relative ${selectedChat === chat.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
               >
                  <div className="relative flex-shrink-0">
                     <div className="size-10 rounded-lg bg-slate-100 dark:bg-white/5 bg-center bg-cover border border-slate-100 dark:border-white/10" style={{ backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name})` }} />
                     {chat.status === 'online' && (
                        <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#192633]" />
                     )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                     <div className="flex justify-between items-center mb-1">
                        <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase truncate">{chat.name}</h4>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{chat.time}</span>
                     </div>
                     <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-tight truncate opacity-70">{chat.lastMsg}</p>
                  </div>
                  {chat.unread > 0 && (
                     <div className="size-5 rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center shadow-lg shadow-primary/20">{chat.unread}</div>
                  )}
               </button>
            ))}
         </div>
      </aside>

      {/* Janela de Chat Compacta */}
      <main className={`flex-1 flex flex-col bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md overflow-hidden relative ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
         {selectedChat ? (
            <>
               <header className="p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#192633] z-10">
                  <div className="flex items-center gap-3">
                     <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 text-slate-400">
                        <ChevronLeft className="size-5" />
                     </button>
                     <div className="size-9 rounded-lg bg-slate-100 dark:bg-white/5 bg-center bg-cover border border-slate-100 dark:border-white/10" style={{ backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${chats.find(c => c.id === selectedChat)?.name})` }} />
                     <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{chats.find(c => c.id === selectedChat)?.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <div className="size-1.5 rounded-full bg-emerald-500" />
                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Online Agora</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <button className="hidden sm:flex size-8 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-all items-center justify-center">
                        <Phone className="size-4" />
                     </button>
                     <button className="hidden sm:flex size-8 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-all items-center justify-center">
                        <Video className="size-4" />
                     </button>
                     <button className="size-8 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-all items-center justify-center">
                        <MoreVertical className="size-4" />
                     </button>
                  </div>
               </header>

               <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-slate-50/30 dark:bg-[#111922]/10 relative">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
                  
                  <div className="flex justify-center my-4 relative z-10">
                     <div className="px-4 py-1.5 bg-white dark:bg-[#111922] rounded-full border border-slate-100 dark:border-white/5 shadow-sm">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Encriptado • Trade Seguro P2P</span>
                     </div>
                  </div>

                  <AnimatePresence>
                    {messages.map((msg) => {
                      const isMe = msg.sender === user.id;
                      return (
                        <motion.div 
                          key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'} group/msg`}
                        >
                           <div className={`max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                              <div 
                                className={`p-4 rounded-lg shadow-sm text-xs font-bold leading-relaxed transition-all 
                                  ${isMe 
                                    ? 'bg-primary text-white rounded-tr-none shadow-primary/10' 
                                    : 'bg-white dark:bg-[#192633] dark:text-white border border-slate-100 dark:border-white/5 rounded-tl-none'
                                  }`}
                              >
                                 {msg.text}
                              </div>
                              <div className={`flex items-center gap-2 mt-2 px-1 opacity-60 group-hover/msg:opacity-100 transition-opacity ${isMe ? 'flex-row' : 'flex-row-reverse'}`}>
                                 <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-[7px]">
                                   {format(new Date(msg.timestamp), 'HH:mm')}
                                 </span>
                                 {isMe && <CheckCircle2 className="size-2.5 text-emerald-500" />}
                              </div>
                           </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
               </div>

               <footer className="p-4 bg-white dark:bg-[#192633] border-t border-slate-50 dark:border-white/5 z-10">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-slate-50 dark:bg-[#111922] p-1 rounded-lg border border-transparent focus-within:border-primary/20 shadow-inner group">
                     <button type="button" className="hidden sm:flex size-9 items-center justify-center rounded-lg text-slate-300 hover:text-primary transition-all active:scale-95">
                        <Paperclip className="size-4" />
                     </button>
                     <input 
                        className="flex-1 bg-transparent border-none px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-300"
                        placeholder="Escreva algo seguro..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                     />
                     <button type="button" className="hidden sm:flex size-9 items-center justify-center rounded-lg text-slate-300 hover:text-primary transition-all">
                        <Smile className="size-4" />
                     </button>
                     <button type="submit" className="size-9 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        <Send className="size-4" />
                     </button>
                  </form>
               </footer>
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
               <div className="size-16 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 mb-6 border border-dashed border-slate-200">
                  <MessageSquare className="size-8 opacity-20" />
               </div>
               <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">KwanzaConnect Chat</h3>
               <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-widest leading-relaxed max-w-[240px]">Seleccione uma conversa para iniciar a negociação segura via smart escrow.</p>
            </div>
         )}
      </main>

      {/* Active Trade Sidebar Compacta */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md p-6">
         <div className="flex items-center gap-3 mb-8 border-b border-slate-50 dark:border-white/5 pb-4">
            <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
               <ShieldCheck className="size-4.5" />
            </div>
            <div>
               <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">Trade Proativo</h3>
               <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Escrow Activo</span>
            </div>
         </div>

         <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-[#111922] rounded-lg border border-transparent shadow-inner">
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pagar ao Vendedor</p>
               <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Kz 850.000</h4>
            </div>
            <div className="space-y-3">
               {[
                 { label: 'Asset', value: '1.000 USD', status: 'ready' },
                 { label: 'Network', value: 'ERC20 (Mock)', status: 'ready' },
                 { label: 'Expires', value: '14:55:00', status: 'timer' },
               ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                     <span className="text-slate-400">{item.label}</span>
                     <span className="text-slate-900 dark:text-white">{item.value}</span>
                  </div>
               ))}
            </div>
         </div>

         <div className="mt-8 pt-8 border-t border-slate-50 dark:border-white/5 space-y-4">
            <button className="w-full h-11 bg-primary text-white rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all">Notificar Pagamento</button>
            <button className="w-full h-11 border border-slate-100 dark:border-white/10 text-rose-500 rounded-lg font-bold uppercase text-[9px] tracking-widest hover:bg-rose-500/5 transition-all">Cancelar Trade</button>
         </div>
      </aside>
    </div>
  );
};

export default MensagensPage;
