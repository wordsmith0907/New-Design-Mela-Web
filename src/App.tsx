/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChevronDown, 
  ArrowUpRight, 
  MessageSquare, 
  Wallet, 
  Coins, 
  TrendingUp, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  X, 
  Info,
  ChevronRight,
  ChevronLeft,
  Plus,
  Image,
  Menu
} from 'lucide-react';

import { WalletState } from './types';
import WalletModal from './components/WalletModal';
import StakingModal from './components/StakingModal';
import VaultsPanel from './components/VaultsPanel';
import DiscordTerminal from './components/DiscordTerminal';
import DemoScheduler from './components/DemoScheduler';
import DocReader from './components/DocReader';
import logoUrl from './logo.svg';

export default function App() {
  // Modal open states
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isStakingModalOpen, setIsStakingModalOpen] = useState(false);
  const [isDiscordOpen, setIsDiscordOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  
  // Track logo rendering status for graceful vector fallback
  const [logoError, setLogoError] = useState(false);

  // Track mobile navigation menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hover states for Navigation dropdowns
  const [activeMenu, setActiveMenu] = useState<'economics' | 'governance' | null>(null);

  // Hover states for "Let's Talk" buttons to apply brand color gradient on hover
  const [isLetsTalkHovered, setIsLetsTalkHovered] = useState(false);
  const [isMobileLetsTalkHovered, setIsMobileLetsTalkHovered] = useState(false);

  // Magnetic effect for "Get Quote" button
  const getQuoteBtnRef = useRef<HTMLButtonElement>(null);
  const [getQuotePosition, setGetQuotePosition] = useState({ x: 0, y: 0 });
  const [isGetQuoteHovered, setIsGetQuoteHovered] = useState(false);

  const handleGetQuoteMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!getQuoteBtnRef.current) return;
    setIsGetQuoteHovered(true);
    const { clientX, clientY } = e;
    const { left, top, width, height } = getQuoteBtnRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Smoothly calculate translation with a factor
    const x = (clientX - centerX) * 0.35;
    const y = (clientY - centerY) * 0.35;
    setGetQuotePosition({ x, y });
  };

  const handleGetQuoteMouseLeave = () => {
    setGetQuotePosition({ x: 0, y: 0 });
    setIsGetQuoteHovered(false);
  };

  // Global Interactive Application States
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balanceRivr: 4500,
    balanceEth: 1.45,
    provider: null,
  });

  const [hasYielderRole, setHasYielderRole] = useState(false);
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [activeYielderCount, setActiveYielderCount] = useState<number>(5248);

  // Success Notification state
  const [notification, setNotification] = useState<{
    show: boolean;
    title: string;
    message: string;
  }>({
    show: false,
    title: '',
    message: '',
  });

  const showNotification = (title: string, message: string) => {
    setNotification({ show: true, title, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  const handleConnectWallet = (connectedWallet: WalletState) => {
    setWallet(connectedWallet);
    showNotification('Wallet Connected', `Successfully connected to ${connectedWallet.provider}!`);
  };

  const handleDisconnectWallet = () => {
    setWallet({
      connected: false,
      address: null,
      balanceRivr: 4500,
      balanceEth: 1.45,
      provider: null,
    });
    showNotification('Wallet Disconnected', 'Disconnected from Web3 provider.');
  };

  const handleStakeSuccess = (amount: number, calculatedApr: string) => {
    setStakedAmount(prev => prev + amount);
    setActiveYielderCount(prev => prev + 1);
    showNotification(
      'Staking Successful',
      `Locked ${amount.toLocaleString()} RIVR at ${calculatedApr}% APY. Minted fRIVR liquid wrappers!`
    );
  };

  const handleClaimDiscordRole = () => {
    setHasYielderRole(true);
    showNotification('Role Claimed', 'You are now officially a "Senior Yielder" in the Fluid Discord!');
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start p-[10px] md:p-[15px] font-sans antialiased select-none"
      style={{ background: '#F3EEF4' }}
    >
      
      {/* Outer Widescreen Card Frame Wrapper */}
      <div className="w-full max-w-[1360px] aspect-auto h-auto min-h-[480px] md:aspect-[16/10] md:h-auto md:min-h-[600px] max-h-[820px] relative">
        {/* Outer Widescreen Card Frame */}
        <div 
          id="main-widescreen-frame"
          className="w-full min-h-[480px] h-auto md:h-full rounded-tr-[36px] rounded-bl-[36px] rounded-tl-none rounded-br-[36px] relative overflow-hidden flex flex-col justify-between"
          style={{ 
            background: 'linear-gradient(135deg, #0F0B14, #1A0F1F)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 4px 8px 0 rgba(74, 21, 0, 0.24), 0 32px 80px -16px rgba(0,0,0,0.12)'
          }}
        >
          {/* Inner shadow overlay for tactile paper cut-out depth effect */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-tr-[36px] rounded-bl-[36px] rounded-tl-none rounded-br-[36px] z-30"
            style={{
              boxShadow: 'inset 0 4px 8px 0 rgba(74, 21, 0, 0.24), inset 0 2px 4px 0 rgba(74, 21, 0, 0.14)',
              mixBlendMode: 'multiply'
            }}
          />

          {/* Subtle noise/grain overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none mix-blend-overlay z-10" xmlns="http://www.w3.org/2000/svg">
            <filter id="heroNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.08 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#heroNoise)" />
          </svg>

          {/* Centered Concentric Sanskrit Mandala background */}
          <div className="hidden">
            <svg>
              <text fontSize="12" fontWeight="bold" fill="#F3EEF4" opacity="0.8" className="font-sans">
                <textPath href="#ringOuter" startOffset="0%">
                  सोऽहम् সোঽহম্ सोऽहम् সোঽহম্ सोऽहम् সোঽহম্ सोऽहम् সোঽহম্ सोऽहम् সোঽহম্ सोऽहम् সোঽহম্ सोऽहम् সোঽহম্ सोऽहम् সোঽহম্
                </textPath>
              </text>

              {/* Mid Outer circle: ॐ आः हूँ repeating */}
              <text fontSize="13" fontWeight="600" fill="#F3EEF4" opacity="0.7" className="font-sans">
                <textPath href="#ringMid1" startOffset="0%">
                  ॐ आः हूँ ॐ आः हूँ ॐ आः हूँ ॐ आः हूँ ॐ आः हूँ ॐ आः हूँ ॐ आः हूँ ॐ आः हूँ ॐ आः हूँ ॐ आः हूँ
                </textPath>
              </text>

              {/* Mid Inner circle: সোঽহম্ & सोऽहम् repeating */}
              <text fontSize="14" fontWeight="bold" fill="#F3EEF4" opacity="0.6" className="font-sans">
                <textPath href="#ringMid2" startOffset="0%">
                  सोऽहम् সোঽহম্ सोऽहम् সোঽহম্ सोऽहम् সোঽহম্ सोऽहम् সোঽহম্
                </textPath>
              </text>

              {/* Inner circle: ॐ आः हूँ repeating */}
              <text fontSize="15" fontWeight="bold" fill="#F3EEF4" opacity="0.5" className="font-sans">
                <textPath href="#ringInner1" startOffset="0%">
                  ॐ आः हूँ ॐ आः हूँ ॐ आः हूँ ॐ आः हूँ ॐ आः हूँ
                </textPath>
              </text>
            </svg>
          </div>

          {/* 1. HEADER / NAVIGATION */}
          <header className="fixed top-[22px] left-0 right-0 z-50 flex items-center justify-between md:justify-center px-4 md:px-0 pointer-events-none">
            {/* Left Spacer to keep layout balanced with logo cutout on mobile */}
            <div className="w-[78px] md:hidden pointer-events-none" />

            {/* Center (hidden on mobile, md:flex): liquid-glass pill */}
            <nav 
              className="hidden md:flex items-center lg:gap-1.5 md:gap-0.5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full px-1.5 py-1.5 pointer-events-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))'
              }}
            >
              {["Home", "About", "Services", "Portfolio", "Case Studies"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="relative lg:px-4 md:px-2.5 px-4 py-2 lg:text-[14px] md:text-[12px] text-[14px] lg:hover:text-[15px] md:hover:text-[13px] hover:text-[15px] font-medium text-white/90 font-sans hover:text-white transition-all duration-300 whitespace-nowrap group flex items-center justify-center"
                >
                  <span className="transition-all duration-300">{link}</span>
                  <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                </a>
              ))}
              <button 
                onClick={() => setIsSchedulerOpen(true)}
                onMouseEnter={() => setIsLetsTalkHovered(true)}
                onMouseLeave={() => setIsLetsTalkHovered(false)}
                className="flex items-center gap-2 lg:px-5 lg:py-2.5 md:px-3.5 md:py-2 px-5 py-2.5 rounded-full lg:text-sm md:text-xs text-sm font-semibold transition-all duration-300 shadow-md lg:ml-2 md:ml-1 ml-2 group/btn whitespace-nowrap border"
                style={{
                  background: isLetsTalkHovered ? '#FF5A5F' : '#F3EEF4',
                  color: isLetsTalkHovered ? '#FFFFFF' : '#000000',
                  borderColor: isLetsTalkHovered ? '#FF5A5F' : 'transparent',
                  boxShadow: isLetsTalkHovered ? '0 10px 20px -5px rgba(255, 90, 95, 0.4)' : 'none'
                }}
              >
                <span>Let's Talk</span>
                <div className="relative h-4 w-4 overflow-hidden shrink-0">
                  {/* Primary Arrow - slides out North-East on hover */}
                  <ArrowUpRight className="h-4 w-4 text-black transition-transform duration-300 ease-in-out group-hover/btn:translate-x-5 group-hover/btn:-translate-y-5" style={{ color: isLetsTalkHovered ? '#FFFFFF' : '#000000' }} />
                  {/* Secondary Arrow - slides in from South-West on hover */}
                  <ArrowUpRight className="h-4 w-4 text-white absolute left-0 top-0 transition-transform duration-300 ease-in-out -translate-x-5 translate-y-5 group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" style={{ color: isLetsTalkHovered ? '#FFFFFF' : '#FFFFFF' }} />
                </div>
              </button>
            </nav>

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden items-center justify-center h-10 w-10 rounded-full bg-black/85 backdrop-blur-md border border-white/15 text-white/90 hover:text-white pointer-events-auto transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </header>

          {/* 2. MOBILE OVERLAY NAVIGATION */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed inset-0 z-40 bg-black/95 backdrop-blur-lg md:hidden flex flex-col justify-between p-6 pt-[90px]"
              >
                {/* Decorative subtle background glows for high quality look */}
                <div className="absolute top-[20%] left-[10%] w-[180px] h-[180px] rounded-full bg-orange-600/10 blur-[60px] pointer-events-none" />
                <div className="absolute bottom-[30%] right-[10%] w-[220px] h-[220px] rounded-full bg-indigo-600/10 blur-[80px] pointer-events-none" />

                {/* Menu Links */}
                <div className="flex flex-col gap-5 relative z-10">
                  <span className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Navigation</span>
                  {["Home", "About", "Services", "Portfolio", "Case Studies"].map((link, idx) => (
                    <motion.a
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={link}
                      href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-2xl font-semibold text-white/90 hover:text-white transition-colors py-1 border-b border-white/5 flex items-center justify-between group"
                    >
                      <span>{link}</span>
                      <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
                    </motion.a>
                  ))}
                  {/* Start Your Project Link inside mobile menu for ease of access */}
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsDocsOpen(true);
                    }}
                    className="text-2xl font-semibold text-orange-500 hover:text-orange-400 transition-colors py-1 border-b border-white/5 flex items-center justify-between text-left"
                  >
                    <span>Start Your Project</span>
                    <ArrowUpRight className="h-5 w-5 text-orange-500" />
                  </motion.button>
                </div>

                {/* Bottom Action Area */}
                <div className="flex flex-col gap-4 mt-auto relative z-10 pt-8 border-t border-white/10">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSchedulerOpen(true);
                    }}
                    onMouseEnter={() => setIsMobileLetsTalkHovered(true)}
                    onMouseLeave={() => setIsMobileLetsTalkHovered(false)}
                    className="w-full py-3.5 rounded-full font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg border"
                    style={{
                      background: isMobileLetsTalkHovered ? '#FF5A5F' : '#F3EEF4',
                      color: isMobileLetsTalkHovered ? '#FFFFFF' : '#000000',
                      borderColor: isMobileLetsTalkHovered ? '#FF5A5F' : 'transparent',
                      boxShadow: isMobileLetsTalkHovered ? '0 10px 20px -5px rgba(255, 90, 95, 0.4)' : 'none'
                    }}
                  >
                    <span>Let's Talk</span>
                    <ArrowUpRight className="h-5 w-5 transition-colors duration-300" style={{ color: isMobileLetsTalkHovered ? '#FFFFFF' : '#000000' }} />
                  </button>
                  
                  <div className="text-center text-[10px] text-slate-500 font-mono mt-2">
                    FLUID PROTOCOL V2.5 • ECOSYSTEM ACTIVE
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3. LEFT-ALIGNED HERO CONTAINER */}
          <main className="relative flex-1 flex flex-col items-start justify-start text-left px-8 md:px-16 lg:px-24 z-20 pt-[105px] pb-[130px] md:pt-[140px] md:pb-16 max-w-4xl mr-auto">
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-[22px] sm:text-[28px] md:text-[52px] font-bold tracking-tight text-[#F3EEF4] max-w-[900px] leading-[1.15] font-sans mb-3 md:mb-5"
            >
              Your Business doesn't<br className="hidden md:inline" /> need more tools - it<br className="hidden md:inline" /> needs <span className="font-extrabold text-[#F3EEF4]" style={{ fontSize: "calc(100% + 2px)", textShadow: "-1px -1px 0 rgba(0,0,0,0.08), 1px -1px 0 rgba(0,0,0,0.08), -1px 1px 0 rgba(0,0,0,0.08), 1px 1px 0 rgba(0,0,0,0.08), -1px 0px 0 rgba(0,0,0,0.08), 1px 0px 0 rgba(0,0,0,0.08), 0px -1px 0 rgba(0,0,0,0.08), 0px 1px 0 rgba(0,0,0,0.08)" }}>customers.</span>
            </motion.h1>

            {/* Sub-text */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[11px] sm:text-[13px] md:text-[16px] font-normal text-[#F3EEF4]/70 max-w-[650px] mb-[20px] md:mb-[30px] leading-[1.6] font-sans"
            >
              I design custom websites and smart automation systems that capture leads,<br className="hidden md:inline" /> respond instantly and scale your business without the complexity.
            </motion.p>

            {/* CTA Button Action Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex justify-start"
            >
              <motion.button
                ref={getQuoteBtnRef}
                onMouseMove={handleGetQuoteMouseMove}
                onMouseLeave={handleGetQuoteMouseLeave}
                onMouseEnter={() => setIsGetQuoteHovered(true)}
                animate={{ x: getQuotePosition.x, y: getQuotePosition.y }}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
                onClick={() => setIsSchedulerOpen(true)}
                className="group inline-flex items-center gap-2 text-white font-semibold px-[18px] py-[8px] md:px-[24px] md:py-[12px] rounded-full text-[12px] md:text-[14px] transition-all duration-300 active:scale-95 cursor-pointer border border-transparent"
                style={{
                  background: isGetQuoteHovered ? '#FF7377' : '#FF5A5F',
                  boxShadow: isGetQuoteHovered 
                    ? '0 10px 25px -5px rgba(255, 90, 95, 0.5)' 
                    : '0 4px 14px -2px rgba(255, 90, 95, 0.3)'
                }}
              >
                <span>Get Quote</span>
                <ArrowUpRight className="h-5 w-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </motion.button>
            </motion.div>

            {/* Active yield values if staked */}
            {stakedAmount > 0 && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-6 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-4 py-2.5 shadow-sm text-xs text-emerald-400 font-bold"
              >
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
                <span>Active Staking: {stakedAmount.toLocaleString()} RIVR Wrapping Underway</span>
              </motion.div>
            )}
          </main>

        </div>

        {/* 5. TOP-LEFT SUBTRACTIVE OVERLAY */}
        {/* Placed outside the overflow-hidden frame to cover the corner and step inwards cleanly with elegant filleted curves */}
        <div 
          className="absolute top-0 left-0 w-[76px] h-[76px] z-30 select-none overflow-visible rounded-tl-[36px]"
        >
          {/* Seamless Custom Curved Background SVG */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" 
            viewBox="0 0 76 76" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="cutout-blur-tl" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
              <clipPath id="shadow-clip-tl">
                <path d="M 0 76 A 22 22 0 0 1 22 54 L 32 54 A 22 22 0 0 0 54 32 L 54 22 A 22 22 0 0 1 76 0 L 200 0 L 200 200 L 0 200 Z" />
              </clipPath>
            </defs>

            {/* Main background filled with #F3EEF4 to cover the card corner */}
            <path 
              d="M 0 76 A 22 22 0 0 1 22 54 L 32 54 A 22 22 0 0 0 54 32 L 54 22 A 22 22 0 0 1 76 0 L 90 0 L 90 -10 L -10 -10 L -10 76 Z" 
              fill="#F3EEF4"
              style={{ fill: '#F3EEF4' }}
            />

            {/* Inward shadow effect (inset shadow) along the curve to make it seamless with the main card's inset shadow */}
            <path 
              d="M 0 76 A 22 22 0 0 1 22 54 L 32 54 A 22 22 0 0 0 54 32 L 54 22 A 22 22 0 0 1 76 0" 
              stroke="rgba(0, 0, 0, 0.15)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              filter="url(#cutout-blur-tl)"
              clipPath="url(#shadow-clip-tl)"
              style={{ mixBlendMode: 'multiply' }}
              transform="translate(0, 4)"
            />


          </svg>

          {/* Brand Logo Placeholder */}
          <div 
            className="absolute top-[5px] left-[6px] w-[41px] h-[41px] rounded-full border border-dashed border-slate-400 bg-slate-200/40 flex items-center justify-center transition-all duration-300 hover:scale-105 pointer-events-auto cursor-pointer"
            title="Logo Placeholder"
          >
            <span className="text-[8px] font-mono font-bold tracking-tight text-slate-500 uppercase">Logo</span>
          </div>
        </div>
      </div>

      {/* 6. EXTENDED ACTIVE ECOSYSTEM CONTENT (SCROLLABLE AREA) */}
      <section className="w-full max-w-[1360px] mt-8 bg-[#F3EEF4]/70 backdrop-blur-md rounded-[32px] border border-slate-200 shadow-xl overflow-hidden">
        <VaultsPanel 
          wallet={wallet} 
          onConnectWallet={() => setIsWalletModalOpen(true)}
          onUpdateWallet={setWallet}
        />
      </section>

      {/* 7. REUSABLE FLOATING NOTIFICATION TOASTS */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 border border-white/10 text-white px-5 py-4 shadow-2xl max-w-sm backdrop-blur-md"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Info className="h-4.5 w-4.5" />
            </div>
            <div>
              <h5 className="text-xs font-bold tracking-tight text-white">{notification.title}</h5>
              <p className="text-[11px] text-slate-400 leading-normal mt-0.5">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="text-slate-400 hover:text-white pl-2 shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INTERACTIVE COMPONENT MODALS */}
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
        onConnect={handleConnectWallet}
      />

      <StakingModal 
        isOpen={isStakingModalOpen} 
        onClose={() => setIsStakingModalOpen(false)} 
        wallet={wallet}
        onUpdateWallet={setWallet}
        onStakeSuccess={handleStakeSuccess}
      />

      <DiscordTerminal 
        isOpen={isDiscordOpen} 
        onClose={() => setIsDiscordOpen(false)} 
        onClaimRole={handleClaimDiscordRole}
        hasYielderRole={hasYielderRole}
      />

      <DemoScheduler 
        isOpen={isSchedulerOpen} 
        onClose={() => setIsSchedulerOpen(false)} 
      />

      <DocReader 
        isOpen={isDocsOpen} 
        onClose={() => setIsDocsOpen(false)} 
      />

    </div>
  );
}
