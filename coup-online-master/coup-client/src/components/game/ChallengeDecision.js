import React from 'react';
import LanguageStrings from '../utils/strings'

const ChallengeDecision = (props) => {
    const strings = LanguageStrings()

    const vote = (isChallenging) => {
        props.closeOtherVotes('challenge');

        const res = {
            action: props.action,
            isChallenging,
            challengee: props.action.source,
            challenger: props.name,
        };
        console.log(res);
        props.socket.emit('g-challengeDecision', res);
        props.doneChallengeVote();
    };

    const challengeText = (action, source, target) => {
        if (action === 'steal') {
            return <p><b>{source}</b> {strings.challengeSteal.replace('{target}', `<b>${target}</b>`)}</p>;
        } else if (action === 'tax') {
            return <p>{strings.challengeTax}</p>;
        } else if (action === 'assassinate') {
            return <p><b>{source}</b> {strings.challengeAssassinate.replace('{target}', `<b>${target}</b>`)}</p>;
        } else if (action === 'exchange') {
            return <p>{strings.challengeExchange}</p>;
        }
    };

    return (
        <>
            {challengeText(props.action.action, props.action.source, props.action.target)}
            <button onClick={() => vote(true)}>{strings.challengeButtonText}</button>
            {/* <button onClick={() => vote(false)}>Pass</button> */}
        </>
    );
};

export default ChallengeDecision;
