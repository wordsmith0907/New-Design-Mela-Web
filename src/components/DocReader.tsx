import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Search, ThumbsUp, ChevronRight, HelpCircle, Code, ShieldCheck } from 'lucide-react';
import { DocArticle } from '../types';

interface DocReaderProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocReader({ isOpen, onClose }: DocReaderProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('a1');
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});

  const articles: DocArticle[] = [
    {
      id: 'a1',
      category: 'Introduction',
      title: 'Overview & Slogan',
      readTime: '3 min read',
      content: `
# Fluid Asset Streams

Fluid Asset Streams is a decentralized liquid staking and automated capital allocation protocol. By separating yield generation from asset custody, we enable capital yielders to achieve optimal returns without locking up liquidity.

### Transforming Rigid Holdings Into Liquid Cash
Traditional staking models require investors to lock tokens (like RIVR or ETH) inside deep contracts, rendering them completely illiquid for weeks or months. 

Fluid Asset Streams solves this by wrapping staked capital. When you deposit assets:
1. They are routed into specialized, audited **Smart Vaults**.
2. An equivalent liquid token wrapper is minted (e.g., **fRIVR** or **fETH**).
3. These f-tokens accrue yield continuously while remaining freely tradeable or usable as lending collateral in Web3 dApps.
      `,
    },
    {
      id: 'a2',
      category: 'Staking Wrapper',
      title: 'fRIVR Mechanics',
      readTime: '4 min read',
      content: `
# Under the Hood: fRIVR Liquid Token

The fRIVR token is an ERC-20 yield-bearing receipt representing staked RIVR.

### Minting and Valuation
- **1-to-1 Minting:** On-deposit, fRIVR tokens are minted at a strict 1:1 ratio.
- **Accrual Mechanism:** Staking rewards are automatically distributed via a rebasing contract mechanism, or through value appreciation (similar to cTokens or rTokens).
- **Direct Redemption:** Users can redeem fRIVR back into native RIVR at any point.

### Collateral Use Cases
Because fRIVR has fully transparent on-chain reserves, it can be integrated directly:
- As collateral in DeFi money markets.
- In automated high-yield LP pairs on Uniswap or SushiSwap.
- For borrowing stablecoins at low borrow-utilization rates.
      `,
    },
    {
      id: 'a3',
      category: 'Security',
      title: 'Smart Vault Security Audits',
      readTime: '5 min read',
      content: `
# Security Infrastructure & Smart Vault Audits

At Fluid Asset Streams, smart contract security is our absolute highest priority. 

### Audit Breakdown
Our non-custodial smart contracts have been thoroughly audited by leading blockchain security firms:
- **ConsenSys Diligence:** Reviewed RIVR wrapping and rebase mechanism.
- **CertiK:** Dynamic analysis and threat-modeling of automated liquidity triggers (Score: 98/100).
- **Halborn:** Full penetration test and multi-signature cold-vault validation.

### Risk Management
Each Smart Vault is categorized with a risk score (Low, Medium, High) depending on:
1. The volatility of the underlying liquidity pair.
2. The duration of the asset lock (flexible vs. fixed).
3. The complexity of the reward compounding strategy.
      `,
    },
    {
      id: 'a4',
      category: 'Tokenomics',
      title: 'RIVR Token Economics',
      readTime: '3 min read',
      content: `
# RIVR Utility and Supply Schedule

RIVR is the native utility and governance token powering the Fluid Asset Streams ecosystem.

### Key Utility Channels
- **Governance Power:** Holders of RIVR can vote on fee schedules, Smart Vault allocations, and protocol-treasury spending proposals.
- **Staking Multipliers:** Premium stakers who hold locked RIVR or own official **Fluid NFTs** receive up to a 1.25x APR multiplier boost.
- **Buyback and Burn:** 10% of all protocol-collected vault fees are used to buy back RIVR from open markets and permanently burn them, creating deflationary pressure.
      `,
    },
  ];

  const filteredArticles = articles.filter(art =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedArticle = articles.find(art => art.id === selectedArticleId) || articles[0];

  const handleFeedback = (id: string) => {
    setFeedbackGiven(prev => ({ ...prev, [id]: true }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="docs-overlay" className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Side Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-[#ffeeff] text-slate-800 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-[#ffeeff] px-6 py-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <div>
                  <h3 className="font-display font-bold text-slate-900 leading-none">Developer Library</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Documentation & Smart Contract Specifications</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </div>

            {/* Search Box */}
            <div className="border-b border-slate-200 bg-[#ffeeff] px-6 py-3">
              <div className="relative flex items-center bg-slate-100 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-indigo-500/50 focus-within:bg-white transition-all">
                <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, keywords, vaults..."
                  className="bg-transparent text-xs text-slate-800 outline-none w-full placeholder-slate-400"
                />
              </div>
            </div>

            {/* Core Split Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left sidebar - Titles */}
              <div className="w-1/3 border-r border-slate-200 overflow-y-auto bg-[#ffeeff]/40 p-3 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2.5">Articles</span>
                {filteredArticles.length === 0 ? (
                  <p className="text-[11px] text-slate-400 p-2 text-center">No articles found.</p>
                ) : (
                  filteredArticles.map(art => (
                    <button
                      key={art.id}
                      onClick={() => setSelectedArticleId(art.id)}
                      className={`flex w-full flex-col text-left px-3 py-2.5 rounded-xl transition-all ${
                        selectedArticleId === art.id
                          ? 'bg-[#ffeeff] shadow-sm border border-slate-200/60 text-slate-900 font-medium'
                          : 'text-slate-500 hover:bg-[#ffeeff]/35 hover:text-slate-800'
                      }`}
                    >
                      <span className="text-[9px] font-mono uppercase tracking-wider text-indigo-500/85">
                        {art.category}
                      </span>
                      <span className="text-xs font-semibold leading-tight mt-0.5">{art.title}</span>
                      <span className="text-[10px] text-slate-400 mt-1">{art.readTime}</span>
                    </button>
                  ))
                )}
              </div>

              {/* Right panel - Content viewer */}
              <div className="flex-1 overflow-y-auto bg-[#ffeeff] p-6 md:p-8 space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-mono uppercase tracking-wider font-semibold">
                    <span>{selectedArticle.category}</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-slate-400">{selectedArticle.readTime}</span>
                  </div>
                  <h1 className="font-display font-black text-2xl md:text-3xl text-slate-900 mt-2 tracking-tight">
                    {selectedArticle.title}
                  </h1>
                </div>

                {/* Simulated Markdown Body */}
                <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-4">
                  {selectedArticle.content.split('\n\n').map((para, pIdx) => {
                    const trimmed = para.trim();
                    if (!trimmed) return null;

                    // Check if header
                    if (trimmed.startsWith('#')) {
                      const level = trimmed.match(/^#+/)?.[0].length || 1;
                      const text = trimmed.replace(/^#+\s*/, '');
                      if (level === 1) {
                        return null; // Already in Title
                      } else if (level === 2) {
                        return <h2 key={pIdx} className="font-display font-bold text-lg text-slate-800 mt-6 mb-2">{text}</h2>;
                      } else {
                        return <h3 key={pIdx} className="font-display font-bold text-sm text-slate-700 mt-4 mb-2 uppercase tracking-wide">{text}</h3>;
                      }
                    }

                    // Check if bullet list
                    if (trimmed.startsWith('-')) {
                      const items = trimmed.split('\n').map(item => item.replace(/^-\s*/, ''));
                      return (
                        <ul key={pIdx} className="list-disc pl-5 space-y-1.5">
                          {items.map((item, iIdx) => {
                            // Check bold formatting inside items e.g., **fRIVR**
                            const formatted = item.split('**').map((chunk, cIdx) => 
                              cIdx % 2 === 1 ? <strong key={cIdx} className="text-slate-900 font-semibold">{chunk}</strong> : chunk
                            );
                            return <li key={iIdx}>{formatted}</li>;
                          })}
                        </ul>
                      );
                    }

                    // Check if numbered list
                    if (trimmed.match(/^\d+\./)) {
                      const items = trimmed.split('\n').map(item => item.replace(/^\d+\.\s*/, ''));
                      return (
                        <ol key={pIdx} className="list-decimal pl-5 space-y-1.5">
                          {items.map((item, iIdx) => {
                            const formatted = item.split('**').map((chunk, cIdx) => 
                              cIdx % 2 === 1 ? <strong key={cIdx} className="text-slate-900 font-semibold">{chunk}</strong> : chunk
                            );
                            return <li key={iIdx}>{formatted}</li>;
                          })}
                        </ol>
                      );
                    }

                    // Simple paragraph with potential bold markings
                    const formattedPara = trimmed.split('**').map((chunk, cIdx) => 
                      cIdx % 2 === 1 ? <strong key={cIdx} className="text-slate-900 font-bold">{chunk}</strong> : chunk
                    );
                    return <p key={pIdx}>{formattedPara}</p>;
                  })}
                </div>

                {/* Helpful voting */}
                <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Was this article helpful?</span>
                  {feedbackGiven[selectedArticle.id] ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="h-4.5 w-4.5" />
                      Thank you for your feedback!
                    </span>
                  ) : (
                    <button
                      onClick={() => handleFeedback(selectedArticle.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      Yes, helpful
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
