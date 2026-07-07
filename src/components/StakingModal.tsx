import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, TrendingUp, Shield, HelpCircle, Flame, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { WalletState } from '../types';

interface StakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onUpdateWallet: (wallet: WalletState) => void;
  onStakeSuccess: (amount: number, formattedYield: string) => void;
}

export default function StakingModal({ isOpen, onClose, wallet, onUpdateWallet, onStakeSuccess }: StakingModalProps) {
  const [stakeAmount, setStakeAmount] = useState<string>('1000');
  const [lockDuration, setLockDuration] = useState<number>(0); // 0: Flexible, 1: 3M, 2: 6M, 3: 12M
  const [hasNftBoost, setHasNftBoost] = useState<boolean>(false);
  const [isStaking, setIsStaking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const durationOptions = [
    { label: 'Flexible', multiplier: 1.0, aprBonus: 0 },
    { label: '3 Months', multiplier: 1.3, aprBonus: 1.5 },
    { label: '6 Months', multiplier: 1.6, aprBonus: 3.2 },
    { label: '12 Months', multiplier: 2.2, aprBonus: 5.8 },
  ];

  const baseApr = 8.4; // 8.4% APY baseline
  const nftBoostMultiplier = 1.25;

  const currentDuration = durationOptions[lockDuration];
  const calculatedApr = parseFloat(
    ((baseApr + currentDuration.aprBonus) * (hasNftBoost ? nftBoostMultiplier : 1.0)).toFixed(2)
  );

  const amountNum = parseFloat(stakeAmount) || 0;
  const annualReward = (amountNum * (calculatedApr / 100));
  const monthlyReward = annualReward / 12;
  const dailyReward = annualReward / 365;

  // Amount of liquid wrapper minted (fRIVR)
  const mintedFluidAmount = amountNum;

  const handleMax = () => {
    if (wallet.connected) {
      setStakeAmount(wallet.balanceRivr.toString());
    } else {
      setStakeAmount('10000');
    }
  };

  const executeStake = () => {
    setErrorMessage('');
    if (amountNum <= 0) {
      setErrorMessage('Please enter a valid staking amount.');
      return;
    }

    if (wallet.connected && wallet.balanceRivr < amountNum) {
      setErrorMessage(`Insufficient RIVR balance. You have ${wallet.balanceRivr} RIVR.`);
      return;
    }

    setIsStaking(true);

    setTimeout(() => {
      if (wallet.connected) {
        onUpdateWallet({
          ...wallet,
          balanceRivr: parseFloat((wallet.balanceRivr - amountNum).toFixed(2)),
        });
      }
      onStakeSuccess(amountNum, calculatedApr.toFixed(2));
      setIsStaking(false);
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="staking-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-slate-950/95 text-white shadow-2xl backdrop-blur-xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/15 p-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight">Fluid Staking Portal</h3>
                  <p className="text-xs text-slate-400">Transform rigid RIVR into liquid-yielding fRIVR</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-5 space-y-5 flex-1">
              {/* Wallet Info Banner */}
              <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/5 px-4 py-3 text-sm">
                <span className="text-slate-400">Wallet Connection Status</span>
                {wallet.connected ? (
                  <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {wallet.address} ({wallet.balanceRivr.toLocaleString()} RIVR)
                  </span>
                ) : (
                  <span className="text-xs text-amber-400">Not Connected (Using Simulator)</span>
                )}
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    Staking Amount
                  </label>
                  <button
                    onClick={handleMax}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Use Max
                  </button>
                </div>
                <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 focus-within:border-indigo-500/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-2/3 bg-transparent font-display text-2xl font-bold text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
                      <span className="text-sm font-bold tracking-tight">RIVR</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Staked Asset</span>
                    <span>1 RIVR = 1.00 fRIVR</span>
                  </div>
                </div>
              </div>

              {/* Lock-up Duration Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    Lock Duration
                  </label>
                  <span className="text-xs text-indigo-400 font-medium">
                    {currentDuration.multiplier}x multiplier
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {durationOptions.map((opt, idx) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setLockDuration(idx)}
                      className={`rounded-xl py-2 px-1 text-center text-xs font-semibold border transition-all ${
                        lockDuration === idx
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div>{opt.label}</div>
                      <div className={`text-[10px] mt-0.5 ${lockDuration === idx ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {opt.aprBonus > 0 ? `+${opt.aprBonus}% APR` : 'Base APR'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* NFT Multiplier Boost Card */}
              <button
                type="button"
                onClick={() => setHasNftBoost(!hasNftBoost)}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                  hasNftBoost
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    hasNftBoost ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'
                  }`}>
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Fluid NFT Multiplier</h4>
                    <p className="text-xs text-slate-400">Apply a 1.25x APR boost on all stakes</p>
                  </div>
                </div>
                <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                  hasNftBoost ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-white/20'
                }`}>
                  {hasNftBoost && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
                </div>
              </button>

              {/* Yield Output Preview */}
              <div className="rounded-2xl bg-indigo-950/30 border border-indigo-500/15 p-4.5 space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-500/10 pb-2.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Estimated Yield (APR)</span>
                  <span className="flex items-center gap-1 font-display text-lg font-bold text-emerald-400">
                    <TrendingUp className="h-4.5 w-4.5" />
                    {calculatedApr}% APY
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/3 rounded-xl p-2.5">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Daily Rewards</div>
                    <div className="text-sm font-bold text-white mt-1">
                      {dailyReward.toFixed(3)} RIVR
                    </div>
                  </div>
                  <div className="bg-white/3 rounded-xl p-2.5">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Monthly Rewards</div>
                    <div className="text-sm font-bold text-white mt-1">
                      {monthlyReward.toFixed(2)} RIVR
                    </div>
                  </div>
                  <div className="bg-white/3 rounded-xl p-2.5">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Annual Rewards</div>
                    <div className="text-sm font-bold text-white mt-1">
                      {annualReward.toFixed(1)} RIVR
                    </div>
                  </div>
                </div>
              </div>

              {/* Liquid Cash Concept Card */}
              <div className="rounded-2xl bg-gradient-to-r from-blue-900/10 to-indigo-900/10 border border-blue-500/10 p-4 flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-blue-300 uppercase">Instant Liquid Wrapping</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    By staking RIVR, you will instantly mint **{mintedFluidAmount.toLocaleString()} fRIVR** tokens in your wallet. Use fRIVR on collateral protocols or swap it back to liquid cash instantly.
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="text-xs text-rose-400 font-semibold border border-rose-500/20 bg-rose-500/5 rounded-xl px-3 py-2 text-center">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="border-t border-white/15 p-5 bg-slate-900/40 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border border-white/10 py-3 text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeStake}
                disabled={isStaking || amountNum <= 0}
                className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm font-semibold py-3 shadow-lg hover:shadow-indigo-500/10 transition-all text-white"
              >
                {isStaking ? (
                  <>Staking Asset...</>
                ) : (
                  <>
                    Stake Asset <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
