class BlockDecisionHandler {
    static handleBlockDecision(match, res) {
        // res.prevAction.action, res.prevAction.target, res.prevAction.source, res.counterAction, res.blockee, res.blocker, res.isBlocking
        if (match.isChallengeBlockOpen) {
            if (res.isBlocking) {
                match.closeChallenge();
                match.gameSocket.emit("g-addLog", `${res.blocker} blocked ${res.blockee}`);
                match.openBlockChallenge(res.counterAction, res.blockee, res.prevAction);
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

module.exports = BlockDecisionHandler;
