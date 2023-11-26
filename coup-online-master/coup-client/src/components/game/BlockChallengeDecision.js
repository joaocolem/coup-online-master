import React from 'react';
import strings from '../utils/strings'
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
          <p>{strings.blockChallengeMessage
            .replace('{source}', props.counterAction.source)
            .replace('{action}', props.prevAction.action)
            .replace('{prevSource}', props.prevAction.source)
            .replace('{claim}', props.counterAction.claim)}
          </p>
          <button onClick={() => vote(true)}>{strings.challengeButtonText}</button>
        </>
      );
    };

export default BlockChallengeDecision;
