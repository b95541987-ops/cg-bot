const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Веб-сервер, чтобы Railway видел, что сервис живой и здоровый
app.get('/', (req, res) => {
  res.send('Chicken Gun 24/7 Room Host Bot is RUNNING!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[HTTP] Web server listening on port ${PORT}`);
});

// === ПОДКЛЮЧЕНИЕ К СЕРВЕРАМ CHICKEN GUN ===
global.WebSocket = require('ws');
const Photon = require('photon-javascript-sdk');

// AppID Чикен Гана из PhotonServerSettings.asset
const APP_ID = 'f031ea6a-bcf9-4b77-8d3b-e629abcfddfe';
const APP_VERSION = '1.0';

// Настройки комнаты
const ROOM_NAME = '⭐ СЕРВЕР 24/7 ⭐';
const MAX_PLAYERS = 10;
const GAME_MODE = 2; // 0=PvP, 1=TeamFight, 2=Sandbox, 3=ZombieSurvival, 8=Parkour
const MAP_ID = 3;    // 0=Dust2, 2=ChaloHouse, 3=SmallTown, 11=Town3, 20=Minecraft

class ChickenGunBot extends Photon.LoadBalancing.LoadBalancingClient {
  constructor() {
    super(Photon.ConnectionProtocol.Ws, APP_ID, APP_VERSION);
  }

  onStateChange(state) {
    console.log('[Photon State]:', this.getStateText());
    if (state === Photon.LoadBalancing.LoadBalancingClient.States.JoinedLobby) {
      this.createHostRoom();
    }
  }

  createHostRoom() {
    console.log(`[Host] Создаю комнату "${ROOM_NAME}"...`);
    const options = {
      isVisible: true,
      isOpen: true,
      maxPlayers: MAX_PLAYERS,
      customRoomProperties: {
        mode: GAME_MODE,
        map: MAP_ID,
        starttime: Date.now().toString()
      },
      propsListedInLobby: ['mode', 'map', 'starttime']
    };

    this.createRoom(ROOM_NAME, options);
  }

  onJoinRoom() {
    console.log(`[Host] ✅ Комната "${ROOM_NAME}" успешно создана и отображается в списке Чикен Гана!`);
  }

  onActorJoin(actor) {
    console.log(`[Host] Зашел игрок: ${actor.name || 'Игрок'} (${this.myRoom().playerCount}/${MAX_PLAYERS})`);
  }

  onActorLeave(actor) {
    console.log(`[Host] Вышел игрок: ${actor.name || 'Игрок'}`);
  }

  onError(errorCode, errorMsg) {
    console.error(`[Photon Error] ${errorCode}: ${errorMsg}`);
    setTimeout(() => this.reconnectBot(), 5000);
  }

  reconnectBot() {
    console.log('[Host] Переподключение к региону ru...');
    this.connectToRegionMaster('ru');
  }
}

const bot = new ChickenGunBot();
bot.connectToRegionMaster('ru');
