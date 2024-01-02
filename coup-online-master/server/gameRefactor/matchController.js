const Match = require("./match");
const MatchService = require("./matchService"); 
const EventListener = require("./eventListener"); 
const gameUtils = require("../utilities/gameUtils");

class MatchController {
    constructor(players, gameSocket) {
        this.match = new Match(players, gameSocket);
        this.eventListener = new EventListener(gameSocket, players, this.match);
    }

    start() {
        this.resetGame();
        this.listen();
        this.updatePlayers();
        console.log('Game has started');
        this.playTurn();
    }

    resetGame(startingPlayer = 0) {
        this.match.currentPlayer = startingPlayer;
        this.match.isChallengeBlockOpen = false;
        this.match.isRevealOpen = false;
        this.match.isChooseInfluenceOpen = false;
        this.match.isExchangeOpen = false;
        this.match.votes = 0;
        this.match.deck = gameUtils.buildDeck();

        for (let i = 0; i < this.match.players.length; i++) {
            const player = this.match.players[i];
            player.money = 2;
            player.influences = [this.match.deck.pop(), this.match.deck.pop()];
            player.isDead = false;
        }
    }

    restartGame() {
        this.match.gameSocket.emit('g-gameRestart', true);
    }

    listen() {
        this.eventListener.listen();
    }

    updatePlayers() {
        this.match.gameSocket.emit('g-updatePlayers', gameUtils.exportPlayers(JSON.parse(JSON.stringify(this.match.players))));
    }

    playTurn() {
        this.match.playTurn();
    }
}

module.exports = MatchController;
