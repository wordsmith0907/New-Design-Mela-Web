import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Hash, Users, MessageSquare, ShieldCheck, Flame, Medal } from 'lucide-react';
import { DiscordMessage } from '../types';

interface DiscordTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onClaimRole: () => void;
  hasYielderRole: boolean;
}

export default function DiscordTerminal({ isOpen, onClose, userEmail, onClaimRole, hasYielderRole }: DiscordTerminalProps) {
  const [messages, setMessages] = useState<DiscordMessage[]>([
    {
      id: 'm1',
      user: 'AlphaStaker_99',
      avatar: '🐳',
      role: 'Yielder',
      message: 'Just locked another 5,000 RIVR in the Alpha Stream vault. The 14.8% APY is crazy right now!',
      time: '04:12 PM',
    },
    {
      id: 'm2',
      user: 'DeFi_Enthusiast',
      avatar: '🦊',
      role: 'Mod',
      message: 'Welcome everyone! Remember, all liquid wrappers (fRIVR and fETH) can be pooled directly in our decentralized vaults or redeemed instantly. Stay liquid!',
      time: '04:14 PM',
    },
    {
      id: 'm3',
      user: 'Crypto_Queen',
      avatar: '🦄',
      role: 'Yielder',
      message: 'Does anyone know if the NFT multipliers stack with the lock duration bonuses?',
      time: '04:18 PM',
    },
    {
      id: 'm4',
      user: 'Riv_CoreDev',
      avatar: '⚡',
      role: 'Core Dev',
      message: '@Crypto_Queen yes! The NFT boost multiplies your calculated APR by 1.25x after adding the lock duration bonus. It’s highly optimal.',
      time: '04:20 PM',
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [activeChannel, setActiveChannel] = useState<string>('yield-strategies');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const defaultUsername = userEmail ? userEmail.split('@')[0] : 'Wordsmith_Yielder';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Handle message sending
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: DiscordMessage = {
      id: `m-user-${Date.now()}`,
      user: defaultUsername,
      avatar: '🧑‍🚀',
      role: hasYielderRole ? 'Yielder' : 'Yielder',
      message: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Trigger funny automated reply in 1.5 seconds
    setTimeout(() => {
      const bots = [
        { name: 'DeFi_Enthusiast', avatar: '🦊', role: 'Mod' as const, msg: 'Good point! We are launching two more Smart Vaults next week. Keep an eye on #announcements!' },
        { name: 'Riv_CoreDev', avatar: '⚡', role: 'Core Dev' as const, msg: 'Thanks for the message! Feel free to check our Technical Documentation Library at the bottom right. It covers the contracts in detail.' },
        { name: 'AlphaStaker_99', avatar: '🐳', role: 'Yielder' as const, msg: 'LFG! The community is growing so fast, 5.2k active yielders and climbing daily.' }
      ];

      const chosenBot = bots[Math.floor(Math.random() * bots.length)];
      const botMsg: DiscordMessage = {
        id: `m-bot-${Date.now()}`,
        user: chosenBot.name,
        avatar: chosenBot.avatar,
        role: chosenBot.role,
        message: chosenBot.msg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="discord-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Discord Interface Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative flex h-[550px] w-full max-w-4xl overflow-hidden rounded-3xl border border-indigo-500/25 bg-slate-900 shadow-2xl backdrop-blur-xl"
          >
            {/* Sidebar Channels */}
            <div className="hidden md:flex w-64 flex-col bg-slate-950 border-r border-white/5 p-4 justify-between">
              <div>
                {/* Server Banner */}
                <div className="flex items-center gap-2 px-2 pb-4 border-b border-white/5">
                  <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center font-display font-black text-white">
                    F
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-100">Fluid Yielders</h4>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      1,842 Online
                    </span>
                  </div>
                </div>

                {/* Channel List */}
                <div className="mt-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Text Channels</span>
                  {[
                    { id: 'yield-strategies', label: 'yield-strategies' },
                    { id: 'general-chat', label: 'general-chat' },
                    { id: 'announcements', label: 'announcements' },
                  ].map(chan => (
                    <button
                      key={chan.id}
                      onClick={() => setActiveChannel(chan.id)}
                      className={`flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        activeChannel === chan.id
                          ? 'bg-indigo-600/15 text-indigo-400'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      <Hash className="h-4 w-4" />
                      {chan.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Account State */}
              <div className="bg-slate-900/50 rounded-2xl p-3 border border-white/5 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold">
                    🧑‍🚀
                  </div>
                  <div className="truncate">
                    <p className="font-mono text-[11px] font-bold text-slate-200 truncate">{defaultUsername}</p>
                    <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                      {hasYielderRole ? 'Senior Yielder' : 'Claim Role Below'}
                    </span>
                  </div>
                </div>

                {!hasYielderRole ? (
                  <button
                    onClick={onClaimRole}
                    className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:opacity-90 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <Medal className="h-3 w-3" />
                    Claim "Yielder" Role
                  </button>
                ) : (
                  <div className="py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Yielder Role Active
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col justify-between bg-slate-900/70">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-slate-400" />
                  <span className="font-display font-bold text-slate-100">{activeChannel}</span>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 text-sm">
                    <span className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-lg shadow-sm">
                      {msg.avatar}
                    </span>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-slate-200 truncate">{msg.user}</span>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          msg.role === 'Core Dev'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : msg.role === 'Mod'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {msg.role}
                        </span>
                        <span className="text-[10px] text-slate-500">{msg.time}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed break-words">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-slate-950/40">
                <div className="relative flex items-center bg-white/5 rounded-2xl border border-white/5 focus-within:border-indigo-500/40 transition-colors px-4 py-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message #${activeChannel}`}
                    className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="rounded-xl p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all shadow"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
