class MatchService {
    constructor(match) {
        this.match = match;
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

}
module.exports = MatchService;