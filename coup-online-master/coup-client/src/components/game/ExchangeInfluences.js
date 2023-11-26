import React, { useState } from 'react';

const ExchangeInfluences = (props) => {
    const [state, setState] = useState({
        influences: props.influences,
        keep: [],
        totalInf: props.influences.length
    });

    const selectInfluence = (index) => {
        const updatedKeep = [...state.keep];
        const removedInfluence = state.influences.splice(index, 1)[0];
        updatedKeep.push(removedInfluence);

        setState({
            influences: state.influences,
            keep: updatedKeep,
            totalInf: state.totalInf
        });

        if (updatedKeep.length === state.totalInf - 2) {
            const res = {
                playerName: props.name,
                kept: updatedKeep,
                putBack: state.influences
            };

            props.socket.emit('g-chooseExchangeDecision', res);
            props.doneExchangeInfluence();
        }
    };

    const influences = state.influences.map((x, index) => (
        <button key={index} onClick={() => selectInfluence(index)}>
            {x}
        </button>
    ));

    return (
        <div>
            <p className="DecisionTitle">Choose which influence(s) to keep</p>
            {influences}
        </div>
    );
};

export default ExchangeInfluences;
