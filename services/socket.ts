
import { SocketMessage } from '../types';

export class JaguarSocket {
  private onMessage: (msg: SocketMessage) => void;
  private mockDelay: number = 2000;

  constructor(onMessage: (msg: SocketMessage) => void) {
    this.onMessage = onMessage;
    console.log("🐍 Jaguar Python Socket Inicializado");
  }

  send(message: any) {
    console.log("📤 [PYTHON-ENGINE] Recebendo ação:", message.action);
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

      // CÁLCULO DE COMISSÃO (SPLIT)
      // 2% do total vai para a plataforma como comissão de intermediação.
      // O prêmio do vencedor é 97% do valor total da aposta (ajustado para as taxas BaaS).
      const platformFee = amount * 0.02;
      const prizePool = amount * 0.97;

      const response: SocketMessage = {
        type: 'GAME_RESULT',
        payload: {
          betId,
          winner: winnerName,
          resultTotal: total,
          resultPar: isTotalPar,
          payout: creatorWins ? -amount : prizePool, // O vencedor recebe o valor líquido calculado pelo split
          serverTimestamp: Date.now(),
          commissionTaken: platformFee
        }
      };
      
      this.onMessage(response);
    }
  }

  disconnect() {
    console.log("🔌 Desconectado do Backend Python");
  }
}
