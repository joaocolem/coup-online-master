import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ReactSortable } from 'react-sortablejs';
import Coup from './game/Coup';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const CreateGame = () => {
    const [name, setName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [isInRoom, setIsInRoom] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [players, setPlayers] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [canStart, setCanStart] = useState(false);
    const [socket, setSocket] = useState(null);

    const onNameChange = (name) => {
        setName(name);
    };

    const joinParty = (socket) => {
        socket.emit('setName', name);

        socket.on('joinSuccess', function () {
            console.log('join successful');
            setIsLoading(false);
            setIsInRoom(true);
        });

        socket.on('joinFailed', function (err) {
            console.log('join failed, cause: ' + err);
            setIsLoading(false);
        });

        socket.on('leader', function () {
            console.log('You are the leader');
        });

        socket.on('partyUpdate', (players) => {
            console.log(players);
            setPlayers(players);
            if (
                players.length >= 2 &&
                players.map((x) => x.isReady).filter((x) => x === true).length === players.length
            ) {
                setCanStart(true);
            } else {
                setCanStart(false);
            }
        });

        socket.on('disconnected', function () {
            console.log("You've lost connection with the server");
        });
    };

    const createParty = () => {
        if (name === '') {
            console.log('Please enter a name');
            setErrorMsg('Please enter a name');
            setIsError(true);
            return;
        }

        setIsLoading(true);
        axios
            .get(`${baseUrl}/createNamespace`)
            .then(function (res) {
                console.log(res);
                setRoomCode(res.data.namespace);
                setErrorMsg('');
                setIsError(false);
                setIsLoading(false);
                setSocket(io(`${baseUrl}/${res.data.namespace}`));
            })
            .catch(function (err) {
                console.log('error in creating namespace', err);
                setIsLoading(false);
                setErrorMsg('Error creating room, server is unreachable');
                setIsError(true);
            });
    };

    const startGame = () => {
        socket.emit('startGameSignal', players);

        socket.on('startGame', () => {
            setIsGameStarted(true);
        });
    };

    const copyCode = () => {
        var dummy = document.createElement('textarea');
        document.body.appendChild(dummy);
        dummy.value = roomCode;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        setCopied(true);
    };

    useEffect(() => {
        if (socket) {
            joinParty(socket);

            return () => {
                socket.disconnect();
            };
        }
    }, [socket]);

    useEffect(() => {
        if (isGameStarted) {
            return () => {
                return <Coup name={name} socket={socket}></Coup>;
            };
        }
    }, [isGameStarted]);

    let error = null;
    let roomCodeElem = null;
    let startGameElem = null;
    let createButtonElem = null;
    let youCanSortElem = null;

    if (!isInRoom) {
        createButtonElem = (
            <>
                <button className="createButton" onClick={createParty} disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create'}
                </button>
                <br />
            </>
        );
    }

    if (isError) {
        error = <b>{errorMsg}</b>;
    }

    if (roomCode !== '' && !isLoading) {
        youCanSortElem = <p>You can drag to re-arrange the players in a specific turn order!</p>;
        roomCodeElem = (
            <div>
                <p>
                    ROOM CODE: <br />
                    <br />
                    <b className="RoomCode" onClick={copyCode}>
                        {roomCode} <span className="iconify" data-icon="typcn-clipboard" data-inline="true"></span>
                    </b>
                </p>
                {copied ? <p>Copied to clipboard</p> : null}
            </div>
        );
    }

    if (canStart) {
        startGameElem = <button className="startGameButton" onClick={startGame}>Start Game</button>;
    }

    return (
        <div className="createGameContainer">
            <p>Please enter your name</p>
            <input
                type="text"
                value={name}
                disabled={isLoading || isInRoom}
                onChange={(e) => {
                    if (e.target.value.length <= 10) {
                        setErrorMsg('');
                        setIsError(false);
                        onNameChange(e.target.value);
                    } else {
                        setErrorMsg('Name must be less than 11 characters');
                        setIsError(true);
                    }
                }}
            />
            <br />
            {createButtonElem}
            {error}
            <br />
            {roomCodeElem}
            {youCanSortElem}
            <div className="readyUnitContainer">
                <ReactSortable list={players} setList={(newState) => setPlayers(newState)}>
                    {players.map((item, index) => {
                        let ready = null;
                        let readyUnitColor = '#E46258';
                        if (item.isReady) {
                            ready = <b>Ready!</b>;
                            readyUnitColor = '#73C373';
                        } else {
                            ready = <b>Not Ready</b>;
                        }
                        return (
                            <div className="readyUnit" style={{ backgroundColor: readyUnitColor }} key={index}>
                                <p>
                                    {index + 1}. {item.name} {ready}
                                </p>
                            </div>
                        );
                    })}
                </ReactSortable>
            </div>

            {startGameElem}
        </div>
    );
};

export default CreateGame;
