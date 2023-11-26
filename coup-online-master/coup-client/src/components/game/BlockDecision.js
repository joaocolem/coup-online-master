import React, { useState } from 'react';
import LanguageStrings from '../utils/strings'

const BlockDecision = (props) => {

    const strings = LanguageStrings()
    const [isDecisionMade, setIsDecisionMade] = useState(false);
    const [decision, setDecision] = useState('');
    const [isPickingClaim, setIsPickingClaim] = useState(false);
    const [targetAction, setTargetAction] = useState('');



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
                        <b>{props.action.source}</b> {strings.usingForeingAid}
                    </p>
                    <button onClick={() => block('block_foreign_aid')}>{strings.blockForeingAid}</button>
                </>
            );
        } else if (props.action.action === 'steal') {
            control = <button onClick={() => pickClaim('block_steal')}>{strings.blockSteal}</button>;
        } else if (props.action.action === 'assassinate') {
            control = <button onClick={() => block('block_assassinate')}>{strings.blockAssassination}</button>;
        }
    } else {
        pickClaimElem = (
            <>
                <p>{strings.pickClaimMessage}</p>
                <button onClick={() => block(decision, 'ambassador')}>{strings.ambassador}</button>
                <button onClick={() => block(decision, 'captain')}>{strings.captain}</button>
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
