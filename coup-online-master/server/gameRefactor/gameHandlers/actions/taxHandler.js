class TaxHandler {
    static handleTax(match, source) {
        match.players.find(player => player.name === source).money += 3;
        match.nextTurn();
    }
}

module.exports = TaxHandler;
