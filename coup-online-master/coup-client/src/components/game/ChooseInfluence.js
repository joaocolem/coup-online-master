import React from 'react';

const ChooseInfluence = (props) => {
    const selectInfluence = (influence) => {
        const res = {
            influence: influence,
            playerName: props.name
        };
        console.log(res);
        props.socket.emit('g-chooseInfluenceDecision', res);
        props.doneChooseInfluence();
    };

    const influences = props.influences.map((x, index) => (
        <button id={`${x}`} key={index} onClick={() => selectInfluence(x)}>
            {x}
        </button>
    ));

    return (
        <div>
            <p className="DecisionTitle">Choose an influence to lose </p>
            {influences}
        </div>
    );
};

export default ChooseInfluence;
