import React, { useState, useEffect } from 'react';
import ActionDecision from './ActionDecision';
import ChallengeDecision from './ChallengeDecision';
import BlockChallengeDecision from './BlockChallengeDecision';
import PlayerBoard from './PlayerBoard';
import RevealDecision from './RevealDecision';
import BlockDecision from './BlockDecision';
import ChooseInfluence from './ChooseInfluence';
import ExchangeInfluences from './ExchangeInfluences';
import './CoupStyles.css';
import EventLog from './EventLog';
import ReactModal from 'react-modal';
import CheatSheetModal from '../CheatSheetModal';
import RulesModal from '../RulesModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessKnight, faShip, faSkull, faCrown, faHandshake } from '@fortawesome/free-solid-svg-icons';
import LanguageStrings from '../utils/strings'

const Coup = (props) => {

    const strings = LanguageStrings();
    let playAgainButtonElem = null;
    const [state, setState] = useState({
        action: null,
        blockChallengeRes: null,
        players: [],
        playerIndex: null,
        currentPlayer: '',
        isChooseAction: false,
        revealingRes: null,
        blockingAction: null,
        isChoosingInfluence: false,
        exchangeInfluence: null,
        error: '',
        winner: '',
        playAgain: null,
        logs: [],
        isDead: false,
        waiting: true,
        disconnected: false,
    });
    
    const [isUpdate, setIsUpdate] = useState(false);
    const [isRenderPlay, setIsRenderPlay] = useState(false);

    const playAgainButton = (
        <>
            <br></br>
            <button className="startGameButton" onClick={() => props.socket.emit('g-playAgain')}>
                {strings.playAgain}
            </button>
        </>
    );


    useEffect(() => {
        const handleDisconnect = (reason) => {
            setState((prev) => ({ ...prev, disconnected: true }));
        };

        const handleGameOver = (winner) => {
            setState((prev) => ({ ...prev, winner: `${winner} Wins!`, playAgain: playAgainButton }))
            setIsRenderPlay(true);
        };

        const handleUpdatePlayers = (players) => {
            setState((prev) => {
                let isDead = true;
                let playerIndex = null;
                players = players.filter((x) => !x.isDead);
        
                for (let i = 0; i < players.length; i++) {
                    if (players[i].name === props.name) {
                        playerIndex = i;
                        isDead = false;
                        break;
                    }
                }
                return { ...prev, playerIndex, players, isDead };
            });
        };
        

        const handleUpdateCurrentPlayer = (currentPlayer) => {
            setState((prev) => ({ ...prev, currentPlayer }));
        };

        const handleAddLog = (log) => {
            let splitLog = log.split(' ');
            let coloredLog = splitLog.map((item, index) => {
                let found = null;
                state.players.forEach((player) => {
                    if (item === player.name) {
                        found = <b style={{ color: player.color }}>{player.name} </b>;
                    }
                });
                if (found) {
                    return found;
                }
                return <>{item + ' '}</>;
            });
            setState((prev) => ({ ...prev, logs: [...prev.logs, coloredLog] }));
        };

        const handleChooseAction = () => {
            setState((prev) => ({ ...prev, isChooseAction: true }));
        };

        const handleOpenExchange = (drawTwo) => {
            let influences = [...state.players[state.playerIndex].influences, ...drawTwo];
            setState((prev) => ({ ...prev, exchangeInfluence: influences }));
        };

        const handleOpenChallenge = (action) => {
            if (state.isDead) {
                return;
            }
            if (action.source !== props.name) {
                setState((prev) => ({ ...prev, action }));
            } else {
                setState((prev) => ({ ...prev, action: null }));
            }
        };

        const handleOpenBlockChallenge = (blockChallengeRes) => {
            if (state.isDead) {
                return;
            }
            if (blockChallengeRes.counterAction.source !== props.name) {
                setState((prev) => ({ ...prev, blockChallengeRes }));
            } else {
                setState((prev) => ({ ...prev, blockChallengeRes: null }));
            }
        };

        const handleOpenBlock = (action) => {
            if (state.isDead) {
                return;
            }
            if (action.source !== props.name) {
                setState((prev) => ({ ...prev, blockingAction: action }));
            } else {
                setState((prev) => ({ ...prev, blockingAction: null }));
            }
        };

        const handleChooseReveal = (res) => {
            setState((prev) => ({ ...prev, revealingRes: res }));
        };

        const handleChooseInfluence = () => {
            setState((prev) => ({ ...prev, isChoosingInfluence: true }));
        };

        const handleCloseChallenge = () => {
            setState((prev) => ({ ...prev, action: null }));
        };

        const handleCloseBlock = () => {
            setState((prev) => ({ ...prev, blockingAction: null }));
        };

        const handleCloseBlockChallenge = () => {
            setState((prev) => ({ ...prev, blockChallengeRes: null }));
        };

        const handlePlayAgain = () => {
            setIsRenderPlay(false);
            setState((prev) => ({ ...prev, winner: ''}));
        }

        props.socket.on('disconnect', handleDisconnect);
        props.socket.on('g-gameOver', handleGameOver);
        props.socket.on('g-updatePlayers', handleUpdatePlayers);
        props.socket.on('g-updateCurrentPlayer', handleUpdateCurrentPlayer);
        props.socket.on('g-addLog', handleAddLog);
        props.socket.on('g-chooseAction', handleChooseAction);
        props.socket.on('g-openExchange', handleOpenExchange);
        props.socket.on('g-openChallenge', handleOpenChallenge);
        props.socket.on('g-openBlockChallenge', handleOpenBlockChallenge);
        props.socket.on('g-openBlock', handleOpenBlock);
        props.socket.on('g-chooseReveal', handleChooseReveal);
        props.socket.on('g-chooseInfluence', handleChooseInfluence);
        props.socket.on('g-closeChallenge', handleCloseChallenge);
        props.socket.on('g-closeBlock', handleCloseBlock);
        props.socket.on('g-closeBlockChallenge', handleCloseBlockChallenge);
        props.socket.on('g-gameRestart', handlePlayAgain);

        return () => {
            // Cleanup listeners
            props.socket.off('disconnect', handleDisconnect);
            props.socket.off('g-gameOver', handleGameOver);
            props.socket.off('g-updatePlayers', handleUpdatePlayers);
            props.socket.off('g-updateCurrentPlayer', handleUpdateCurrentPlayer);
            props.socket.off('g-addLog', handleAddLog);
            props.socket.off('g-chooseAction', handleChooseAction);
            props.socket.off('g-openExchange', handleOpenExchange);
            props.socket.off('g-openChallenge', handleOpenChallenge);
            props.socket.off('g-openBlockChallenge', handleOpenBlockChallenge);
            props.socket.off('g-openBlock', handleOpenBlock);
            props.socket.off('g-chooseReveal', handleChooseReveal);
            props.socket.off('g-chooseInfluence', handleChooseInfluence);
            props.socket.off('g-closeChallenge', handleCloseChallenge);
            props.socket.off('g-closeBlock', handleCloseBlock);
            props.socket.off('g-closeBlockChallenge', handleCloseBlockChallenge);
            props.socket.off('g-gameRestart', handlePlayAgain);
        };
    }, [props.socket, props.name, state, isUpdate]);

    const deductCoins = (amount) => {
        let res = {
            source: props.name,
            amount: amount,
        };
        props.socket.emit('g-deductCoins', res);
    };

    const doneAction = () => {
        setState((prev) => ({ ...prev, isChooseAction: false }));
    };

    const doneChallengeBlockingVote = () => {
        setState((prev) => ({
            ...prev,
            action: null,
            blockChallengeRes: null,
            blockingAction: null,
        }));
    };

    const closeOtherVotes = (voteType) => {
        if (voteType === 'challenge') {
            setState((prev) => ({
                ...prev,
                blockChallengeRes: null,
                blockingAction: null,
            }));
        } else if (voteType === 'block') {
            setState((prev) => ({
                ...prev,
                action: null,
                blockChallengeRes: null,
            }));
        } else if (voteType === 'challenge-block') {
            setState((prev) => ({
                ...prev,
                action: null,
                blockingAction: null,
            }));
        }
    };

    const doneReveal = () => {
        setState((prev) => ({ ...prev, revealingRes: null }));
    };

    const doneChooseInfluence = () => {
        setState((prev) => ({ ...prev, isChoosingInfluence: false }));
    };

    const doneExchangeInfluence = () => {
        setState((prev) => ({ ...prev, exchangeInfluence: null }));
    };

    const pass = () => {
        if (state.action != null) {
            let res = {
                isChallenging: false,
                action: state.action,
            };
            props.socket.emit('g-challengeDecision', res);
        } else if (state.blockChallengeRes != null) {
            let res = {
                isChallenging: false,
            };
            props.socket.emit('g-blockChallengeDecision', res);
        } else if (state.blockingAction !== null) {
            const res = {
                action: state.blockingAction,
                isBlocking: false,
            };
            props.socket.emit('g-blockDecision', res);
        }
        doneChallengeBlockingVote();
    };



    const influenceColorMap = {
        duke: '#D55DC7',
        captain: '#80C6E5',
        assassin: '#2B2B2B',
        contessa: '#E35646',
        ambassador: '#B4CA1F',
    };

    let actionDecision = null;
    let currentPlayer = null;
    let currentPlayerName = null;
    let revealDecision = null;
    let challengeDecision = null;
    let blockChallengeDecision = null;
    let chooseInfluenceDecision = null;
    let blockDecision = null;
    let influences = null;
    let passButton = null;
    let coins = null;
    let exchangeInfluences = null;

    let isWaiting = true;
    let waiting = null;

    if (state.isChooseAction && state.playerIndex != null) {
        isWaiting = false;
        actionDecision = (
            <ActionDecision
                doneAction={doneAction}
                deductCoins={deductCoins}
                name={props.name}
                socket={props.socket}
                money={state.players[state.playerIndex].money}
                players={state.players}
            ></ActionDecision>
        );
    }

    if (state.currentPlayer) {
        currentPlayerName = state.currentPlayer;
        currentPlayer = <p>{strings.itIs} <b>{state.currentPlayer}</b>{strings.turn}</p>;
    }

    if (state.revealingRes) {
        isWaiting = false;
        revealDecision = (
            <RevealDecision
                doneReveal={doneReveal}
                name={props.name}
                socket={props.socket}
                res={state.revealingRes}
                influences={state.players.filter((x) => x.name === props.name)[0].influences}
            ></RevealDecision>
        );
    }

    if (state.isChoosingInfluence) {
        isWaiting = false;

        chooseInfluenceDecision = (
            <ChooseInfluence
                doneChooseInfluence={doneChooseInfluence}
                name={props.name}
                socket={props.socket}
                influences={state.players.filter((x) => x.name === props.name)[0].influences}
            ></ChooseInfluence>
        );

    }

    if (state.action != null || state.blockChallengeRes != null || state.blockingAction !== null) {
        passButton = <button onClick={() => pass()}>{strings.pass}</button>;
    }

    if (state.action != null) {
        isWaiting = false;
        challengeDecision = (
            <ChallengeDecision
                closeOtherVotes={closeOtherVotes}
                doneChallengeVote={doneChallengeBlockingVote}
                name={props.name}
                action={state.action}
                socket={props.socket}
            ></ChallengeDecision>
        );
    }

    if (state.exchangeInfluence) {
        isWaiting = false;
        exchangeInfluences = (
            <ExchangeInfluences
                doneExchangeInfluence={doneExchangeInfluence}
                name={props.name}
                influences={state.exchangeInfluence}
                socket={props.socket}
            ></ExchangeInfluences>
        );
    }

    if (state.blockChallengeRes != null) {
        isWaiting = false;
        blockChallengeDecision = (
            <BlockChallengeDecision
                closeOtherVotes={closeOtherVotes}
                doneBlockChallengeVote={doneChallengeBlockingVote}
                name={props.name}
                prevAction={state.blockChallengeRes.prevAction}
                counterAction={state.blockChallengeRes.counterAction}
                socket={props.socket}
            ></BlockChallengeDecision>
        );
    }

    if (state.blockingAction !== null) {
        isWaiting = false;
        blockDecision = (
            <BlockDecision
                closeOtherVotes={closeOtherVotes}
                doneBlockVote={doneChallengeBlockingVote}
                name={props.name}
                action={state.blockingAction}
                socket={props.socket}
            ></BlockDecision>
        );
    }

    if (state.playerIndex != null && !state.isDead) {
        influences = (
            <div className="InfluencesContainer">
                {state.players[state.playerIndex].influences.map((influence, index) => {
                    let icon = null;
                    let influenceString = null;

                    switch (influence) {
                        case 'duke':
                            icon = faChessKnight;
                            influenceString = (strings.dukeInflu)
                            break;
                        case 'captain':
                            icon = faShip;
                            influenceString = (strings.captainInflu)
                            break;
                        case 'assassin':
                            icon = faSkull;
                            influenceString = (strings.assassinInflu)
                            break;
                        case 'contessa':
                            icon = faCrown;
                            influenceString = (strings.contessaInflu)
                            break;
                        case 'ambassador':
                            icon = faHandshake;
                            influenceString = (strings.ambassadorInflu)
                            break;
                        default:
                            break;
                    }

                    return (
                        <div key={index} className="InfluenceUnitContainer">
                            <FontAwesomeIcon icon={icon} style={{ color: `${influenceColorMap[influence]}` }} />
                            <br />
                            <h3>{influenceString}</h3>
                            </div>
                    );
                })}
            </div>
        );

        coins = (
            <div className="CoinsContainer">
                <h3>{strings.coins}{state.players[state.playerIndex].money}</h3>
            </div>
        );
    }

    if (state.waiting) {
        waiting = <p>{strings.waitingPlayers}</p>;
    }

    if (state.disconnected) {
        waiting = <p>{strings.disconnected}</p>;
    }

    if (state.winner !== '') {
        waiting = <p>{state.winner}</p>;
    }

    if (state.playAgain) {
        playAgainButtonElem = state.playAgain;
    }

    return (
        <div className="GameContainer">
            <div className="GameHeader">
                <div className="PlayerInfo">
                    <p>{strings.youAre}{props.name}</p>
                    {coins}
                </div>
                <div className="CurrentPlayer">{currentPlayer}</div>
                <RulesModal />
                <CheatSheetModal />
                <EventLog logs={state.logs}></EventLog>
            </div>
    
            <PlayerBoard
                players={state.players}
                heroName={props.name}
                currentPlayer={currentPlayerName}
            ></PlayerBoard>
    
            <div className="DecisionsSection">
                {isWaiting && waiting}
                {revealDecision}
                {chooseInfluenceDecision}
                {actionDecision}
                {exchangeInfluences}
                {challengeDecision}
                {blockChallengeDecision}
                {blockDecision}
                {passButton}
                {isRenderPlay && playAgainButtonElem}
            </div>
    
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <div className="InfluenceSection">{influences}</div>
            </div>
    
            {isRenderPlay && state.playAgain}
            <b>{isRenderPlay && state.winner}</b>
        </div>
    );
    
};

export default Coup;
