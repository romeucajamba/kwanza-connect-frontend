import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MensagensPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'notifications'>('chat');
  const [selectedChat, setSelectedChat] = useState<number | null>(0);

  const contacts = [
    { id: 0, name: 'Maria Costa', lastMsg: 'Olá, podemos prosseguir com a troca?', time: '5 min', unread: 2, online: true, avatar: 'https://i.pravatar.cc/150?u=maria' },
    { id: 1, name: 'Carlos Pereira', lastMsg: 'Comprovante enviado. Por favor, confirme.', time: 'Ontem', unread: 0, online: false, avatar: 'https://i.pravatar.cc/150?u=carlos' },
    { id: 2, name: 'Sofia Alves', lastMsg: 'Tudo certo, obrigado!', time: '2d atrás', unread: 0, online: true, avatar: 'https://i.pravatar.cc/150?u=sofia' },
  ];

  const messages = [
    { id: 1, sender: 'Maria Costa', text: 'Olá, podemos prosseguir com a troca?', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'João Silva', text: 'Olá, Maria! Sim, claro. Estou pronto para enviar os AOA.', time: '10:31 AM', isMe: true },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden font-display">
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Conversations Sidebar */}
        <motion.aside 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full md:w-[350px] lg:w-[400px] flex flex-col bg-white dark:bg-[#111922] border-r border-gray-100 dark:border-white/5 h-full overflow-hidden shrink-0"
        >
          <div className="p-6 border-b border-gray-50 dark:border-white/5">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Comunicação</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Gerencie suas negociações P2P</p>
          </div>

          <div className="flex p-2 gap-1 bg-gray-50 dark:bg-[#101922]/50 border-b border-gray-50 dark:border-white/5">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === 'chat' ? 'bg-white dark:bg-[#192633] text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Chat
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === 'notifications' ? 'bg-white dark:bg-[#192633] text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Notificações
            </button>
          </div>

          <div className="p-4 border-b border-gray-50 dark:border-white/5">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
              <input 
                className="w-full h-10 pl-10 pr-4 bg-gray-100 dark:bg-[#101922] border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="Pesquisar conversas..."
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {contacts.map((contact) => (
              <div 
                key={contact.id}
                onClick={() => setSelectedChat(contact.id)}
                className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all border-l-4 ${selectedChat === contact.id ? 'bg-primary/5 border-primary dark:bg-primary/10' : 'border-transparent hover:bg-gray-50 dark:hover:bg-white/5'}`}
              >
                <div className="relative">
                  <div 
                    className="size-12 rounded-full bg-cover bg-center border-2 border-white dark:border-[#111922] shadow-sm" 
                    style={{ backgroundImage: `url(${contact.avatar})` }}
                  />
                  {contact.online && <div className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#111922]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white truncate">{contact.name}</h3>
                    <span className="text-[10px] font-bold text-gray-400">{contact.time}</span>
                  </div>
                  <p className={`text-xs truncate ${contact.unread > 0 ? 'font-black text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                    {contact.lastMsg}
                  </p>
                </div>
                {contact.unread > 0 && (
                  <div className="size-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black">
                    {contact.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-gray-50 dark:bg-[#0d1117] h-full overflow-hidden relative">
          <AnimatePresence mode="wait">
            {selectedChat !== null ? (
              <motion.div 
                key="chat-active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full"
              >
                {/* Chat Top Bar */}
                <div className="flex items-center justify-between p-4 px-8 bg-white dark:bg-[#111922] border-b border-gray-100 dark:border-white/5 z-10 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div 
                        className="size-10 rounded-full bg-cover bg-center border border-gray-100 dark:border-white/5" 
                        style={{ backgroundImage: `url(${contacts[selectedChat].avatar})` }}
                      />
                      {contacts[selectedChat].online && <div className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#111922]" />}
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-gray-900 dark:text-white leading-tight">{contacts[selectedChat].name}</h2>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{contacts[selectedChat].online ? 'Online' : 'Offline'}</p>
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
                  <div className="flex justify-center">
                    <span className="px-4 py-1.5 rounded-full bg-gray-200/50 dark:bg-white/5 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Hoje</span>
                  </div>

                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-end gap-3`}>
                      {!msg.isMe && (
                        <div className="size-8 rounded-full bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${contacts[selectedChat].avatar})` }} />
                      )}
                      <div className={`max-w-[70%] space-y-1`}>
                        <div className={`p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed ${
                          msg.isMe 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-white dark:bg-[#192633] text-gray-900 dark:text-white border border-gray-100 dark:border-white/5 rounded-bl-none'
                        }`}>
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] font-bold text-gray-400 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                          {msg.time}
                          {msg.isMe && <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 max-w-md mx-auto">
                    <span className="material-symbols-outlined text-yellow-500">hourglass_top</span>
                    <p className="text-[10px] font-black text-yellow-700 dark:text-yellow-500 uppercase tracking-wider">Negociação em andamento. Não compartilhe senhas fora da plataforma.</p>
                  </div>
                </div>

                {/* Message Input Bar */}
                <div className="p-6 bg-white dark:bg-[#111922] border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#101922] rounded-2xl p-2 pl-4 shadow-inner border border-gray-100 dark:border-white/5">
                    <button className="p-2 text-gray-400 hover:text-primary transition-all"><span className="material-symbols-outlined">attach_file</span></button>
                    <button className="p-2 text-gray-400 hover:text-primary transition-all"><span className="material-symbols-outlined">sentiment_satisfied</span></button>
                    <input 
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
                      placeholder="Escreva uma mensagem para Maria..."
                    />
                    <button className="size-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all group">
                      <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">send</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <div className="size-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-4xl">chat_bubble</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Suas Conversas</h3>
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
