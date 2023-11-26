import React from 'react';

const ChallengeDecision = (props) => {
    const vote = (isChallenging) => {
        props.closeOtherVotes('challenge');

        const res = {
            action: props.action,
            isChallenging,
            challengee: props.action.source,
            challenger: props.name
        };
        console.log(res);
        props.socket.emit('g-challengeDecision', res);
        props.doneChallengeVote();
    };

    const challengeText = (action, source, target) => {
        if (action === 'steal') {
            return <p><b>{source}</b> is trying to Steal from <b>{target}</b></p>;
        } else if (action === 'tax') {
            return <p><b>{source}</b> is trying to collect Tax (3 coins)</p>;
        } else if (action === 'assassinate') {
            return <p><b>{source}</b> is trying to Assassinate <b>{target}</b></p>;
        } else if (action === 'exchange') {
            return <p><b>{source}</b> is trying to Exchange their influences</p>;
        }
    };

    return (
        <>
            {challengeText(props.action.action, props.action.source, props.action.target)}
            <button onClick={() => vote(true)}>Challenge</button>
            {/* <button onClick={() => vote(false)}>Pass</button> */}
        </>
    );
};

export default ChallengeDecision;
