class ForeignAidHandler {
    static handleForeignAid(match, source) {
        match.players.find(player => player.name === source).money += 2;
        match.nextTurn();
    }
}

module.exports = ForeignAidHandler;
