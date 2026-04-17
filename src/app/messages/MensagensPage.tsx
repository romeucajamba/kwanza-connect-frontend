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
  ArrowRightLeft,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/constants';
import { useChatRooms, useChatMessages, useSendMessage, chatKeys, useMarkAsRead } from '@services/chat.hooks';
import { useConfirmTransaction } from '@services/transactions.hooks';
import { useOfferDetails, useRejectInterest, useCancelInterest } from '@services/offers.hooks';
import { useAuthStore } from '@store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { getAvatarUrl } from '@lib/media';
import type { Room, Message, User } from '@/types';

const MensagensPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const user_id = user?.id; 
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(roomId || null);
  const [messageText, setMessageText] = useState('');
  const [manuallyReadRooms, setManuallyReadRooms] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: rooms, isLoading: isLoadingRooms } = useChatRooms();
  const { data: messages, isLoading: isLoadingMessages } = useChatMessages(selectedRoomId || '');
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAbortModal, setShowAbortModal] = useState(false);
  const { mutate: confirmDeal, isPending: isConfirming } = useConfirmTransaction();
  const { mutate: rejectDeal, isPending: isRejecting } = useRejectInterest();
  const { mutate: cancelDeal, isPending: isCancelling } = useCancelInterest();
  const { mutate: markAsRead } = useMarkAsRead();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (roomId && roomId !== selectedRoomId) {
      setSelectedRoomId(roomId);
    }
  }, [roomId, selectedRoomId]);

  // Marcar contador como lido ao selecionar uma sala ou ao receber novas mensagens
  useEffect(() => {
    if (selectedRoomId) {
       markAsRead(selectedRoomId);

       // Marcar localmente como lida para esconder o badge imediatamente se ainda não estiver na cache
       setManuallyReadRooms(prev => new Set(prev).add(selectedRoomId));

       // O hook useMarkAsRead já faz o queryClient.setQueryData no onSuccess,
       // mas fazemos aqui também para resposta imediata
       queryClient.setQueryData<Room[]>(chatKeys.rooms(), (oldRooms) => {
         if (!oldRooms) return oldRooms;
         return oldRooms.map(room => 
           room.id === selectedRoomId 
             ? { ...room, unread_count: 0 } 
             : room
         );
       });
    }
  }, [selectedRoomId, messages?.length, markAsRead, queryClient]);

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

  // Extrair o ID da oferta (pode vir como objeto ou apenas string UUID)
  const offerId = useMemo(() => {
    if (!selectedRoom?.offer) return null;
    return typeof selectedRoom.offer === 'string' 
      ? selectedRoom.offer 
      : (selectedRoom.offer as any).id;
  }, [selectedRoom]);

  // Carregar detalhes completos da oferta se tivermos o ID
  const { data: fullOffer } = useOfferDetails(offerId || '');

  const handleConfirmDeal = () => {
    if (!offerId || !selectedRoomId) return;
    confirmDeal({ 
      offer: offerId,
      room: selectedRoomId
    });
    setShowConfirmModal(false);
  };

  const handleAbortNegotiation = () => {
    const interestId = selectedRoom?.interest_id;
    if (!interestId) {
      toast.error('Não foi possível identificar o vínculo desta negociação.');
      return;
    }

    const isOwner = fullOffer?.owner?.id === user_id;
    
    if (isOwner) {
      rejectDeal(interestId, {
        onSuccess: () => {
          setShowAbortModal(false);
          setSelectedRoomId(null);
          navigate('/mensagens');
        }
      });
    } else {
      cancelDeal(interestId, {
        onSuccess: () => {
          setShowAbortModal(false);
          setSelectedRoomId(null);
          navigate('/mensagens');
        }
      });
    }
  };

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
               const isMeLast = lastMsg?.sender?.id === user_id;
               // Só é considerada não lida se o servidor disser que há, se não foi eu a enviar E se não a li manualmente nesta sessão
               const hasUnread = room.unread_count > 0 && !isMeLast && !manuallyReadRooms.has(room.id);

                return (
                  <button 
                     key={room.id}
                     onClick={() => navigate(`/mensagens/${room.id}`)}
                     className={`w-full p-4 flex items-center gap-3 border-b border-slate-50 dark:border-white/5 transition-all hover:bg-slate-50 dark:hover:bg-white/5 relative ${selectedRoomId === room.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                  >
                     <div className="relative flex-shrink-0">
                        <div className="size-11 rounded-xl bg-slate-100 dark:bg-white/5 bg-center bg-cover border border-slate-100 dark:border-white/10" style={{ backgroundImage: `url(${getAvatarUrl(other?.avatar, other?.full_name)})` }} />
                        <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#192633]" />
                     </div>
                     <div className="flex-1 min-w-0 text-left">
                        <h4 className={`text-[11px] font-black uppercase truncate mb-1 ${hasUnread ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                           {other?.full_name || 'Participante'}
                        </h4>
                        <p className={`text-[10px] uppercase tracking-tight truncate ${hasUnread ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-500 dark:text-slate-400 opacity-70'}`}>
                           {lastMsg?.content || 'Sem mensagens ainda'}
                        </p>
                     </div>

                      {/* Info da Direita: Hora e Badge */}
                      <div className="flex flex-col items-end justify-between self-stretch py-1">
                         <span className={`text-[7px] font-black uppercase tracking-widest leading-none ${hasUnread ? 'text-primary' : 'text-slate-400'}`}>
                            {lastMsg?.created_at ? format(new Date(lastMsg.created_at), 'HH:mm') : ''}
                         </span>
                         
                         {hasUnread && (
                            <div className="size-5 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse">
                               {room.unread_count}
                            </div>
                         )}
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
                     <button onClick={() => navigate('/mensagens')} className="md:hidden p-2 text-slate-400">
                        <ChevronLeft className="size-5" />
                     </button>
                      <div 
                        className="size-10 rounded-xl bg-slate-100 dark:bg-white/5 bg-center bg-cover border border-slate-100 dark:border-white/10" 
                        style={{ backgroundImage: `url(${getAvatarUrl(otherUser?.avatar, otherUser?.full_name)})` }} 
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

                  <div className="flex items-center gap-2">
                     {offerId && fullOffer?.owner?.id === user_id && (
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={() => setShowAbortModal(true)}
                             className="hidden lg:flex items-center justify-center size-9 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-lg hover:text-rose-500 transition-all border border-slate-100 dark:border-white/5 active:scale-95"
                             title="Rejeitar Negociação"
                           >
                              <XCircle className="size-4" />
                           </button>
                           <button 
                             onClick={() => setShowConfirmModal(true)}
                             className="hidden lg:flex items-center gap-2 px-4 h-9 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                           >
                              <CheckCircle2 className="size-3.5" />
                              Confirmar Negócio
                           </button>
                        </div>
                     )}
                     {!isConfirming && offerId && fullOffer?.owner?.id !== user_id && (
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={() => setShowAbortModal(true)}
                             className="hidden lg:flex items-center justify-center size-9 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-lg hover:text-rose-500 transition-all border border-slate-100 dark:border-white/5 active:scale-95"
                             title="Cancelar Interesse"
                           >
                              <XCircle className="size-4" />
                           </button>
                           <div className="hidden lg:flex items-center gap-2 px-4 h-9 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/5">
                              <RefreshCcw className="size-3 animate-spin-slow" />
                              Aguardando Confirmação
                           </div>
                        </div>
                     )}
                     <div className="flex items-center gap-1.5 ml-1 border-l border-slate-100 dark:border-white/5 pl-3">
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
                        // Agora usamos o sender_id vindo diretamente do backend
                        const isMe = msg.sender_id === user_id;
                        
                        return (
                          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                             className={`flex ${isMe ? 'justify-end' : 'justify-start'} group/msg w-full mb-1`}
                          >
                             <div className={`max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div 
                                  className={`p-3 px-4 rounded-2xl shadow-sm text-[11px] font-bold leading-relaxed transition-all 
                                    ${isMe 
                                      ? 'bg-gradient-to-br from-primary to-indigo-600 text-white rounded-tr-none shadow-primary/20' 
                                      : 'bg-white dark:bg-[#111922] text-slate-900 dark:text-white border border-slate-100 dark:border-white/5 rounded-tl-none'
                                    }`}
                                >
                                   {msg.content}
                                </div>
                                <div className={`flex items-center gap-2 mt-1.5 px-1 opacity-60 group-hover/msg:opacity-100 transition-opacity ${isMe ? 'flex-row' : 'flex-row-reverse'}`}>
                                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                     {msg.created_at ? format(new Date(msg.created_at), 'HH:mm') : ''}
                                   </span>
                                   {isMe && <CheckCircle2 className="size-2.5 text-blue-500" />}
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

      {/* Modal de Confirmação de Negócio */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#192633] w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden"
            >
              <div className="p-6">
                <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                  <ShieldCheck className="size-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Finalizar Negócio</h3>
                <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-widest leading-relaxed">
                  Ao confirmar, você declara que as condições acordadas foram cumpridas e o negócio será selado permanentemente.
                </p>

                {offerId && (
                  <div className="mt-6 p-4 bg-slate-50 dark:bg-[#111922] rounded-xl border border-slate-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-2 text-[9px] font-black uppercase text-slate-400">
                      <span>Valores Acordados</span>
                      <span className="text-primary italic">P2P Escrow</span>
                    </div>
                    <div className="flex items-center justify-between font-mono">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {Number(fullOffer?.give_amount || 0).toLocaleString()} <span className="text-[10px] opacity-40">{fullOffer?.give_currency?.code || '---'}</span>
                      </div>
                      <ArrowRightLeft className="size-3 text-slate-300 mx-2" />
                      <div className="text-xs font-bold text-emerald-500 text-right">
                         {Number(fullOffer?.want_amount || 0).toLocaleString()} <span className="text-[10px] opacity-60">{fullOffer?.want_currency?.code || '---'}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 h-11 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 dark:hover:text-white transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleConfirmDeal}
                    disabled={isConfirming}
                    className="flex-2 h-11 px-8 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isConfirming ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                    Selar Negócio
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Abortar (Rejeitar/Cancelar) Negociação */}
      <AnimatePresence>
        {showAbortModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#192633] w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden"
            >
              <div className="p-8">
                 <div className="size-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6 mx-auto">
                    <XCircle className="size-8" />
                 </div>
                 <h3 className="text-xl font-black text-center text-slate-900 dark:text-white uppercase tracking-tight">
                   {fullOffer?.owner?.id === user_id ? 'Rejeitar Negociação?' : 'Cancelar Interesse?'}
                 </h3>
                 <p className="text-[11px] font-bold text-center text-slate-400 mt-3 uppercase tracking-widest leading-relaxed">
                   {fullOffer?.owner?.id === user_id 
                    ? 'Ao rejeitar, a sala de chat será encerrada e o interessado será notificado.' 
                    : 'Ao cancelar, o seu interesse será removido e esta conversa será encerrada.'}
                 </p>

                 <div className="mt-8 flex gap-3">
                    <button 
                      onClick={() => setShowAbortModal(false)}
                      className="flex-1 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-all"
                    >
                      Voltar
                    </button>
                    <button 
                      onClick={handleAbortNegotiation}
                      disabled={isRejecting || isCancelling}
                      className="flex-[1.5] h-12 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                    >
                      {(isRejecting || isCancelling) ? (
                        <RefreshCcw className="size-4 animate-spin" />
                      ) : (
                        <XCircle className="size-4" />
                      )}
                      Confirmar {fullOffer?.owner?.id === user_id ? 'Rejeição' : 'Cancelamento'}
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Adicionar CSS para scrollbar personalizada no final se não existir */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.2);
        }
      `}} />
    </div>
  );
};

export default MensagensPage;
