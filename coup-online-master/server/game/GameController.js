const { GameBuilder } = require('./GameBuilder');

class GameController {
    constructor(players) {
        this.players = players;
        this.colors = [
            '#4A90E2', '#9370DB', '#8A2BE2', '#8B4513', '#4169E1', '#800000',
            '#2E8B57', '#9932CC', '#B22222', '#008080', '#6A5ACD', '#DC143C',
            '#556B2F', '#483D8B', '#A52A2A'
        ];
    }

    initializeGame() {
        this.shuffleColors();
        this.buildPlayers();
        this.buildDeck();
        this.exportPlayers();
    }

    shuffleColors() {
        this.colors = GameBuilder.shuffleArray(this.colors);
    }

    buildPlayers() {
        this.players = GameBuilder.buildPlayers(this.players);
        this.players.forEach((player) => {
            GameBuilder.initializePlayer(player);
        });
    }

    exportPlayers() {
        this.players.forEach((player) => {
            delete player.socketID;
        });
    }

    buildDeck() {
        this.deck = GameBuilder.buildDeck();
    }
}

module.exports = GameController;
