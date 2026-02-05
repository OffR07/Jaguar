
export type GameType = 'par' | 'impar';
export type BetStatus = 'open' | 'playing' | 'finished';

export interface User {
  id: string;
  username: string;
  email: string;
  email_verified: boolean;
  balance: number;
  cpf?: string;
  pix_key?: string;
  joinDate: string;
}

export interface Bet {
  id: number;
  creator: string;
  amount: number;
  type: GameType;
  status: BetStatus;
  creatorFingers: number;
  challenger?: string;
  challengerFingers?: number;
  winner?: string;
  resultTotal?: number;
  resultPar?: boolean;
}

export type AppView = 'login' | 'register' | 'recovery' | 'home' | 'account' | 'wallet' | 'game_lobby' | 'stats';

// Definition for SocketMessage used in the game logic
export interface SocketMessage {
  type: 'GAME_RESULT';
  payload: {
    betId: number;
    winner: string;
    resultTotal: number;
    resultPar: boolean;
    payout: number;
    serverTimestamp: number;
    commissionTaken: number;
  };
}
