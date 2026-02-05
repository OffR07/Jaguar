
import { SocketMessage } from '../types.ts';

export class JaguarSocket {
  private onMessage: (msg: SocketMessage) => void;
  private mockDelay: number = 1800;

  constructor(onMessage: (msg: SocketMessage) => void) {
    this.onMessage = onMessage;
    console.log("🐍 Jaguar Engine Online");
  }

  send(message: any) {
    console.log("📤 Enviando para servidor:", message.action);
    setTimeout(() => {
      this.processPythonLogic(message);
    }, this.mockDelay);
  }

  private processPythonLogic(message: any) {
    if (message.action === 'PLAY_PAR_IMPAR') {
      const { betId, amount, creatorType, creatorFingers, playerFingers, creatorName, playerName } = message.payload;
      
      const total = creatorFingers + playerFingers;
      const isTotalPar = total % 2 === 0;
      
      const creatorWins = (creatorType === 'par' && isTotalPar) || (creatorType === 'impar' && !isTotalPar);
      const winnerName = creatorWins ? creatorName : playerName;

      // REGRA: 3% de comissão Jaguar
      const commissionRate = 0.03;
      const totalPot = amount * 2;
      const commission = totalPot * commissionRate;
      const netPrize = totalPot - commission;

      // O vencedor recebe o prêmio líquido.
      // O perdedor não recebe nada (já pagou na entrada).
      const payout = winnerName === playerName ? netPrize : 0; 
      // Se o criador ganhar, o servidor apenas notifica. No mock, o saldo do criador é gerido localmente.
      // Para o jogador atual (Challenger), o payout é o prêmio se ganhar, ou 0 se perder.

      const response: SocketMessage = {
        type: 'GAME_RESULT',
        payload: {
          betId,
          winner: winnerName,
          resultTotal: total,
          resultPar: isTotalPar,
          payout: payout, 
          serverTimestamp: Date.now(),
          commissionTaken: commission
        }
      };
      
      this.onMessage(response);
    }
  }

  disconnect() {
    console.log("🔌 Jaguar Engine Offline");
  }
}