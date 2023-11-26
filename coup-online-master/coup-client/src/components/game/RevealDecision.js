import React from 'react';

const RevealDecision = (props) => {
    const act = props.res.isBlock ? props.res.counterAction.counterAction : props.res.action.action;

    const actionMap = {
        tax: ['duke'],
        assassinate: ['assassin'],
        exchange: ['ambassador'],
        steal: ['captain'],
        block_foreign_aid: ['duke'],
        block_steal: ['ambassador', 'captain'],
        block_assassinate: ['contessa'],
    };

    const selectInfluence = (influence) => {
        const res = {
            revealedCard: influence,
            prevAction: props.res.action,
            counterAction: props.res.counterAction,
            challengee: props.res.challengee,
            challenger: props.res.challenger,
            isBlock: props.res.isBlock,
        };

        console.log(res);
        props.socket.emit('g-revealDecision', res);
        props.doneReveal();
    };

    const influences = props.influences.map((x, index) => (
        <button key={index} onClick={() => selectInfluence(x)}>
            {x}
        </button>
    ));

    return (
        <div>
            <p>
                Your <b>{act}</b> has been challenged! If you don't reveal {actionMap[act].join(' or ')} you'll lose influence!
            </p>
            {influences}
        </div>
    );
};

export default RevealDecision;
