const {
    IncomeHandler,
    ForeignAidHandler,
    CoupHandler,
    TaxHandler,
    AssassinateHandler,
    ExchangeHandler,
    StealHandler
  } = require('./gameHandlers/actions');
  

class GameActions {
    static applyAction(action, match) {
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