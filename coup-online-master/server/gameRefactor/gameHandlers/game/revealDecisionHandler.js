const gameUtils = require('../../utilities/gameUtils');

class RevealHandler {
    static handleRevealDecision(match, res) {
        const challengeeIndex = match.nameIndexMap[res.challengee];
        const challengerIndex = match.nameIndexMap[res.challenger];

        if (match.isRevealOpen) {
            match.isRevealOpen = false;
            if (res.isBlock) {
                if (
                    res.revealedCard === res.counterAction.claim ||
                    (res.counterAction.counterAction === 'block_steal' &&
                        (res.revealedCard === 'ambassador' || res.revealedCard === 'captain'))
                ) {
                    // challenge failed
                    match.gameSocket.emit("g-addLog", `${res.challenger}'s challenge on ${res.challengee}'s block failed`);
                    for (let i = 0; i < match.players[challengeeIndex].influences.length; i++) {
                        // revealed card needs to be replaced
                        if (match.players[challengeeIndex].influences[i] === res.revealedCard) {
                            match.deck.push(match.players[challengeeIndex].influences[i]);
                            match.deck = gameUtils.shuffleArray(match.deck);
                            match.players[challengeeIndex].influences.splice(i, 1);
                            match.players[challengeeIndex].influences.push(match.deck.pop());
                            break;
                        }
                    }
                    match.updatePlayers();
                    match.isChooseInfluenceOpen = true;
                    match.gameSocket.to(match.nameSocketMap[res.challenger]).emit('g-chooseInfluence');
                    match.nextTurn();
                } else {
                    // challenge succeeded
                    match.gameSocket.emit("g-addLog", `${res.challenger}'s challenge on ${res.challengee}'s block succeeded`);
                    match.gameSocket.emit("g-addLog", `${res.challengee} lost their ${res.revealedCard}`);
                    match.gameSocket.emit("g-reavealedCards", res.revealedCard);
                    
                    console.log(match.revealedCards);
                    for (let i = 0; i < match.players[challengeeIndex].influences.length; i++) {
                        if (match.players[challengeeIndex].influences[i] === res.revealedCard) {
                            match.deck.push(match.players[challengeeIndex].influences[i]);
                            match.deck = gameUtils.shuffleArray(match.deck);
                            match.players[challengeeIndex].influences.splice(i, 1);
                            break;
                        }
                    }
                    console.log(res.prevAction);
                    match.applyAction(res.prevAction);
                }
            } else {
                // normal challenge
                if (res.revealedCard === match.actions[res.prevAction.action].influence) {
                    // challenge failed
                    console.log("CHALLENGE: " + res.revealedCard + " " + match.actions[res.prevAction.action].influence);
                    match.gameSocket.emit("g-addLog", `${res.challenger}'s challenge on ${res.challengee} failed`);
                    for (let i = 0; i < match.players[challengeeIndex].influences.length; i++) {
                        // revealed card needs to be replaced
                        if (match.players[challengeeIndex].influences[i] === res.revealedCard) {
                            match.deck.push(match.players[challengeeIndex].influences[i]);
                            match.deck = gameUtils.shuffleArray(match.deck);
                            match.players[challengeeIndex].influences.splice(i, 1);
                            match.players[challengeeIndex].influences.push(match.deck.pop());
                            break;
                        }
                    }

                    if (
                        res.revealedCard === 'assassin' &&
                        res.prevAction.target === res.challenger &&
                        match.players[challengerIndex].influences.length === 2
                    ) {
                        match.deck.push(match.players[challengerIndex].influences[0]);
                        match.deck = gameUtils.shuffleArray(match.deck);
                        match.players[challengerIndex].influences.splice(0, 1);
                    }
                    match.updatePlayers();
                    match.isChooseInfluenceOpen = true;
                    match.gameSocket.to(match.nameSocketMap[res.challenger]).emit('g-chooseInfluence');
                    match.applyAction(res.prevAction);
                } else {
                    // challenge succeeded
                    match.gameSocket.emit("g-addLog", `${res.challenger}'s challenge on ${res.challengee} succeeded`);
                    match.gameSocket.emit("g-addLog", `${res.challengee} lost their ${res.revealedCard}`);
                    for (let i = 0; i < match.players[challengeeIndex].influences.length; i++) {
                        // revealed card needs to be replaced
                        if (match.players[challengeeIndex].influences[i] === res.revealedCard) {
                            match.deck.push(match.players[challengeeIndex].influences[i]);
                            match.deck = gameUtils.shuffleArray(match.deck);
                            match.players[challengeeIndex].influences.splice(i, 1);
                            break;
                        }
                    }
                    match.updatePlayers();
                    match.nextTurn();
                }
            }
        }
    }
}

module.exports = RevealHandler;
