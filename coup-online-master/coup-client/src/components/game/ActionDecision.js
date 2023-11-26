import React, { useState } from 'react';

const ActionDecision = (props) => {
    const [isDecisionMade, setIsDecisionMade] = useState(false);
    const [decision, setDecision] = useState('');
    const [isPickingTarget, setIsPickingTarget] = useState(false);
    const [targetAction, setTargetAction] = useState('');
    const [actionError, setActionError] = useState('');

    const chooseAction = (action, target = null) => {
        const res = {
            action: {
                action: action,
                target: target,
                source: props.name
            }
        };
        console.log(res);

        props.socket.emit('g-actionDecision', res);
        props.doneAction();
    };

    const deductCoins = (action) => {
        console.log(props.money, action);
        if (action === 'assassinate') {
            if (props.money >= 3) {
                props.deductCoins(3);
                pickingTarget('assassinate');
            } else {
                setActionError('Not enough coins to assassinate!');
            }
        } else if (action === 'coup') {
            if (props.money >= 7) {
                props.deductCoins(7);
                pickingTarget('coup');
            } else {
                setActionError('Not enough coins to coup!');
            }
        }
    };

    const pickingTarget = (action) => {
        setIsPickingTarget(true);
        setTargetAction(action);
        setActionError('');
    };

    const pickTarget = (target) => {
        chooseAction(targetAction, target);
    };

    let controls = null;
    if (isPickingTarget) {
        controls = props.players
            .filter((x) => !x.isDead)
            .filter((x) => x.name !== props.name)
            .map((x, index) => (
                <button
                    style={{ backgroundColor: x.color }}
                    key={index}
                    onClick={() => pickTarget(x.name)}
                >
                    {x.name}
                </button>
            ));
    } else if (props.money < 10) {
        controls = (
            <>
                <button onClick={() => chooseAction('income')}>Income</button>
                <button onClick={() => deductCoins('coup')}>Coup</button>
                <button onClick={() => chooseAction('foreign_aid')}>Foreign Aid</button>
                <button id="captain" onClick={() => pickingTarget('steal')}>
                    Steal
                </button>
                <button id="assassin" onClick={() => deductCoins('assassinate')}>
                    Assassinate
                </button>
                <button id="duke" onClick={() => chooseAction('tax')}>
                    Tax
                </button>
                <button id="ambassador" onClick={() => chooseAction('exchange')}>
                    Exchange
                </button>
            </>
        );
    } else {
        controls = <button onClick={() => deductCoins('coup')}>Coup</button>;
    }

    return (
        <>
            <p className="DecisionTitle">Choose an action</p>
            <div className="DecisionButtonsContainer">
                {controls}
                <p>{actionError}</p>
            </div>
        </>
    );
};

export default ActionDecision;
