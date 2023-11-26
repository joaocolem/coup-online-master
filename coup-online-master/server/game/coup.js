const gameUtils = require('./utils');
const constants = require("../utilities/constants");

class CoupGame {
    constructor(players, gameSocket) {
        this.initializeGame(players, gameSocket);
    }

    initializeGame(players, gameSocket) {
        this.nameSocketMap = gameUtils.buildNameSocketMap(players);
        this.nameIndexMap = gameUtils.buildNameIndexMap(players);
        this.players = gameUtils.buildPlayers(players);
        this.gameSocket = gameSocket;
        this.currentPlayer = 0;
        this.deck = gameUtils.buildDeck();
        this.winner = '';
        this.actions = constants.Actions;
        this.counterActions = constants.CounterActions;
        this.isChallengeBlockOpen = false;
        this.isRevealOpen = false;
        this.isChooseInfluenceOpen = false;
        this.isExchangeOpen = false;
        this.votes = 0;
    }

    resetGame(startingPlayer = 0) {
        this.currentPlayer = startingPlayer;
        this.isChallengeBlockOpen = false;
        this.isRevealOpen = false;
        this.isChooseInfluenceOpen = false;
        this.isExchangeOpen = false;
        this.aliveCount = this.players.length;
        this.votes = 0;
        this.deck = gameUtils.buildDeck();

        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            player.money = 2;
            player.influences = [this.deck.pop(), this.deck.pop()];
            player.isDead = false;
        }
    }

    listen() {
        this.players.forEach(player => {
            const socket = this.gameSocket.sockets[player.socketID];

            socket.on('g-playAgain', () => this.handlePlayAgain(player));
            socket.on('g-deductCoins', (res) => this.handleDeductCoins(res));
            socket.on('g-actionDecision', (res) => this.handleActionDecision(res));
            socket.on('g-challengeDecision', (res) => this.handleChallengeDecision(res));
            socket.on('g-blockChallengeDecision', (res) => this.handleBlockChallengeDecision(res));
            socket.on('g-blockDecision', (res) => this.handleBlockDecision(res));
            socket.on('g-revealDecision', (res) => this.handleRevealDecision(res));
            socket.on('g-chooseInfluenceDecision', (res) => this.handleChooseInfluenceDecision(res));
            socket.on('g-chooseExchangeDecision', (res) => this.handleChooseExchangeDecision(res));
        });
    }

    handlePlayAgain(player) {
        if (this.isPlayAgainOpen) {
            this.isPlayAgainOpen = false;
            this.resetGame(Math.floor(Math.random() * this.players.length));
            this.updatePlayers();
            this.playTurn();
            this.restartGame();
        }
    }

    handleDeductCoins(res) {
        // res.amount, res.source
        console.log(`Deducting ${res.amount} coins from ${res.source}`);
        const sourceIndex = this.nameIndexMap[res.source];
        this.players[sourceIndex].money -= res.amount;
        this.updatePlayers();
    }

    handleActionDecision(res) {
        // res.action.target, res.action.action, res.action.source
        if (this.actions[res.action.action].isChallengeable) {
            this.openChallenge(res.action, this.actions[res.action.action].blockableBy.length > 0);
        } else if (res.action.action === 'foreign_aid') {
            this.isChallengeBlockOpen = true;
            this.gameSocket.emit("g-openBlock", res.action);
        } else {
            this.applyAction(res.action);
        }
    }

    handleChallengeDecision(res) {
        // res.action.action, res.action.target, res.action.source, res.challengee, res.challenger, res.isChallenging
        if (this.isChallengeBlockOpen) {
            if (res.isChallenging) {
                this.closeChallenge();
                // TODO: reveal
                this.gameSocket.emit("g-addLog", `${res.challenger} challenged ${res.challengee}`);
                this.reveal(res.action, null, res.challengee, res.challenger, false);
            } else if (this.votes + 1 === this.aliveCount - 1) {
                // then it is a pass
                this.closeChallenge();
                this.applyAction(res.action);
            } else {
                this.votes += 1;
            }
        }
    }

    handleBlockChallengeDecision(res) {
        // res.counterAction, res.prevAction, res.challengee, res.challenger, res.isChallenging
        if (this.isChallengeBlockOpen) {
            if (res.isChallenging) {
                this.closeChallenge();
                this.gameSocket.emit("g-addLog", `${res.challenger} challenged ${res.challengee}'s block`);
                this.reveal(res.prevAction, res.counterAction, res.challengee, res.challenger, true);
            } else if (this.votes + 1 === this.aliveCount - 1) {
                // then it is a pass
                this.closeChallenge();
                this.nextTurn();
            } else {
                this.votes += 1;
            }
        }
    }

    handleBlockDecision(res) {
        // res.prevAction.action, res.prevAction.target, res.prevAction.source, res.counterAction, res.blockee, res.blocker, res.isBlocking
        if (this.isChallengeBlockOpen) {
            if (res.isBlocking) {
                this.closeChallenge();
                this.gameSocket.emit("g-addLog", `${res.blocker} blocked ${res.blockee}`);
                this.openBlockChallenge(res.counterAction, res.blockee, res.prevAction);
            } else if (this.votes + 1 === this.aliveCount - 1) {
                // then it is a pass
                this.closeChallenge();
                this.applyAction(res.action);
            } else {
                this.votes += 1;
            }
        }
    }

    handleRevealDecision(res) {
        // res.revealedCard, res.prevAction, res.counterAction, res.challengee, res.challenger, res.isBlock
        const challengeeIndex = this.nameIndexMap[res.challengee];
        const challengerIndex = this.nameIndexMap[res.challenger];

        if (this.isRevealOpen) {
            this.isRevealOpen = false;
            if (res.isBlock) {
                if (
                    res.revealedCard === res.counterAction.claim ||
                    (res.counterAction.counterAction === 'block_steal' &&
                        (res.revealedCard === 'ambassador' || res.revealedCard === 'captain'))
                ) {
                    // challenge failed
                    this.gameSocket.emit("g-addLog", `${res.challenger}'s challenge on ${res.challengee}'s block failed`);
                    for (let i = 0; i < this.players[challengeeIndex].influences.length; i++) {
                        // revealed card needs to be replaced
                        if (this.players[challengeeIndex].influences[i] === res.revealedCard) {
                            this.deck.push(this.players[challengeeIndex].influences[i]);
                            this.deck = gameUtils.shuffleArray(this.deck);
                            this.players[challengeeIndex].influences.splice(i, 1);
                            this.players[challengeeIndex].influences.push(this.deck.pop());
                            break;
                        }
                    }
                    this.updatePlayers();
                    this.isChooseInfluenceOpen = true;
                    this.gameSocket.to(this.nameSocketMap[res.challenger]).emit('g-chooseInfluence');
                    this.nextTurn();
                } else {
                    // challenge succeeded
                    this.gameSocket.emit("g-addLog", `${res.challenger}'s challenge on ${res.challengee}'s block succeeded`);
                    this.gameSocket.emit("g-addLog", `${res.challengee} lost their ${res.revealedCard}`);
                    for (let i = 0; i < this.players[challengeeIndex].influences.length; i++) {
                        if (this.players[challengeeIndex].influences[i] === res.revealedCard) {
                            this.deck.push(this.players[challengeeIndex].influences[i]);
                            this.deck = gameUtils.shuffleArray(this.deck);
                            this.players[challengeeIndex].influences.splice(i, 1);
                            break;
                        }
                    }
                    console.log(res.prevAction);
                    this.applyAction(res.prevAction);
                }
            } else {
                // normal challenge
                if (res.revealedCard === this.actions[res.prevAction.action].influence) {
                    // challenge failed
                    console.log("CHALLENGE: " + res.revealedCard + " " + this.actions[res.prevAction.action].influence);
                    this.gameSocket.emit("g-addLog", `${res.challenger}'s challenge on ${res.challengee} failed`);
                    for (let i = 0; i < this.players[challengeeIndex].influences.length; i++) {
                        // revealed card needs to be replaced
                        if (this.players[challengeeIndex].influences[i] === res.revealedCard) {
                            this.deck.push(this.players[challengeeIndex].influences[i]);
                            this.deck = gameUtils.shuffleArray(this.deck);
                            this.players[challengeeIndex].influences.splice(i, 1);
                            this.players[challengeeIndex].influences.push(this.deck.pop());
                            break;
                        }
                    }

                    if (
                        res.revealedCard === 'assassin' &&
                        res.prevAction.target === res.challenger &&
                        this.players[challengerIndex].influences.length === 2
                    ) {
                        this.deck.push(this.players[challengerIndex].influences[0]);
                        this.deck = gameUtils.shuffleArray(this.deck);
                        this.players[challengerIndex].influences.splice(0, 1);
                    }
                    this.updatePlayers();
                    this.isChooseInfluenceOpen = true;
                    this.gameSocket.to(this.nameSocketMap[res.challenger]).emit('g-chooseInfluence');
                    this.applyAction(res.prevAction);
                } else {
                    // challenge succeeded
                    this.gameSocket.emit("g-addLog", `${res.challenger}'s challenge on ${res.challengee} succeeded`);
                    this.gameSocket.emit("g-addLog", `${res.challengee} lost their ${res.revealedCard}`);
                    for (let i = 0; i < this.players[challengeeIndex].influences.length; i++) {
                        // revealed card needs to be replaced
                        if (this.players[challengeeIndex].influences[i] === res.revealedCard) {
                            this.deck.push(this.players[challengeeIndex].influences[i]);
                            this.deck = gameUtils.shuffleArray(this.deck);
                            this.players[challengeeIndex].influences.splice(i, 1);
                            break;
                        }
                    }
                    this.nextTurn();
                }
            }
        }
    }

    handleChooseInfluenceDecision(res) {
        // res.influence, res.playerName
        const playerIndex = this.nameIndexMap[res.playerName];
        if (this.isChooseInfluenceOpen) {
            this.gameSocket.emit("g-addLog", `${res.playerName} lost their ${res.influence}`);
            for (let i = 0; i < this.players[playerIndex].influences.length; i++) {
                if (this.players[playerIndex].influences[i] === res.influence) {
                    this.deck.push(this.players[playerIndex].influences[i]);
                    this.deck = gameUtils.shuffleArray(this.deck);
                    this.players[playerIndex].influences.splice(i, 1);
                    break;
                }
            }
            this.isChooseInfluenceOpen = false;
            this.nextTurn();
        }
    }

    handleChooseExchangeDecision(res) {
        // res.playerName, res.kept, res.putBack = ["influence","influence"]
        const playerIndex = this.nameIndexMap[res.playerName];
        if (this.isExchangeOpen) {
            this.players[playerIndex].influences = res.kept;
            this.deck.push(res.putBack[0]);
            this.deck.push(res.putBack[1]);
            this.deck = gameUtils.shuffleArray(this.deck);
            this.isExchangeOpen = false;
            this.nextTurn();
        }
    }



    updatePlayers() {
        this.gameSocket.emit('g-updatePlayers', gameUtils.exportPlayers(JSON.parse(JSON.stringify(this.players))));
    }

    restartGame() {
        this.gameSocket.emit('g-gameRestart', true);
    }

    reveal(action, counterAction, challengee, challenger, isBlock) {
        const res = {
            action: action,
            counterAction: counterAction,
            challengee: challengee,
            challenger: challenger,
            isBlock: isBlock
        };

        this.isRevealOpen = true;
        this.gameSocket.to(this.nameSocketMap[res.challengee]).emit("g-chooseReveal", res);
    }

    closeChallenge() {
        this.isChallengeBlockOpen = false;
        this.votes = 0;
        this.gameSocket.emit("g-closeChallenge");
        this.gameSocket.emit("g-closeBlock");
        this.gameSocket.emit("g-closeBlockChallenge");
    }

    openChallenge(action, isBlockable) {
        this.isChallengeBlockOpen = true;
        if (isBlockable && action.target != null) {
            const targetIndex = this.players.findIndex(player => player.name === action.target);
            this.gameSocket.to(this.players[targetIndex].socketID).emit("g-openBlock", action);
        }
        this.gameSocket.emit("g-openChallenge", action);
    }

    openBlockChallenge(counterAction, blockee, prevAction) {
        this.isChallengeBlockOpen = true;
        this.gameSocket.emit("g-openBlockChallenge", {
            counterAction: counterAction,
            prevAction: prevAction
        });
    }

    applyAction(action) {
        let logTarget = '';
    
        if (action.target) {
            logTarget = ` on ${action.target}`;
        }
    
        this.gameSocket.emit("g-addLog", `${action.source} used ${action.action}${logTarget}`);
        const execute = action.action;
        const target = action.target;
        const source = action.source;
    
        switch (execute) {
            case 'income':
                this.handleIncome(source);
                break;
            case 'foreign_aid':
                this.handleForeignAid(source);
                break;
            case 'coup':
                this.handleCoup(target);
                break;
            case 'tax':
                this.handleTax(source);
                break;
            case 'assassinate':
                this.handleAssassinate(target);
                break;
            case 'exchange':
                this.handleExchange(source);
                break;
            case 'steal':
                this.handleSteal(source, target);
                break;
            default:
                console.log('ERROR ACTION NOT FOUND');
        }
    }
    
    // Add additional methods for specific actions
    
    handleIncome(source) {
        this.players.find(player => player.name === source).money += 1;
        this.nextTurn();
    }
    
    handleForeignAid(source) {
        this.players.find(player => player.name === source).money += 2;
        this.nextTurn();
    }
    
    handleCoup(target) {
        this.isChooseInfluenceOpen = true;
        this.gameSocket.to(this.nameSocketMap[target]).emit('g-chooseInfluence');
        // no nextTurn() because it is called in "on chooseInfluenceDecision"
    }
    
    handleTax(source) {
        this.players.find(player => player.name === source).money += 3;
        this.nextTurn();
    }
    
    handleAssassinate(target) {
        this.isChooseInfluenceOpen = true;
        this.gameSocket.to(this.nameSocketMap[target]).emit('g-chooseInfluence');
        // no nextTurn() because it is called in "on chooseInfluenceDecision"
    }
    
    handleExchange(source) {
        const drawTwo = [this.deck.pop(), this.deck.pop()];
        this.isExchangeOpen = true;
        this.gameSocket.to(this.nameSocketMap[source]).emit('g-openExchange', drawTwo);
        // no nextTurn() because it is called in "on chooseExchangeDecision"
    }
    
    handleSteal(source, target) {
        let stolen = 0;
        const targetPlayer = this.players.find(player => player.name === target);
    
        if (targetPlayer.money >= 2) {
            targetPlayer.money -= 2;
            stolen = 2;
        } else if (targetPlayer.money === 1) {
            targetPlayer.money -= 1;
            stolen = 1;
        }
    
        this.players.find(player => player.name === source).money += stolen;
        this.nextTurn();
    }
    

    nextTurn() {
        if (!this.isChallengeBlockOpen && !this.isChooseInfluenceOpen && !this.isExchangeOpen && !this.isRevealOpen) {
            this.players.forEach(player => {
                if (player.influences.length === 0 && !player.isDead) {
                    this.gameSocket.emit("g-addLog", `${player.name} is out!`);
                    this.aliveCount -= 1;
                    player.isDead = true;
                    player.money = 0;
                }
            });

            this.updatePlayers();

            if (this.aliveCount === 1) {
                let winner = null;

                for (let i = 0; i < this.players.length; i++) {
                    if (this.players[i].influences.length > 0) {
                        winner = this.players[i].name;
                    }
                }

                this.isPlayAgainOpen = true;
                this.gameSocket.emit('g-gameOver', winner);
            } else {
                do {
                    this.currentPlayer += 1;
                    this.currentPlayer %= this.players.length;
                } while (this.players[this.currentPlayer].isDead);

                this.playTurn();
            }
        }
    }

    playTurn() {
        this.gameSocket.emit("g-updateCurrentPlayer", this.players[this.currentPlayer].name);
        this.gameSocket.to(this.players[this.currentPlayer].socketID).emit('g-chooseAction');
    }

    onChooseAction(action) {
        console.log('action', action);
    }

    start() {
        this.resetGame();
        this.listen();
        this.updatePlayers();
        console.log('Game has started');
        this.playTurn();
    }
}

module.exports = CoupGame;
