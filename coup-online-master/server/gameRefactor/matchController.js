const Match = require("./match"); 
const gameUtils = require("../utilities/gameUtils");

class MatchController {
    constructor(players, gameSocket) {
        this.match = new Match(players, gameSocket);
        this.startGame();
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
        this.match.aliveCount = this.players.length;
        this.match.votes = 0;
        this.match.deck = gameUtils.buildDeck();

        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            player.money = 3;
            player.influences = [this.deck.pop(), this.deck.pop()];
            player.isDead = false;
        }
    }

    restartGame() {
        this.gameSocket.emit('g-gameRestart', true);
    }

    
}

module.exports = MatchController;