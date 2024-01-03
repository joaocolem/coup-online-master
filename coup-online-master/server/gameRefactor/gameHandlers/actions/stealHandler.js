class StealHandler {
    static handleSteal(match, source, target) {
        let stolen = 0;
        const targetPlayer = match.players.find(player => player.name === target);

        if (targetPlayer.money >= 2) {
            targetPlayer.money -= 2;
            stolen = 2;
        } else if (targetPlayer.money === 1) {
            targetPlayer.money -= 1;
            stolen = 1;
        }

        match.players.find(player => player.name === source).money += stolen;
        match.nextTurn();
    }
}

module.exports = StealHandler;
