import React, { Component } from 'react'
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

export default class Coup extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
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
             disconnected: false
        }

        this.playAgainButton = <>
            <br></br>
            <button className="startGameButton" onClick={() => {
                this.props.socket.emit('g-playAgain');
            }}>Play Again</button>
        </>

        this.props.socket.on('disconnect', reason => {
            this.setState({ disconnected: true });
        })

        this.props.socket.on('g-gameOver', (winner) => {
            this.setState({winner: `${winner} Wins!`})
            this.setState({playAgain: this.playAgainButton})
        })
        this.props.socket.on('g-updatePlayers', (players) => {
            this.setState({playAgain: null})
            this.setState({winner: null})
            players = players.filter(x => !x.isDead);
            let playerIndex = null;
            for(let i = 0; i < players.length; i++) {
                console.log(players[i].name, this.props.name)
                if(players[i].name === this.props.name) {
                    playerIndex = i;
                    break;
                }
            }
            if(playerIndex == null) {
                this.setState({ isDead: true })
            }else {
                this.setState({ isDead: false})
            }
            console.log(playerIndex)
            this.setState({playerIndex, players});
            
        });
        this.props.socket.on('g-updateCurrentPlayer', (currentPlayer) => {
            console.log('currentPlayer: ', currentPlayer)
            this.setState({ currentPlayer });
        });
        this.props.socket.on('g-addLog', (log) => {
            let splitLog=  log.split(' ');
            let coloredLog = [];
            coloredLog = splitLog.map((item, index) => {
                let found = null
                this.state.players.forEach(player => {
                    if(item === player.name){
                        found = <b style={{color: player.color}}>{player.name} </b>;
                    }
                })
                if(found){
                    return found;
                }
                return <>{item+' '}</>
            })
            this.state.logs = [...this.state.logs, coloredLog]
            this.setState({logs :this.state.logs})
        })
        this.props.socket.on('g-chooseAction', () => {        
            this.setState({ isChooseAction: true})
        });
        this.props.socket.on('g-openExchange', (drawTwo) => {
            let influences = [...this.state.players[this.state.playerIndex].influences, ...drawTwo];
            this.setState({ exchangeInfluence: influences });
        })
        this.props.socket.on('g-openChallenge', (action) => {
            if(this.state.isDead) {
                return
            }
            if(action.source !== this.props.name) {
               this.setState({ action }) 
            } else {
                this.setState({ action: null }) 
            }
        });
        this.props.socket.on('g-openBlockChallenge', (blockChallengeRes) => {
            if(this.state.isDead) {
                return
            }
            if(blockChallengeRes.counterAction.source !== this.props.name) {
               this.setState({ blockChallengeRes }) 
            } else {
                this.setState({ blockChallengeRes: null }) 
            }
        });
        this.props.socket.on('g-openBlock', (action) => {
            if(this.state.isDead) {
                return
            }
            if(action.source !== this.props.name) {
                this.setState({ blockingAction: action })
             } else {
                 this.setState({ blockingAction: null }) 
             }
        });
        this.props.socket.on('g-chooseReveal', (res) => {
            console.log(res)
            this.setState({ revealingRes: res});
        });
        this.props.socket.on('g-chooseInfluence', () => {
            this.setState({ isChoosingInfluence: true });
        });
        this.props.socket.on('g-closeChallenge', () => {
            this.setState({ action: null });
        });
        this.props.socket.on('g-closeBlock', () => {
            this.setState({ blockingAction: null });
        });
        this.props.socket.on('g-closeBlockChallenge', () => {
            this.setState({ blockChallengeRes: null });
        });
    }

    deductCoins = (amount) => {
        let res = {
            source: this.props.name,
            amount: amount
        }
        this.props.socket.emit('g-deductCoins', res);
    }

    doneAction = () => {
        this.setState({ 
            isChooseAction: false
        })
    }
    doneChallengeBlockingVote = () => {
        this.setState({ action: null }); //challemge
        this.setState({ blockChallengeRes: null}); //challenge a block
        this.setState({ blockingAction: null }); //block
    }
    closeOtherVotes = (voteType) => {
        if(voteType === 'challenge') {
            this.setState({ blockChallengeRes: null}); //challenge a block
            this.setState({ blockingAction: null }); //block
        }else if(voteType === 'block') {
            this.setState({ action: null }); //challemge
            this.setState({ blockChallengeRes: null}); //challenge a block
        }else if(voteType === 'challenge-block') {
            this.setState({ action: null }); //challemge
            this.setState({ blockingAction: null }); //block
        }
    }
    doneReveal = () => {
        this.setState({ revealingRes: null });
    }
    doneChooseInfluence = () => {
        this.setState({ isChoosingInfluence: false })
    }
    doneExchangeInfluence = () => {
        this.setState({ exchangeInfluence: null })
    }
    pass = () => {
        if(this.state.action != null) { //challengeDecision
            let res = {
                isChallenging: false,
                action: this.state.action
            }
            console.log(res)
            this.props.socket.emit('g-challengeDecision', res);
        }else if(this.state.blockChallengeRes != null) { //BlockChallengeDecision
            let res = {
                isChallenging: false
            }
            console.log(res)
            this.props.socket.emit('g-blockChallengeDecision', res);
        }else if(this.state.blockingAction !== null) { //BlockDecision
            const res = {
                action: this.state.blockingAction,
                isBlocking: false
            }
            console.log(res)
            this.props.socket.emit('g-blockDecision', res)
        }
        this.doneChallengeBlockingVote();
    }

    influenceColorMap = {
        duke: '#D55DC7',
        captain: '#80C6E5',
        assassin: '#2B2B2B',
        contessa: '#E35646',
        ambassador: '#B4CA1F'
    }
    
    render() {
        let actionDecision = null
        let currentPlayer = null
        let currentPlayerName = null
        let revealDecision = null
        let challengeDecision = null
        let blockChallengeDecision = null
        let chooseInfluenceDecision = null
        let blockDecision = null
        let influences = null
        let pass = null
        let coins = null
        let exchangeInfluences = null
        let playAgain = null
        let isWaiting = true
        let waiting = null
        if(this.state.isChooseAction && this.state.playerIndex != null) {
            isWaiting = false;
            actionDecision = <ActionDecision doneAction={this.doneAction} deductCoins={this.deductCoins} name={this.props.name} socket={this.props.socket} money={this.state.players[this.state.playerIndex].money} players={this.state.players}></ActionDecision>
        }
        if(this.state.currentPlayer) {
            currentPlayerName = this.state.currentPlayer
            currentPlayer = <p>It is <b>{this.state.currentPlayer}</b>'s turn</p>
        }
        if(this.state.revealingRes) {
            isWaiting = false;
            revealDecision = <RevealDecision doneReveal={this.doneReveal} name ={this.props.name} socket={this.props.socket} res={this.state.revealingRes} influences={this.state.players.filter(x => x.name === this.props.name)[0].influences}></RevealDecision>
        }
        if(this.state.isChoosingInfluence) {
            isWaiting = false;
            chooseInfluenceDecision = <ChooseInfluence doneChooseInfluence={this.doneChooseInfluence} name ={this.props.name} socket={this.props.socket} influences={this.state.players.filter(x => x.name === this.props.name)[0].influences}></ChooseInfluence>
        }
        if(this.state.action != null || this.state.blockChallengeRes != null || this.state.blockingAction !== null){
            pass = <button onClick={() => this.pass()}>Pass</button>
        }
        if(this.state.action != null) {
            isWaiting = false;
            challengeDecision = <ChallengeDecision closeOtherVotes={this.closeOtherVotes} doneChallengeVote={this.doneChallengeBlockingVote} name={this.props.name} action={this.state.action} socket={this.props.socket} ></ChallengeDecision>
        }
        if(this.state.exchangeInfluence) {
            isWaiting = false;
            exchangeInfluences = <ExchangeInfluences doneExchangeInfluence={this.doneExchangeInfluence} name={this.props.name} influences={this.state.exchangeInfluence} socket={this.props.socket}></ExchangeInfluences>
        }
        if(this.state.blockChallengeRes != null) {
            isWaiting = false;
            blockChallengeDecision = <BlockChallengeDecision closeOtherVotes={this.closeOtherVotes} doneBlockChallengeVote={this.doneChallengeBlockingVote} name={this.props.name} prevAction={this.state.blockChallengeRes.prevAction} counterAction={this.state.blockChallengeRes.counterAction} socket={this.props.socket} ></BlockChallengeDecision>
        }
        if(this.state.blockingAction !== null) {
            isWaiting = false;
            blockDecision = <BlockDecision closeOtherVotes={this.closeOtherVotes} doneBlockVote={this.doneChallengeBlockingVote} name={this.props.name} action={this.state.blockingAction} socket={this.props.socket} ></BlockDecision>
        }
        if (this.state.playerIndex != null && !this.state.isDead) {
            influences = (
                <div className="InfluencesContainer">
                    {this.state.players[this.state.playerIndex].influences.map((influence, index) => {
                        let icon = null;
        
                        switch (influence) {
                            case 'duke':
                                icon = faChessKnight;
                                break;
                            case 'captain':
                                icon = faShip;
                                break;
                            case 'assassin':
                                icon = faSkull;
                                break;
                            case 'contessa':
                                icon = faCrown;
                                break;
                            case 'ambassador':
                                icon = faHandshake;
                                break;
                            default:
                                // Pode adicionar um ícone padrão ou lidar com outros casos
                                break;
                        }
        
                        return (
                            <div key={index} className="InfluenceUnitContainer">
                                <FontAwesomeIcon icon={icon} style={{ color: `${this.influenceColorMap[influence]}` }} />
                                <br />
                                <h3>{influence}</h3>
                            </div>
                        );
                    })}
                </div>
            );
        
            coins = <p style={{ textAlign: 'center' }}>Coins: {this.state.players[this.state.playerIndex].money}</p>;
        }
        
        
        
        if (isWaiting && !this.state.isDead) {
            waiting = <p className="waitingMessage">Waiting for other players...</p>;
        }

        
        if(this.state.disconnected) {
            return (
                <div className="GameContainer">
                    <div className="GameHeader">
                        <div className="PlayerInfo">
                            <p>You are: {this.props.name}</p>
                            {coins}
                        </div>
                        <RulesModal/>
                        <CheatSheetModal/>
                    </div>
                    <p>You have been disconnected :c</p>
                    <p>Please recreate the game.</p>
                    <p>Sorry for the inconvenience (シ_ _)シ</p>
                </div>
            )
        }
        return (
            <div className="GameContainer">
                <div className="GameHeader">
                    <div className="PlayerInfo">
                        <p>You are: {this.props.name}</p>
                        {coins}
                    </div>
                    <div className="CurrentPlayer">
                        {currentPlayer}
                    </div>
                    <RulesModal/>
                    <CheatSheetModal/>
                    <EventLog logs={this.state.logs}></EventLog>
                </div>

                <PlayerBoard players={this.state.players} heroName={this.props.name} currentPlayer={currentPlayerName}></PlayerBoard>
                <div className="DecisionsSection">
                    {waiting}
                    {revealDecision}
                    {chooseInfluenceDecision}
                    {actionDecision}
                    {exchangeInfluences}
                    {challengeDecision}
                    {blockChallengeDecision}
                    {blockDecision}
                    {pass}
                    {playAgain}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <div className="InfluenceSection">
                        {influences}
                    </div>
            </div>
                {this.state.playAgain}
                <b>{this.state.winner}</b>
            </div>
        )
    }
}
