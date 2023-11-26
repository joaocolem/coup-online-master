import React, { useState } from 'react';

const BlockDecision = (props) => {
    const [isDecisionMade, setIsDecisionMade] = useState(false);
    const [decision, setDecision] = useState('');
    const [isPickingClaim, setIsPickingClaim] = useState(false);
    const [targetAction, setTargetAction] = useState('');

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

    const block = (block, claim = null) => {
        props.closeOtherVotes('block');
        let resClaim;
        if (claim != null) {
            resClaim = claim;
        } else if (block === 'block_foreign_aid') {
            resClaim = 'duke';
        } else if (block === 'block_assassinate') {
            resClaim = 'contessa';
        } else {
            console.error('unknown claim, line 40');
        }

        const res = {
            prevAction: props.action,
            counterAction: {
                counterAction: block,
                claim: resClaim,
                source: props.name
            },
            blockee: props.action.source,
            blocker: props.name,
            isBlocking: true
        };
        console.log(res);
        props.socket.emit('g-blockDecision', res);
        props.doneBlockVote();
    };

    const pass = () => {
        const res = {
            action: props.action,
            isBlocking: false
        };
        console.log(res);
        props.socket.emit('g-blockDecision', res);
        props.doneBlockVote();
    };

    const pickClaim = (block) => {
        props.closeOtherVotes('block');
        setDecision(block);
        setIsPickingClaim(true);
    };

    let control = null;
    let pickClaimElem = null;

    if (!isPickingClaim) {
        if (props.action.action === 'foreign_aid') {
            control = (
                <>
                    <p>
                        <b>{props.action.source}</b> is trying to use Foreign Aid
                    </p>
                    <button onClick={() => block('block_foreign_aid')}>Block Foreign Aid</button>
                </>
            );
        } else if (props.action.action === 'steal') {
            control = <button onClick={() => pickClaim('block_steal')}>Block Steal</button>;
        } else if (props.action.action === 'assassinate') {
            control = <button onClick={() => block('block_assassinate')}>Block Assassination</button>;
        }
    } else {
        pickClaimElem = (
            <>
                <p>To block steal, do you claim Ambassador or Captain?</p>
                <button onClick={() => block(decision, 'ambassador')}>Ambassador</button>
                <button onClick={() => block(decision, 'captain')}>Captain</button>
            </>
        );
    }

    return (
        <>
            {control}
            {pickClaimElem}
            {/* <button onClick={() => pass()}>Pass</button> */}
        </>
    );
};

export default BlockDecision;
