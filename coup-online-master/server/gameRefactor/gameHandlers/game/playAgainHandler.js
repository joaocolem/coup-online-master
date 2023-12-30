class PlayAgainHandler {
    static handlePlayAgain(match, player) {
        if (match.isPlayAgainOpen) {
            match.isPlayAgainOpen = false;
            match.resetGame(Math.floor(Math.random() * match.players.length));
            match.updatePlayers();
            match.playTurn();
            match.restartGame();
        }
    }
}

module.exports = PlayAgainHandler;
