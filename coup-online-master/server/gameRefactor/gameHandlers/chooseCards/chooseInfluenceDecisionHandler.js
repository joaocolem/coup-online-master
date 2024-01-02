class ChooseInfluenceDecisionHandler {
    static handleChooseInfluenceDecision(match, res) {
        // res.influence, res.playerName
        const playerIndex = match.nameIndexMap[res.playerName];
        if (match.isChooseInfluenceOpen) {
            match.gameSocket.emit("g-addLog", `${res.playerName} lost their ${res.influence}`);
            for (let i = 0; i < match.players[playerIndex].influences.length; i++) {
                if (match.players[playerIndex].influences[i] === res.influence) {
                    match.deck.push(match.players[playerIndex].influences[i]);
                    match.deck = gameUtils.shuffleArray(match.deck);
                    match.players[playerIndex].influences.splice(i, 1);
                    break;
                }
            }
            match.isChooseInfluenceOpen = false;
            match.nextTurn();
        }
    }
}

module.exports = ChooseInfluenceDecisionHandler;
