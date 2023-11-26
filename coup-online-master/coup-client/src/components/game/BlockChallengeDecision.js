import React from 'react';

const BlockChallengeDecision = (props) => {
    const vote = (isChallenging) => {
        props.closeOtherVotes('challenge-block');

        const res = {
            counterAction: props.counterAction,
            prevAction: props.prevAction,
            isChallenging,
            challengee: props.counterAction.source,
            challenger: props.name
        };
        console.log(res);
        props.socket.emit('g-blockChallengeDecision', res);
        props.doneBlockChallengeVote();
    };

    return (
        <>
            <p>{props.counterAction.source} is trying to block {props.prevAction.action} from {props.prevAction.source} as {props.counterAction.claim}</p>
            <button onClick={() => vote(true)}>Challenge</button>
            {/* <button onClick={() => vote(false)}>Pass</button> */}
        </>
    );
};

export default BlockChallengeDecision;
