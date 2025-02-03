import { BetHistory, Player, PlayerAssetHistory } from '@/models';

export interface AuthState {
  isAuthenticated: boolean;
  sessionToken?: string;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setSessionToken: (token: string) => void;
  logout: () => void;
}

export interface BetState {
  recentBets: BetHistory[];
  selectedBet?: BetHistory;
  isLoading: boolean;
  error?: string;
  setRecentBets: (bets: BetHistory[]) => void;
  setSelectedBet: (bet?: BetHistory) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error?: string) => void;
  clearError: () => void;
}

export interface PlayerState {
  players: Player[];
  selectedPlayer?: Player;
  playerAssetHistory: PlayerAssetHistory[];
  isLoading: boolean;
  error?: string;
  setPlayers: (players: Player[]) => void;
  setSelectedPlayer: (player?: Player) => void;
  setPlayerAssetHistory: (history: PlayerAssetHistory[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error?: string) => void;
  clearError: () => void;
}

export interface UIState {
  isSidebarCollapsed: boolean;
  currentTheme: 'light' | 'dark';
  toggleSidebar: () => void;
  toggleTheme: () => void;
}
