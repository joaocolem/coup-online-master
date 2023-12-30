class BlockChallengeDecisionHandler {
    static handleBlockChallengeDecision(match, res) {
        // res.counterAction, res.prevAction, res.challengee, res.challenger, res.isChallenging
        if (match.isChallengeBlockOpen) {
            if (res.isChallenging) {
                match.closeChallenge();
                match.gameSocket.emit("g-addLog", `${res.challenger} challenged ${res.challengee}'s block`);
                match.reveal(res.prevAction, res.counterAction, res.challengee, res.challenger, true);
            } else if (match.votes + 1 === match.aliveCount - 1) {
                // then it is a pass
                match.closeChallenge();
                match.nextTurn();
            } else {
                match.votes += 1;
            }
        }
    }
}

module.exports = BlockChallengeDecisionHandler;
