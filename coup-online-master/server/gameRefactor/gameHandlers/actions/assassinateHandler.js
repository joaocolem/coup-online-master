class AssassinateHandler {
    static handleAssassinate(match, target) {
        match.isChooseInfluenceOpen = true;
        match.gameSocket.to(match.nameSocketMap[target]).emit('g-chooseInfluence');
        // no nextTurn() because it is called in "on chooseInfluenceDecision"
    }
}

module.exports = AssassinateHandler;
