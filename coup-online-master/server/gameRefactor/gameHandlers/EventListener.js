const {
    BlockChallengeDecisionHandler,
    BlockAssassinateProblemHandler,
    BlockDecisionHandler,
  } = require('./gameHandlers/challengers');

const {
    ChooseExchangeDecisionHandler,
    ChooseInfluenceDecisionHandler,
  } = require('./gameHandlers/chooseCards');  

  const {
    PlayAgainHandler,
    RevealDecisionHandler,
    CoinHandler,
  } = require('./gameHandlers/game');  

  const {
    ActionController
  } = require('ActionController');  


class EventListener {
    static listen(gameSocket, players, match) {
        players.forEach(player => {
            const socket = gameSocket.sockets[player.socketID];

            socket.on('g-playAgain', () => PlayAgainHandler.handlePlayAgain(match));
            socket.on('g-deductCoins', (res) => CoinHandler.handleDeductCoins(match, res));
            socket.on('g-challengeDecision', (res) => ChallengeDecisionHandler.handleChallengeDecision(match, res));
            socket.on('g-blockChallengeDecision', (res) => BlockChallengeDecisionHandler.handleBlockChallengeDecision(match, res));
            socket.on('g-blockDecision', (res) => BlockDecisionHandler.handleBlockDecision(match, res));
            socket.on('g-revealDecision', (res) => RevealDecisionHandler.handleRevealDecision(match, res));
            socket.on('g-chooseInfluenceDecision', (res) => ChooseInfluenceDecisionHandler.handleChooseInfluenceDecision(match, res));
            socket.on('g-chooseExchangeDecision', (res) => ChooseExchangeDecisionHandler.handleChooseExchangeDecision(match, res));
            socket.on('g-blockAssassinateProblem', (res) => BlockAssassinateProblemHandler.handleBlockAssassinateProblem(match, res));
            socket.on('g-actionDecision', (res) => ActionController.handleActionDecision(match, res));
        });
    }
}

module.exports = EventListener;
