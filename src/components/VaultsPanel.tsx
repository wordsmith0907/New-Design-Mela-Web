import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ShieldAlert, Coins, HelpCircle, ArrowRightLeft, ArrowUpRight, TrendingUp, DollarSign, Wallet, X } from 'lucide-react';
import { WalletState, SmartVault } from '../types';

interface VaultsPanelProps {
  wallet: WalletState;
  onConnectWallet: () => void;
  onUpdateWallet: (wallet: WalletState) => void;
}

export default function VaultsPanel({ wallet, onConnectWallet, onUpdateWallet }: VaultsPanelProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'deposits'>('all');
  const [vaults, setVaults] = useState<SmartVault[]>([
    {
      id: 'v1',
      name: 'RIVR Alpha Stream',
      asset: 'RIVR',
      apr: 14.8,
      tvl: 24200000,
      userDeposit: 2500,
      riskScore: 'Low',
      duration: 'Flexible',
      icon: '🌊',
    },
    {
      id: 'v2',
      name: 'Ethereum Liquid Tide',
      asset: 'ETH',
      apr: 8.2,
      tvl: 48500000,
      userDeposit: 0,
      riskScore: 'Low',
      duration: 'Flexible',
      icon: '💎',
    },
    {
      id: 'v3',
      name: 'RIVR Premium NFT Vault',
      asset: 'NFT / RIVR',
      apr: 24.6,
      tvl: 12100000,
      userDeposit: 0,
      riskScore: 'High',
      duration: '90 Days Lock',
      icon: '🎨',
    },
    {
      id: 'v4',
      name: 'RIVR-USDC High Yield Stream',
      asset: 'LP TOKEN',
      apr: 18.5,
      tvl: 18900000,
      userDeposit: 800,
      riskScore: 'Medium',
      duration: 'Flexible',
      icon: '⚖️',
    },
  ]);

  const [selectedVault, setSelectedVault] = useState<SmartVault | null>(null);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [txAmount, setTxAmount] = useState<string>('');
  const [txError, setTxError] = useState<string>('');
  const [txSuccess, setTxSuccess] = useState<boolean>(false);

  const activeVaults = vaults.filter(v => activeTab === 'all' || v.userDeposit > 0);

  const handleOpenTx = (vault: SmartVault, type: 'deposit' | 'withdraw') => {
    if (!wallet.connected) {
      onConnectWallet();
      return;
    }
    setSelectedVault(vault);
    setTransactionType(type);
    setTxAmount('');
    setTxError('');
    setTxSuccess(false);
  };

  const handleExecuteTx = () => {
    if (!selectedVault) return;
    setTxError('');
    const amountNum = parseFloat(txAmount) || 0;

    if (amountNum <= 0) {
      setTxError('Please enter a valid positive amount.');
      return;
    }

    if (transactionType === 'deposit') {
      const isRivr = selectedVault.asset.includes('RIVR') || selectedVault.asset === 'LP TOKEN';
      const userBalance = isRivr ? wallet.balanceRivr : wallet.balanceEth;

      if (userBalance < amountNum) {
        setTxError(`Insufficient wallet balance. You have ${userBalance} ${isRivr ? 'RIVR' : 'ETH'}.`);
        return;
      }

      // Execute deposit
      setVaults(prev => prev.map(v => {
        if (v.id === selectedVault.id) {
          return { ...v, userDeposit: v.userDeposit + amountNum, tvl: v.tvl + amountNum };
        }
        return v;
      }));

      onUpdateWallet({
        ...wallet,
        balanceRivr: isRivr ? parseFloat((wallet.balanceRivr - amountNum).toFixed(2)) : wallet.balanceRivr,
        balanceEth: !isRivr ? parseFloat((wallet.balanceEth - amountNum).toFixed(4)) : wallet.balanceEth,
      });

    } else {
      // Withdrawal
      if (selectedVault.userDeposit < amountNum) {
        setTxError(`Insufficient vault deposit. You have deposited ${selectedVault.userDeposit} ${selectedVault.asset}.`);
        return;
      }

      // Execute withdraw
      setVaults(prev => prev.map(v => {
        if (v.id === selectedVault.id) {
          return { ...v, userDeposit: v.userDeposit - amountNum, tvl: v.tvl - amountNum };
        }
        return v;
      }));

      const isRivr = selectedVault.asset.includes('RIVR') || selectedVault.asset === 'LP TOKEN';
      onUpdateWallet({
        ...wallet,
        balanceRivr: isRivr ? parseFloat((wallet.balanceRivr + amountNum).toFixed(2)) : wallet.balanceRivr,
        balanceEth: !isRivr ? parseFloat((wallet.balanceEth + amountNum).toFixed(4)) : wallet.balanceEth,
      });
    }

    setTxSuccess(true);
    setTimeout(() => {
      setSelectedVault(null);
    }, 1500);
  };

  return (
    <div id="smart-vaults-section" className="w-full max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-500 uppercase font-mono">
            Ecosystem Yielders
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-800 mt-1">
            Active Smart Vaults
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mt-1">
            Secure, automated non-custodial smart contracts that maximize asset yield and provide instant liquidity wrapped access.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/60 p-1.5 rounded-2xl border border-slate-300/30">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-[#ffeeff] text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Smart Vaults
          </button>
          <button
            onClick={() => setActiveTab('deposits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'deposits'
                ? 'bg-[#ffeeff] text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            My Active Deposits
            {vaults.some(v => v.userDeposit > 0) && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
          </button>
        </div>
      </div>

      {activeVaults.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center bg-[#ffeeff]/50">
          <Coins className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No active deposits found.</p>
          <p className="text-slate-400 text-xs mt-1">Connect your wallet and deposit into any smart vault above to start earning yields.</p>
          <button
            onClick={() => setActiveTab('all')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors"
          >
            Browse Vaults
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeVaults.map((vault) => (
            <motion.div
              key={vault.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-[#ffeeff] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Top Row: Icon + Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl filter drop-shadow-sm">{vault.icon}</span>
                <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  vault.riskScore === 'Low'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : vault.riskScore === 'Medium'
                      ? 'bg-amber-50 border border-amber-200 text-amber-700'
                      : 'bg-rose-50 border border-rose-200 text-rose-700'
                }`}>
                  {vault.riskScore === 'Low' ? (
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="h-3 w-3" />
                  )}
                  {vault.riskScore} Risk
                </div>
              </div>

              {/* Title & Asset info */}
              <div className="mb-4">
                <h3 className="font-display font-bold text-lg text-slate-800 leading-tight">
                  {vault.name}
                </h3>
                <span className="text-xs font-mono font-bold text-slate-400">
                  Underlying Asset: {vault.asset}
                </span>
              </div>

              {/* Stats Block */}
              <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-100 py-3 mb-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    APY/APR
                  </span>
                  <div className="text-xl font-display font-extrabold text-emerald-600 flex items-center gap-0.5">
                    {vault.apr}%
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    TVL (Cap)
                  </span>
                  <div className="text-base font-bold text-slate-700 mt-0.5">
                    ${(vault.tvl / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>

              {/* User deposits section */}
              {vault.userDeposit > 0 && (
                <div className="bg-indigo-50 border border-indigo-100/50 rounded-2xl p-3.5 mb-4">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                    <span>Your Deposit</span>
                    <span>Accruing APY</span>
                  </div>
                  <div className="flex justify-between items-end mt-1">
                    <span className="text-sm font-bold text-indigo-900">
                      {vault.userDeposit} {vault.asset}
                    </span>
                    <span className="text-xs text-emerald-600 font-bold font-mono">
                      +${((vault.userDeposit * (vault.apr / 100)) / 365).toFixed(3)}/day
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {vault.userDeposit > 0 ? (
                  <>
                    <button
                      onClick={() => handleOpenTx(vault, 'withdraw')}
                      className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-colors"
                    >
                      Withdraw
                    </button>
                    <button
                      onClick={() => handleOpenTx(vault, 'deposit')}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
                    >
                      Deposit
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleOpenTx(vault, 'deposit')}
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
                  >
                    Deposit Capital <ArrowRightLeft className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Mini Deposit/Withdraw Drawer Modal */}
      <AnimatePresence>
        {selectedVault && (
          <div id="tx-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVault(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-[#ffeeff] p-6 shadow-2xl text-slate-900"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-display font-bold text-lg text-slate-800 uppercase tracking-wide">
                  {transactionType === 'deposit' ? 'Deposit Assets' : 'Withdraw Assets'}
                </h3>
                <button
                  onClick={() => setSelectedVault(null)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {txSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-slate-800 text-lg">Transaction Confirmed!</h4>
                  <p className="text-slate-500 text-xs leading-normal">
                    Smart contract execution successful. Your wallet balance and smart vault positions have been synchronized.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-[#ffeeff]/45 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Target Vault</p>
                      <p className="font-display font-bold text-slate-700">{selectedVault.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Vault Yield</p>
                      <p className="text-sm font-bold text-emerald-600">{selectedVault.apr}% APY</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Available Balance:</span>
                      <span className="font-mono text-slate-600 font-bold">
                        {transactionType === 'deposit'
                          ? `${(selectedVault.asset.includes('RIVR') || selectedVault.asset === 'LP TOKEN') ? wallet.balanceRivr : wallet.balanceEth} ${selectedVault.asset}`
                          : `${selectedVault.userDeposit} ${selectedVault.asset}`
                        }
                      </span>
                    </div>

                    <div className="relative rounded-2xl border border-slate-200 bg-[#ffeeff]/20 p-4 focus-within:border-indigo-500 focus-within:bg-[#ffeeff]/45 transition-all">
                      <div className="flex items-center justify-between">
                        <input
                          type="number"
                          value={txAmount}
                          onChange={(e) => setTxAmount(e.target.value)}
                          placeholder="0.0"
                          className="w-2/3 bg-transparent text-xl font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-slate-800"
                        />
                        <button
                          onClick={() => {
                            const isRivr = selectedVault.asset.includes('RIVR') || selectedVault.asset === 'LP TOKEN';
                            setTxAmount(
                              transactionType === 'deposit'
                                ? (isRivr ? wallet.balanceRivr : wallet.balanceEth).toString()
                                : selectedVault.userDeposit.toString()
                            );
                          }}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors bg-indigo-50 px-2.5 py-1 rounded-lg"
                        >
                          MAX
                        </button>
                      </div>
                    </div>
                  </div>

                  {txError && (
                    <div className="text-xs text-rose-600 font-semibold border border-rose-200 bg-rose-50 rounded-xl px-3 py-2 text-center">
                      {txError}
                    </div>
                  )}

                  <button
                    onClick={handleExecuteTx}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    Confirm {transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
