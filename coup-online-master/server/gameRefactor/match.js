const constants = require("../utilities/constants");
const gameUtils = require("../utilities/gameUtils");

class Match {
    constructor(players, gameSocket) {
        this.nameSocketMap = gameUtils.buildNameSocketMap(players);
        this.nameIndexMap = gameUtils.buildNameIndexMap(players);
        this.players = gameUtils.buildPlayers(players);
        this.gameSocket = gameSocket;
        this.currentPlayer = 0;
        this.deck = gameUtils.buildDeck();
        this.winner = '';
        this.actions = constants.Actions;
        this.counterActions = constants.CounterActions;
        this.isChallengeBlockOpen = false;
        this.isRevealOpen = false;
        this.isChooseInfluenceOpen = false;
        this.isExchangeOpen = false;
        this.votes = 0;
        this.revealedCards;
    }

    nextTurn() {
        if (!this.isChallengeBlockOpen && !this.isChooseInfluenceOpen && !this.isExchangeOpen && !this.isRevealOpen) {
            this.players.forEach(player => {
                if (player.influences.length === 0 && !player.isDead) {
                    this.gameSocket.emit("g-addLog", `${player.name} is out!`);
                    this.aliveCount -= 1;
                    player.isDead = true;
                    player.money = 0;
                }
            });

            this.updatePlayers();

            if (this.aliveCount === 1) {
                let winner = null;

                for (let i = 0; i < this.players.length; i++) {
                    if (this.players[i].influences.length > 0) {
                        winner = this.players[i].name;
                    }
                }

                this.isPlayAgainOpen = true;
                this.gameSocket.emit('g-gameOver', winner);
            } else {
                do {
                    this.currentPlayer += 1;
                    this.currentPlayer %= this.players.length;
                } while (this.players[this.currentPlayer].isDead);

                this.playTurn();
            }
        }
    }

    playTurn() {
        this.gameSocket.emit("g-updateCurrentPlayer", this.players[this.currentPlayer].name);
        this.gameSocket.to(this.players[this.currentPlayer].socketID).emit('g-chooseAction');
    }

    updatePlayers() {
        this.gameSocket.emit('g-updatePlayers', gameUtils.exportPlayers(JSON.parse(JSON.stringify(this.players))));
    }

    closeChallenge() {
        this.isChallengeBlockOpen = false;
        this.votes = 0;
        this.gameSocket.emit("g-closeChallenge");
        this.gameSocket.emit("g-closeBlock");
        this.gameSocket.emit("g-closeBlockChallenge");
    }

    openChallenge(action, isBlockable) {
        this.isChallengeBlockOpen = true;
        if (isBlockable && action.target != null) {
            const targetIndex = this.players.findIndex(player => player.name === action.target);
            this.gameSocket.to(this.players[targetIndex].socketID).emit("g-openBlock", action);
        }
        this.gameSocket.emit("g-openChallenge", action);
    }
}

module.exports = Match;
