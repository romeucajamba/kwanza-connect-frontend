import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatRooms, useChatMessages, useSendMessage } from '@services';
import { useAuthStore } from '@store/authStore';
import { format } from 'date-fns';
import type { Room, Message, RoomMember } from '../types';

const MensagensPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<'chat' | 'notifications'>('chat');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const { data: rooms, isLoading: roomsLoading } = useChatRooms();
  const { data: messages, isLoading: messagesLoading } = useChatMessages(selectedRoomId || '');
  const { mutate: sendMessage, isPending: sending } = useSendMessage();

  const activeRoom = useMemo(() => 
    rooms?.find((r: Room) => r.id === selectedRoomId), 
  [rooms, selectedRoomId]);

  const otherMember = useMemo(() => {
    if (!activeRoom || !user) return null;
    return activeRoom.members.find((m: RoomMember) => m.user.id !== user.id)?.user;
  }, [activeRoom, user]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId || !newMessage.trim()) return;
    sendMessage({ roomId: selectedRoomId, content: newMessage });
    setNewMessage('');
  };

  if (roomsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="size-12 border-4 border-primary border-t-transparent rounded-full" 
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden font-display transition-colors">
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Conversations Sidebar */}
        <motion.aside 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full md:w-[350px] lg:w-[400px] flex flex-col bg-white dark:bg-[#111922] border-r border-gray-100 dark:border-white/5 h-full overflow-hidden shrink-0"
        >
          <div className="p-6 border-b border-gray-50 dark:border-white/5">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Comunicação</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Gerencie suas negociações P2P</p>
          </div>

          <div className="flex p-2 gap-1 bg-gray-50 dark:bg-[#101922]/50 border-b border-gray-50 dark:border-white/5">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === 'chat' ? 'bg-white dark:bg-[#192633] text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Chat
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === 'notifications' ? 'bg-white dark:bg-[#192633] text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Alertas
            </button>
          </div>

          <div className="p-4 border-b border-gray-50 dark:border-white/5">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
              <input 
                className="w-full h-10 pl-10 pr-4 bg-gray-100 dark:bg-[#101922] border-none rounded-xl text-xs font-black outline-none focus:ring-2 focus:ring-primary/30 transition-all uppercase tracking-widest"
                placeholder="Pesquisar conversas..."
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {rooms?.map((room: Room) => {
              const other = room.members.find(m => m.user.id !== user?.id)?.user;
              return (
                <div 
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`flex items-center gap-4 px-6 py-5 cursor-pointer transition-all border-l-4 ${selectedRoomId === room.id ? 'bg-primary/5 border-primary dark:bg-primary/10' : 'border-transparent hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                  <div className="relative">
                    <div className="size-12 rounded-full bg-background-light dark:bg-background-dark border-2 border-white dark:border-[#111922] shadow-sm flex items-center justify-center overflow-hidden">
                      <img 
                        src={other?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${other?.id}`} 
                        alt={other?.full_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#111922]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">{other?.full_name || 'Sistema'}</h3>
                      {room.last_message && (
                        <span className="text-[10px] font-bold text-gray-400">
                          {format(new Date(room.last_message.created_at), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] truncate ${room.unread_count > 0 ? 'font-black text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                      {room.last_message?.content || 'Inicie a conversa...'}
                    </p>
                  </div>
                  {room.unread_count > 0 && (
                    <div className="size-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black">
                      {room.unread_count}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-gray-50 dark:bg-[#0d1117] h-full overflow-hidden relative">
          <AnimatePresence mode="wait">
            {selectedRoomId && activeRoom ? (
              <motion.div 
                key={selectedRoomId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full"
              >
                {/* Chat Top Bar */}
                <div className="flex items-center justify-between p-4 px-8 bg-white dark:bg-[#111922] border-b border-gray-100 dark:border-white/5 z-10 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="size-10 rounded-full bg-background-light dark:bg-background-dark border border-gray-100 dark:border-white/5 flex items-center justify-center overflow-hidden">
                        <img 
                          src={otherMember?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherMember?.id}`} 
                          alt={otherMember?.full_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#111922]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">{otherMember?.full_name}</h2>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Ativo Agora</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-primary transition-all"><span className="material-symbols-outlined">search</span></button>
                    <button className="p-2 text-gray-400 hover:text-rose-500 transition-all"><span className="material-symbols-outlined">report</span></button>
                    <button className="p-2 text-gray-400 hover:text-primary transition-all"><span className="material-symbols-outlined">more_horiz</span></button>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-100">
                  {messagesLoading ? (
                    <div className="flex justify-center p-10"><span className="animate-spin material-symbols-outlined text-primary">sync</span></div>
                  ) : (
                    <>
                      <div className="flex justify-center">
                        <span className="px-4 py-1.5 rounded-full bg-gray-200/50 dark:bg-white/5 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Conversa Protegida</span>
                      </div>

                      {messages?.map((msg: Message) => (
                        <div key={msg.id} className={`flex ${msg.sender.id === user?.id ? 'justify-end' : 'justify-start'} items-end gap-3`}>
                          {msg.sender.id !== user?.id && (
                            <div className="size-8 rounded-full bg-background-light dark:bg-background-dark shrink-0 overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm">
                               <img src={msg.sender.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender.id}`} alt="" className="w-full h-full object-contain" />
                            </div>
                          )}
                          <div className={`max-w-[70%] space-y-1`}>
                            <div className={`p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed ${
                              msg.sender.id === user?.id 
                                ? 'bg-primary text-white rounded-br-none' 
                                : 'bg-white dark:bg-[#192633] text-gray-900 dark:text-white border border-gray-100 dark:border-white/5 rounded-bl-none'
                            }`}>
                              {msg.content}
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-bold text-gray-400 ${msg.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}>
                              {format(new Date(msg.created_at), 'HH:mm')}
                              {msg.sender.id === user?.id && <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  <div className="flex items-center justify-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 max-w-md mx-auto">
                    <span className="material-symbols-outlined text-yellow-500">lock</span>
                    <p className="text-[10px] font-black text-yellow-700 dark:text-yellow-500 uppercase tracking-wider">Negociação via Escrow. Liberação de fundos após confirmação.</p>
                  </div>
                </div>

                {/* Message Input Bar */}
                <div className="p-6 bg-white dark:bg-[#111922] border-t border-gray-100 dark:border-white/5">
                  <form onSubmit={handleSend} className="flex items-center gap-4 bg-gray-50 dark:bg-[#101922] rounded-2xl p-2 pl-4 shadow-inner border border-gray-100 dark:border-white/5">
                    <button type="button" className="p-2 text-gray-400 hover:text-primary transition-all"><span className="material-symbols-outlined">attach_file</span></button>
                    <input 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sending}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
                      placeholder={`Escreva uma mensagem para ${otherMember?.full_name || '...'} `}
                    />
                    <button 
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="size-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all group disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">send</span>
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <div className="size-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-4xl">chat_bubble</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">Suas Conversas</h3>
                <p className="text-sm font-medium max-w-xs">Selecione uma conversa para começar a negociar ou verifique suas notificações.</p>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MensagensPage;
