class ChooseExchangeDecisionHandler {
    static handleChooseExchangeDecision(match, res) {
        // res.playerName, res.kept, res.putBack = ["influence","influence"]
        const playerIndex = match.nameIndexMap[res.playerName];
        if (match.isExchangeOpen) {
            match.players[playerIndex].influences = res.kept;
            match.deck.push(res.putBack[0]);
            match.deck.push(res.putBack[1]);
            match.deck = gameUtils.shuffleArray(match.deck);
            match.isExchangeOpen = false;
            match.nextTurn();
        }
    }
}

module.exports = ChooseExchangeDecisionHandler;
