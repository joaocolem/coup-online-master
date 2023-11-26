import React from 'react';
import LanguageStrings from '../utils/strings'


const ChooseInfluence = (props) => {

    const strings = LanguageStrings()
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
            <p className="DecisionTitle">{strings.chooseInfluenceToLose} </p>
            {influences}
        </div>
    );
};

export default ChooseInfluence;
