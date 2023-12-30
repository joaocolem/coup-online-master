class ExchangeHandler {
    static handleExchange(match, source) {
        const drawTwo = [match.deck.pop(), match.deck.pop()];
        match.isExchangeOpen = true;
        match.gameSocket.to(match.nameSocketMap[source]).emit('g-openExchange', drawTwo);
        // no nextTurn() because it is called in "on chooseExchangeDecision"
    }
}

module.exports = ExchangeHandler;
