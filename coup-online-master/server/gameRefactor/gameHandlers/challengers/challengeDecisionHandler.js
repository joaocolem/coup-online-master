class ChallengeDecisionHandler {
    static handleChallengeDecision(match, res) {
        // res.action.action, res.action.target, res.action.source, res.challengee, res.challenger, res.isChallenging
        if (match.isChallengeBlockOpen) {
            if (res.isChallenging) {
                match.closeChallenge();
                match.gameSocket.emit("g-addLog", `${res.challenger} challenged ${res.challengee}`);
                match.reveal(res.action, null, res.challengee, res.challenger, false);
            } else if (match.votes + 1 === match.aliveCount - 1) {
                // then it is a pass
                match.closeChallenge();
                match.applyAction(res.action);
            } else {
                match.votes += 1;
            }
        }
    }
}

module.exports = ChallengeDecisionHandler;
