
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import json
import time
import random

app = FastAPI()

# Mocks para Configuração
ASAAS_CONFIG = {
    "api_key": "$ASAAS_PROD_KEY",
    "house_wallet_id": "jaguar_commissions_001",
    "commission_rate": 0.03 # 3% fixo conforme solicitado
}

class Action(BaseModel):
    action: str
    payload: dict

@app.websocket("/ws/jaguar")
async def jaguar_socket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            
            if msg["action"] == "PLAY_PAR_IMPAR":
                payload = msg["payload"]
                
                # Cálculo de Resultado no Backend (Segurança)
                total = payload["creatorFingers"] + payload["playerFingers"]
                is_par = total % 2 == 0
                
                # Regra: Criador escolhe um tipo, desafiante fica com o oposto
                creator_wins = (payload["creatorType"] == 'par' and is_par) or (payload["creatorType"] == 'impar' and not is_par)
                winner_name = payload["creatorName"] if creator_wins else payload["playerName"]
                
                # REGRA FINANCEIRA: 97% vencedor / 3% casa
                bet_amount = payload["amount"]
                commission = bet_amount * ASAAS_CONFIG["commission_rate"]
                prize_net = bet_amount * (1 - ASAAS_CONFIG["commission_rate"])
                
                response = {
                    "type": "GAME_RESULT",
                    "payload": {
                        "betId": payload["betId"],
                        "winner": winner_name,
                        "resultTotal": total,
                        "resultPar": is_par,
                        "payout": -bet_amount if creator_wins else prize_net,
                        "commissionTaken": commission,
                        "serverTimestamp": int(time.time() * 1000)
                    }
                }
                
                # Delay para emoção do duelo
                time.sleep(1.5)
                await websocket.send_json(response)
                
    except WebSocketDisconnect:
        pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
