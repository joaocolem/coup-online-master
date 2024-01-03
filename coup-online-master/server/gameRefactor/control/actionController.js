const 
    IncomeHandler = require('../gameHandlers/actions/incomeHandler');
  
  const 
    ForeignAidHandler= require('../gameHandlers/actions/foreingAindHandler');
  
  const 
    CoupHandler = require('../gameHandlers/actions/coupHandler');
  
  const 
    TaxHandler= require('../gameHandlers/actions/taxHandler');
  
  const 
    AssassinateHandler = require('../gameHandlers/actions/assassinateHandler');
  
  const 
    ExchangeHandler= require('../gameHandlers/actions/exchangeHandler');
  
  const 
    StealHandler= require('../gameHandlers/actions/stealHandler');
  
  

class ActionController {
    static handleActionDecision(match, res) {
       
        const { action } = res;

        if (match.actions && match.actions[action.action] && match.actions[action.action].isChallengeable) {
            match.openChallenge(action, match.actions[action.action].blockableBy.length > 0, match);
        } else if (action.action === 'foreign_aid') {
            match.isChallengeBlockOpen = true;
            match.gameSocket.emit("g-openBlock", action);
        } else {
            this.#applyAction(action, match); 
        }
        
    }

    static #applyAction(action, match) {
        let logTarget = '';

        if (action.target) {
            logTarget = ` on ${action.target}`;
        }

        match.gameSocket.emit("g-addLog", `${action.source} used ${action.action}${logTarget}`);
        const execute = action.action;
        const target = action.target;
        const source = action.source;

        switch (execute) {
            case 'income':
                IncomeHandler.handleIncome(source);
                break;
            case 'foreign_aid':
                ForeignAidHandler.handleForeignAid(source);
                break;
            case 'coup':
                CoupHandler.handleCoup(match, target);
                break;
            case 'tax':
                TaxHandler.handleTax(source);
                break;
            case 'assassinate':
                AssassinateHandler.handleAssassinate(match, target);
                break;
            case 'exchange':
                ExchangeHandler.handleExchange(source);
                break;
            case 'steal':
                StealHandler.handleSteal(match, source, target);
                break;
            default:
                console.log('ERROR ACTION NOT FOUND');
        }
    }

}

module.exports = ActionController;
