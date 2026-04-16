import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Loader2,
  RefreshCcw,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '@/constants';
import { useChatRooms, useChatMessages, useSendMessage, useChatRoom } from '@services/chat.hooks';
import { useAuthStore } from '@store/authStore';
import { getAvatarUrl } from '@lib/media';
import type { Room, Message, User } from '@/types';

const MensagensPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const user_id = user?.id; 
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: rooms, isLoading: isLoadingRooms } = useChatRooms();
  const { data: messages, isLoading: isLoadingMessages } = useChatMessages(selectedRoomId || '');
  const { data: currentRoom } = useChatRoom(selectedRoomId || '');
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

  const getOtherUser = (room: Room): User | null => {
    const member = room.members?.find((m) => m.user?.id !== user_id);
    return member?.user || null;
  };

  const selectedRoom = useMemo(() => 
    rooms?.find((r) => r.id === selectedRoomId), 
    [rooms, selectedRoomId]
  );

  const otherUser = useMemo(() => 
    selectedRoom ? getOtherUser(selectedRoom) : null,
    [selectedRoom, user_id]
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full gap-6 pb-4 overflow-hidden mt-2">
      
      {/* Sidebar de Conversas */}
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
            ) : !rooms || rooms.length === 0 ? (
               <div className="flex flex-col items-center justify-center p-8 text-center h-full gap-4 mt-10">
                  <div className="size-16 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 border border-dashed border-slate-200 dark:border-white/10">
                     <MessageSquare className="size-8 opacity-40 text-primary" />
                  </div>
                  <div>
                     <p className="text-[11px] font-black uppercase tracking-widest text-slate-800 dark:text-white">Caixa Vazia</p>
                     <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest leading-relaxed max-w-[150px]">Nenhuma conversa ativa no momento</p>
                  </div>
               </div>
            ) : rooms.map((room) => {
               const other = getOtherUser(room);
               const lastMsg = room.last_message;
               return (
                  <button 
                     key={room.id}
                     onClick={() => setSelectedRoomId(room.id)}
                     className={`w-full p-4 flex items-center gap-3 border-b border-slate-50 dark:border-white/5 transition-all hover:bg-slate-50 dark:hover:bg-white/5 relative ${selectedRoomId === room.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                  >
                     <div className="relative flex-shrink-0">
                        <div className="size-11 rounded-xl bg-slate-100 dark:bg-white/5 bg-center bg-cover border border-slate-100 dark:border-white/10" style={{ backgroundImage: `url(${getAvatarUrl(other?.avatar, other?.email)})` }} />
                     </div>
                     <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-center mb-1">
                           <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase truncate">{other?.full_name || 'Participante'}</h4>
                           <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">
                              {lastMsg?.created_at ? format(new Date(lastMsg.created_at), 'HH:mm') : ''}
                           </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight truncate opacity-70">
                           {lastMsg?.content || 'Sem mensagens ainda'}
                        </p>
                     </div>
                  </button>
               );
            })}
         </div>
      </aside>

      {/* Janela de Chat */}
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
                        style={{ backgroundImage: `url(${getAvatarUrl(otherUser?.avatar, otherUser?.email)})` }} 
                     />
                     <div>
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
                           {otherUser?.full_name || 'Participante'}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <div className="size-1.5 rounded-full bg-emerald-500" />
                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Escrow Ativo</span>
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
                            Ambiente de Negociação Seguro
                         </span>
                      </div>
                   </div>

                   <AnimatePresence>
                     {isLoadingMessages ? (
                         <div className="flex items-center justify-center py-10">
                            <RefreshCcw className="size-6 text-primary/50 animate-spin" />
                         </div>
                     ) : messages?.map((msg: Message) => {
                       const isMe = msg.sender?.id === user_id;
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
                                    {msg.created_at ? format(new Date(msg.created_at), 'HH:mm') : ''}
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
          ) : !rooms || rooms.length === 0 ? (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center"
            >
               <div className="size-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 shadow-xl shadow-primary/5 animate-pulse">
                  <MessageSquare className="size-10" />
               </div>
               <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Inicia a tua primeira <span className="text-primary italic">negociação</span>
               </h3>
               <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-widest leading-relaxed max-w-sm">
                  Para interagir com outros negociadores, podes publicar uma nova oferta ou aceitar propostas no mercado P2P.
               </p>
               
               <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full max-w-xs sm:max-w-md">
                  <Link 
                    to={APP_ROUTES.P2P_BROWSE}
                    className="w-full h-11 bg-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Users className="size-4" />
                    Explorar Mercado
                  </Link>
                  <Link 
                    to={APP_ROUTES.P2P_POST}
                    className="w-full h-11 bg-white dark:bg-[#111922] text-slate-900 dark:text-white border border-slate-100 dark:border-white/5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="size-4" />
                    Criar Oferta
                  </Link>
               </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
               <MessageSquare className="size-16 mb-6 text-primary" />
               <h3 className="text-sm font-black uppercase tracking-tight">Nenhuma Conversa Selecionada</h3>
               <p className="text-[10px] font-bold uppercase tracking-widest max-w-xs mt-2">Escolha uma negociação ao lado para começar a comunicar com segurança.</p>
            </div>
          )}
      </main>

      {/* Sidebar de Detalhes do Trade */}
 
    </div>
  );
};

export default MensagensPage;
