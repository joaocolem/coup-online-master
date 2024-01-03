const 
    BlockChallengeDecisionHandler= require('./gameHandlers/challengers/blockChallengeDecisionHandler');

  const 
    BlockDecisionHandler = require('./gameHandlers/challengers/blockDecisionHandler');

  const 
    ChallengeDecisionHandler = require('./gameHandlers/challengers/challengeDecisionHandler');

  const 
    ChooseExchangeDecisionHandler = require('./gameHandlers/chooseCards/chooseExchangeDecisionHandler');
  
  const 
    ChooseInfluenceDecisionHandler = require('./gameHandlers/chooseCards/chooseInfluenceDecisionHandler');
  
  const 
    PlayAgainHandler= require('./gameHandlers/game/playAgainHandler');

  const 
    RevealDecisionHandler= require('./gameHandlers/game/revealDecisionHandler');
  
  const CoinHandler =require('./gameHandlers/game/coinHandler');
  
  const ActionController = require('./control/actionController');

class EventListener {
  constructor(gameSocket, players, match) {
    this.match = match;
    this.gameSocket = gameSocket;
    this.players = players;
}

     listen() {
        this.players.forEach(player => {
            const socket = this.gameSocket.sockets[player.socketID];

            socket.on('g-playAgain', () => PlayAgainHandler.handlePlayAgain(this.match));
            socket.on('g-deductCoins', (res) => CoinHandler.handleDeductCoins(this.match, res));
            socket.on('g-challengeDecision', (res) => ChallengeDecisionHandler.handleChallengeDecision(this.match, res));
            socket.on('g-blockChallengeDecision', (res) => BlockChallengeDecisionHandler.handleBlockChallengeDecision(this.match, res));
            socket.on('g-blockDecision', (res) => BlockDecisionHandler.handleBlockDecision(this.match, res));
            socket.on('g-revealDecision', (res) => RevealDecisionHandler.handleRevealDecision(this.match, res));
            socket.on('g-chooseInfluenceDecision', (res) => ChooseInfluenceDecisionHandler.handleChooseInfluenceDecision(this.match, res));
            socket.on('g-chooseExchangeDecision', (res) => ChooseExchangeDecisionHandler.handleChooseExchangeDecision(this.match, res));
            socket.on('g-blockAssassinateProblem', (res) => BlockAssassinateProblemHandler.handleBlockAssassinateProblem(this.match, res));
            socket.on('g-actionDecision', (res) => ActionController.handleActionDecision(this.match, res));
                  });
    }
}

module.exports = EventListener;
