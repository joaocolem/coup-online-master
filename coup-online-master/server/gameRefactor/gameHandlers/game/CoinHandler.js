class CoinHandler {
    static handleDeductCoins(match, res) {
        console.log(`Deducting ${res.amount} coins from ${res.source}`);
        const sourceIndex = match.nameIndexMap[res.source];
        match.players[sourceIndex].money -= res.amount;
        match.updatePlayers();
    }
}

module.exports = CoinHandler;
