import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wallet, Check, AlertCircle, Loader2 } from 'lucide-react';
import { WalletState } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (wallet: WalletState) => void;
}

export default function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const walletProviders = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect using your browser extension',
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🌐',
      description: 'Scan a QR code with your mobile wallet',
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🛡️',
      description: 'Connect to your Coinbase account securely',
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '👻',
      description: 'Connect with Phantom Solana/EVM wallet',
    },
  ];

  const handleConnect = (providerId: string) => {
    setConnectingId(providerId);
    setError(null);

    // Simulate standard extension injection check or authentication loop
    setTimeout(() => {
      if (Math.random() > 0.05) { // 95% success rate
        const randHex = () => Math.floor(Math.random() * 16).toString(16);
        const dummyAddress = `0x${Array.from({ length: 40 }, randHex).join('')}`;
        const shortAddress = `${dummyAddress.slice(0, 6)}...${dummyAddress.slice(-4)}`;

        onConnect({
          connected: true,
          address: shortAddress,
          balanceRivr: parseFloat((Math.random() * 12000 + 450).toFixed(2)),
          balanceEth: parseFloat((Math.random() * 15 + 1.2).toFixed(4)),
          provider: providerId as any,
        });
        onClose();
      } else {
        setError('Connection request rejected by user. Please approve in your wallet.');
      }
      setConnectingId(null);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="wallet-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-slate-900/90 text-white p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-indigo-400" />
                <h3 className="font-display text-lg font-semibold tracking-tight">Connect a Wallet</h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-start gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-sm text-rose-300"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="mt-5 space-y-3">
              {walletProviders.map((prov) => {
                const isConnecting = connectingId === prov.id;
                return (
                  <button
                    key={prov.id}
                    onClick={() => !connectingId && handleConnect(prov.id)}
                    disabled={connectingId !== null}
                    className="group relative flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 text-left transition-all duration-200 hover:border-indigo-500/40 hover:bg-white/10 disabled:opacity-50 disabled:hover:border-white/5 disabled:hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-2xl group-hover:scale-105 transition-transform duration-200">
                        {prov.icon}
                      </span>
                      <div>
                        <p className="font-display font-medium text-slate-100 group-hover:text-white transition-colors">
                          {prov.name}
                        </p>
                        <p className="text-xs text-slate-400">{prov.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      {isConnecting ? (
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-white/20 group-hover:border-indigo-400 transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 text-center text-xs text-slate-500">
              By connecting your wallet, you agree to our{' '}
              <a href="#" className="text-indigo-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-indigo-400 hover:underline">
                Privacy Policy
              </a>
              .
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
