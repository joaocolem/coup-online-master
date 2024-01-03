class IncomeHandler {
    static handleIncome(match, source) {
        match.players.find(player => player.name === source).money += 1;
        match.nextTurn();
    }
}

module.exports = IncomeHandler;
