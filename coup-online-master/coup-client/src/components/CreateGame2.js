import React, { Component, useState} from 'react';
import io from "socket.io-client";
import { ReactSortable } from "react-sortablejs";
import Coup from './game/Coup';

const axios = require('axios');
const baseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"

export default function CreateGame() {
    const [state, setState] = useState({
        name: '',
        roomCode: '',
        copied: false,
        isInRoom: false,
        isLoading: false,
        players: [],
        isError: false,
        isGameStarted: false,
        errorMsg: '',
        canStart: false,
        socket: null,

    });

    onNameChange = (name) => {
        setState({ name });
    }

    joinParty = () => {
        const bind = this
        const socket = io(`${baseUrl}/${state.roomCode}`);
        setState({ socket });
        console.log("socket created")
        socket.emit('setName', state.name);
        
        socket.on("joinSuccess", function() {
            console.log("join successful")
            bind.setState({ 
                isLoading: false,
                isInRoom: true
            });
        })

        socket.on("joinFailed", function(err) {
            console.log("join failed, cause: " + err);
            bind.setState({ isLoading: false });
        })

        socket.on("leader", function() {
            console.log("You are the leader")
        })

        socket.on('partyUpdate', (players) => {
            console.log(players)
            setState({ players })
            if(players.length >= 2 && players.map(x => x.isReady).filter(x => x === true).length === players.length) { //TODO CHANGE 2 BACK TO 3
                setState({ canStart: true })
            } else {
                setState({ canStart: false })
            }
        })

        socket.on('disconnected', function() {
            console.log("You've lost connection with the server")
        });
    }

    createParty = () => {
        if(state.name === '') {
            //TODO  handle error
            console.log('Please enter a name');
            setState({ errorMsg: 'Please enter a name' });
            setState({ isError: true });
            return
        }

        setState({ isLoading: true });
        const bind = this;
        axios.get(`${baseUrl}/createNamespace`)
            .then(function (res) {
                console.log(res);
                bind.setState({ roomCode: res.data.namespace, errorMsg: '' });
                bind.joinParty();
            })
            .catch(function (err) {
                //TODO  handle error
                console.log("error in creating namespace", err);
                bind.setState({ isLoading: false });
                bind.setState({ errorMsg: 'Error creating room, server is unreachable' });
                bind.setState({ isError: true });
            })
    }

    startGame = () => {
        state.socket.emit('startGameSignal', state.players)

        state.socket.on('startGame', () => {
            setState({ isGameStarted: true});
        })
    }

    copyCode = () => {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = state.roomCode;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        setState({copied: true})
    }


    const render = function() {
        if(state.isGameStarted) {
            return (<Coup name={state.name} socket={state.socket}></Coup>)
        }
        let error = null;
        let roomCode = null;
        let startGame = null;
        let createButton = null;
        let youCanSort = null;
        if(!state.isInRoom) {
            createButton = <>
            <button className="createButton" onClick={this.createParty} disabled={state.isLoading}>{state.isLoading ? 'Creating...': 'Create'}</button>
            <br></br>
            </>
        }
        if(state.isError) {
            error = <b>{state.errorMsg}</b>
        }
        if(state.roomCode !== '' && !state.isLoading) {
            youCanSort = <p>You can drag to re-arrange the players in a specific turn order!</p>
            roomCode = <div>
                    <p>ROOM CODE: <br></br> <br></br><b className="RoomCode" onClick={this.copyCode}>{state.roomCode} <span className="iconify" data-icon="typcn-clipboard" data-inline="true"></span></b></p>
                    {state.copied ? <p>Copied to clipboard</p> : null}
                </div>
        }
        if(state.canStart) {
            startGame = <button className="startGameButton" onClick={this.startGame}>Start Game</button>
        }
        return (
            <div className="createGameContainer">
                <p>Please enter your name</p>
                <input
                    type="text" value={state.name} disabled={state.isLoading || state.isInRoom}
                    onChange={e => {
                        if(e.target.value.length <= 10){
                            setState({
                                errorMsg: '',
                                isError: false
                            })
                            this.onNameChange(e.target.value);
                        } else {
                            setState({
                                errorMsg: 'Name must be less than 11 characters',
                                isError: true
                            })
                        }
                        
                    }}
                />
                <br></br>
                {createButton}
                {error}
                <br></br>
                {roomCode}
                {youCanSort}
                <div className="readyUnitContainer">
                    <ReactSortable list={state.players} setList={newState => setState({ players: newState })}>
                        {state.players.map((item,index) => {
                            let ready = null
                            let readyUnitColor = '#E46258'
                            if(item.isReady) {
                                ready = <b>Ready!</b>
                                readyUnitColor = '#73C373'
                            } else {
                                ready = <b>Not Ready</b>
                            }
                            return (
                                    <div className="readyUnit" style={{backgroundColor: readyUnitColor}} key={index}>
                                        <p >{index+1}. {item.name} {ready}</p>
                                    </div>
                            )
                            })
                        }
                    </ReactSortable>
                </div>
                
                {startGame}
            </div>
                
        )
    }

    render();
}
