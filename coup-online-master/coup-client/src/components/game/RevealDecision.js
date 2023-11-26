import React from 'react';
import LanguageStrings from '../utils/strings';
const RevealDecision = (props) => {

    const strings = LanguageStrings()
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
                {strings.your} <b>{act}</b>{strings.reavelMessage} {actionMap[act].join(strings.or)} {strings.loseInfluence}
            </p>
            {influences}
        </div>
    );
};

export default RevealDecision;
