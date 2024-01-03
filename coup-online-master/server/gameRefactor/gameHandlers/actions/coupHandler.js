class CoupHandler {
    static handleCoup(match, target) {
        match.isChooseInfluenceOpen = true;
        match.gameSocket.to(match.nameSocketMap[target]).emit('g-chooseInfluence');
        // no nextTurn() because it is called in "on chooseInfluenceDecision"
    }
}

module.exports = CoupHandler;
