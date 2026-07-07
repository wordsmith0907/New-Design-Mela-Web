export interface WalletState {
  connected: boolean;
  address: string | null;
  balanceRivr: number;
  balanceEth: number;
  provider: 'metamask' | 'walletconnect' | 'coinbase' | 'phantom' | null;
}

export interface SmartVault {
  id: string;
  name: string;
  asset: string;
  apr: number;
  tvl: number;
  userDeposit: number;
  riskScore: 'Low' | 'Medium' | 'High';
  duration: string;
  icon: string;
}

export interface DiscordMessage {
  id: string;
  user: string;
  avatar: string;
  role: 'Yielder' | 'Mod' | 'Core Dev';
  message: string;
  time: string;
}

export interface DocArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  content: string;
}

export interface DemoBooking {
  date: string;
  time: string;
  name: string;
  email: string;
  company: string;
  useCase: string;
}
