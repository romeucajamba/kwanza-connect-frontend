import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  MessageSquare, 
  CheckCircle2, 
  Plus,
  Paperclip,
  Smile,
  ShieldCheck,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useChatRooms, useChatMessages, useSendMessage } from '@services/chat.hooks';
import { useAuthStore } from '@store/authStore';
import { getAvatarUrl } from '@lib/media';

const MensagensPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const user_id = user?.id; // Cache safe id
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: rooms, isLoading: isLoadingRooms } = useChatRooms();
  const { data: messages, isLoading: isLoadingMessages } = useChatMessages(selectedRoomId || '');
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedRoomId) return;
    
    sendMessage({ roomId: selectedRoomId, content: messageText }, {
      onSuccess: () => setMessageText(''),
    });
  };

  const selectedRoom = selectedRoomId ? rooms?.find((r: any) => r.id === selectedRoomId) : null;

  const getSafeDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full gap-6 pb-4 overflow-hidden mt-2">
      
      {/* Sidebar de Conversas Compacta */}
      <aside className={`flex-col bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md overflow-hidden transition-all duration-300 flex w-full md:w-80 lg:w-96 ${selectedRoomId ? 'hidden md:flex' : 'flex'}`}>
         <div className="p-4 border-b border-slate-50 dark:border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
               <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Conversas</h2>
               <button className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all">
                  <Plus className="size-4" />
               </button>
            </div>
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-300 group-focus-within:text-primary transition-colors" />
               <input 
                  type="text" 
                  placeholder="Pesquisar..."
                  className="w-full bg-slate-50 dark:bg-[#111922] border-none rounded-lg pl-10 pr-4 py-2 text-[11px] font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-300"
               />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoadingRooms ? (
               <div className="flex items-center justify-center p-10">
                  <Loader2 className="size-6 text-primary animate-spin" />
               </div>
            ) : rooms?.length === 0 ? (
               <div className="flex flex-col items-center justify-center p-8 text-center h-full gap-4 mt-10">
                  <div className="size-16 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 border border-dashed border-slate-200 dark:border-white/10">
                     <MessageSquare className="size-8 opacity-40 text-primary" />
                  </div>
                  <div>
                     <p className="text-[11px] font-black uppercase tracking-widest text-slate-800 dark:text-white">Caixa Vazia</p>
                     <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest leading-relaxed max-w-[150px]">Nenhuma conversa ativa no momento</p>
                  </div>
               </div>
            ) : rooms?.map((room: any) => {
               if (!room) return null;
               const participants = room.participants || [];
               const otherUser = participants.find((p: any) => p?.id !== user_id) || room.creator || { full_name: 'Participante', email: 'user@kwanza.ao' };
               const lastMsg = room.last_message;
               const lastDate = lastMsg?.timestamp ? getSafeDate(lastMsg.timestamp) : null;
               return (
                  <button 
                     key={room.id}
                     onClick={() => setSelectedRoomId(room.id)}
                     className={`w-full p-4 flex items-center gap-3 border-b border-slate-50 dark:border-white/5 transition-all hover:bg-slate-50 dark:hover:bg-white/5 relative ${selectedRoomId === room.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                  >
                     <div className="relative flex-shrink-0">
                        <div className="size-11 rounded-xl bg-slate-100 dark:bg-white/5 bg-center bg-cover border border-slate-100 dark:border-white/10" style={{ backgroundImage: `url(${getAvatarUrl(otherUser?.avatar, otherUser?.email)})` }} />
                        {otherUser?.is_online && (
                           <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#192633]" />
                        )}
                     </div>
                     <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-center mb-1">
                           <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase truncate">{otherUser?.full_name || otherUser?.email || 'Participante'}</h4>
                           <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">
                              {lastDate ? format(lastDate, 'HH:mm') : ''}
                           </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight truncate opacity-70">
                           {lastMsg?.content || 'Sem mensagens ainda'}
                        </p>
                     </div>
                     {room.unread_count > 0 && (
                        <div className="size-5 rounded-full bg-primary text-white text-[8px] font-black flex items-center justify-center shadow-lg shadow-primary/20">{room.unread_count}</div>
                     )}
                  </button>
               );
            })}
         </div>
      </aside>

      {/* Janela de Chat Compacta */}
      <main className={`flex-1 flex flex-col bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md overflow-hidden relative ${!selectedRoomId ? 'hidden md:flex' : 'flex'}`}>
         {selectedRoomId ? (
            <>
                <header className="p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#192633] z-10 shadow-sm">
                  <div className="flex items-center gap-3">
                     <button onClick={() => setSelectedRoomId(null)} className="md:hidden p-2 text-slate-400">
                        <ChevronLeft className="size-5" />
                     </button>
                      <div 
                        className="size-10 rounded-xl bg-slate-100 dark:bg-white/5 bg-center bg-cover border border-slate-100 dark:border-white/10" 
                        style={{ backgroundImage: `url(${getAvatarUrl(selectedRoom?.participants?.find((p: any) => p?.id !== user_id)?.avatar, selectedRoom?.participants?.find((p: any) => p?.id !== user_id)?.email)})` }} 
                     />
                     <div>
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
                           {selectedRoom?.participants?.find((p: any) => p?.id !== user_id)?.full_name || 'Usuário'}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <div className="size-1.5 rounded-full bg-emerald-500" />
                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Seguro Smart Escrow</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                     <button className="hidden sm:flex size-9 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-all items-center justify-center">
                        <Phone className="size-4" />
                     </button>
                     <button className="hidden sm:flex size-9 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-all items-center justify-center">
                        <Video className="size-4" />
                     </button>
                     <button className="size-9 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-all items-center justify-center">
                        <MoreVertical className="size-4" />
                     </button>
                  </div>
               </header>

               <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-slate-50/20 dark:bg-[#111922]/10 relative">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none" />
                  
                  <div className="flex justify-center my-4 relative z-10">
                     <div className="px-4 py-1.5 bg-white dark:bg-[#111922] rounded-full border border-slate-100 dark:border-white/5 shadow-sm">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <ShieldCheck className="size-3 text-emerald-500" />
                           Privacidade Ponta-a-Ponta Ativada
                        </span>
                     </div>
                  </div>

                  <AnimatePresence>
                    {isLoadingMessages ? (
                        <div className="flex items-center justify-center py-10">
                           <Loader2 className="size-6 text-primary/50 animate-spin" />
                        </div>
                    ) : messages?.map((msg: any) => {
                      if (!msg) return null;
                      const isMe = msg.sender === user_id || (typeof msg.sender === 'object' && msg.sender?.id === user_id);
                      const msgDate = msg.timestamp ? getSafeDate(msg.timestamp) : null;
                      return (
                        <motion.div 
                          key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'} group/msg`}
                        >
                           <div className={`max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                              <div 
                                className={`p-4 rounded-xl shadow-sm text-xs font-bold leading-relaxed transition-all 
                                  ${isMe 
                                    ? 'bg-primary text-white rounded-tr-none shadow-primary/20' 
                                    : 'bg-white dark:bg-[#192633] dark:text-white border border-slate-100 dark:border-white/5 rounded-tl-none'
                                  }`}
                              >
                                 {msg.content}
                              </div>
                              <div className={`flex items-center gap-2 mt-2 px-1 opacity-60 group-hover/msg:opacity-100 transition-opacity ${isMe ? 'flex-row' : 'flex-row-reverse'}`}>
                                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                   {msgDate ? format(msgDate, 'HH:mm', { locale: ptBR }) : ''}
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
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-slate-50 dark:bg-[#111922] p-1.5 rounded-xl border border-transparent focus-within:border-primary/20 shadow-inner group">
                     <button type="button" className="hidden sm:flex size-10 items-center justify-center rounded-lg text-slate-300 hover:text-primary transition-all active:scale-95 hover:bg-white dark:hover:bg-white/5 shadow-sm">
                        <Paperclip className="size-4" />
                     </button>
                     <input 
                        className="flex-1 bg-transparent border-none px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-300"
                        placeholder="Escreva algo seguro..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        disabled={isSending}
                     />
                     <button type="button" className="hidden sm:flex size-10 items-center justify-center rounded-lg text-slate-300 hover:text-primary transition-all hover:bg-white dark:hover:bg-white/5 shadow-sm">
                        <Smile className="size-4" />
                     </button>
                     <button 
                        type="submit" 
                        disabled={isSending || !messageText.trim()}
                        className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                     >
                        {isSending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                     </button>
                  </form>
               </footer>
            </>
         ) : (
            <>
                <header className="p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#192633] z-10 shadow-sm opacity-60">
                  <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/10">
                         <MessageSquare className="size-5 text-slate-400" />
                      </div>
                     <div>
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
                           Nenhuma Conversa Selecionada
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-80">Selecione ao lado para começar</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-50 pointer-events-none">
                     <button className="hidden sm:flex size-9 rounded-xl text-slate-400 items-center justify-center">
                        <Phone className="size-4" />
                     </button>
                     <button className="hidden sm:flex size-9 rounded-xl text-slate-400 items-center justify-center">
                        <Video className="size-4" />
                     </button>
                     <button className="size-9 rounded-xl text-slate-400 items-center justify-center">
                        <MoreVertical className="size-4" />
                     </button>
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-slate-50/20 dark:bg-[#111922]/10 relative flex flex-col justify-end">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none" />
                   
                   <div className="flex justify-center my-4 relative z-10 mt-auto">
                      <div className="px-4 py-1.5 bg-white dark:bg-[#111922] rounded-full border border-slate-100 dark:border-white/5 shadow-sm">
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="size-3 text-emerald-500" />
                            KwanzaConnect SafeChat Ativo
                         </span>
                      </div>
                   </div>

                   <div className="flex justify-start relative z-10 w-full mb-4">
                      <div className="max-w-[90%] sm:max-w-[70%] lg:max-w-[60%] flex flex-col items-start">
                         <div className="p-4 rounded-xl shadow-sm text-xs font-bold leading-relaxed bg-white dark:bg-[#192633] dark:text-white border border-slate-100 dark:border-white/5 rounded-tl-none">
                            👋 <span className="opacity-80">Bem-vindo ao canal de mensagens seguras do KwanzaConnect.</span> <br/><br/>
                            <span className="opacity-80">Todas as suas conversas no mercado P2P aparecerão aqui. O ambiente é protegido e monitorado por Escrow.</span>
                         </div>
                         <div className="flex items-center gap-2 mt-2 px-1 opacity-60">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SISTEMA</span>
                         </div>
                      </div>
                   </div>
                </div>

                <footer className="p-4 bg-white dark:bg-[#192633] border-t border-slate-50 dark:border-white/5 z-10 opacity-70">
                   <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#111922] p-1.5 rounded-xl border border-transparent shadow-inner">
                      <button type="button" disabled className="hidden sm:flex size-10 items-center justify-center rounded-lg text-slate-300">
                         <Paperclip className="size-4" />
                      </button>
                      <input 
                         className="flex-1 bg-transparent border-none px-3 py-2 text-xs font-bold text-slate-400 focus:ring-0 cursor-not-allowed placeholder:text-slate-300"
                         placeholder="Aguardando seleção de conversa..."
                         disabled
                      />
                      <button type="button" disabled className="hidden sm:flex size-10 items-center justify-center rounded-lg text-slate-300">
                         <Smile className="size-4" />
                      </button>
                      <button 
                         type="button" 
                         disabled
                         className="size-10 bg-slate-200 dark:bg-white/5 text-slate-400 rounded-xl flex items-center justify-center cursor-not-allowed"
                      >
                         <Send className="size-4" />
                      </button>
                   </div>
                </footer>
            </>
         )}
      </main>

      {/* Active Trade Sidebar Compacta */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md p-6">
         <div className="flex items-center gap-3 mb-8 border-b border-slate-50 dark:border-white/5 pb-4">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
               <ShieldCheck className="size-5" />
            </div>
            <div>
               <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Status do Trade</h3>
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Protegido por Escrow</span>
            </div>
         </div>

         <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-[#111922] rounded-xl border border-transparent shadow-inner">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-60">Valor em Negociação</p>
               <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Kz 850.000</h4>
            </div>
            <div className="space-y-3">
               {[
                 { label: 'Ativo', value: '1.000 USD', status: 'ready' },
                 { label: 'Método', value: 'MultiCaixa Express', status: 'ready' },
                 { label: 'Tempo Rest.', value: '14:55:00', status: 'timer' },
               ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                     <span className="text-slate-400">{item.label}</span>
                     <span className="text-slate-900 dark:text-white">{item.value}</span>
                  </div>
               ))}
            </div>
         </div>

         <div className="mt-auto space-y-4 pt-6 border-t border-slate-50 dark:border-white/5">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
               <p className="text-[8px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic opacity-80 uppercase tracking-tighter">
                 "Nunca envie fundos antes de verificar o comprovativo na sua conta real."
               </p>
            </div>
            <button className="w-full h-11 bg-primary text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/95 hover:scale-[1.02] active:scale-[0.98] transition-all">Notificar Pagamento</button>
         </div>
      </aside>
    </div>
  );
};

export default MensagensPage;
