import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ReactSortable } from 'react-sortablejs';
import Coup from './game/Coup';
import axios from 'axios';
import { useUser } from './UserContext'
import LanguageStrings from './utils/strings'


const baseUrl = "https://coup-online-master.vercel.app" || 'http://localhost:8000';

const CreateGame = () => {
    const strings = LanguageStrings()
    const { user } = useUser();

    const [name, setName] = useState(user.nickname ?? '');
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

            setErrorMsg((strings.enterNameError));
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
                setErrorMsg(strings.createRoomError);
                setIsError(true);
            });
    };

    const startGame = () => {
        socket.emit('startGameSignal', players);
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

            socket.on('startGame', () => {
                setIsGameStarted(true);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [socket]);

    useEffect(() => {
        if (isGameStarted) {
            return () => {
                // Cleanup logic if needed
            };
        }
    }, [isGameStarted]);

    if (isGameStarted) {
        return <Coup name={name} socket={socket} ></Coup>;

    }

    let error = null;
    let roomCodeElem = null;
    let startGameElem = null;
    let createButtonElem = null;
    let youCanSortElem = null;

    if (!isInRoom) {
        createButtonElem = (
            <>
                <button className="createButton" onClick={createParty} disabled={isLoading}>
                    {isLoading ? (strings.creating) : (strings.create)}
                </button>
                <br />
            </>
        );
    }

    if (isError) {
        error = <b>{errorMsg}</b>;
    }

    if (roomCode !== '' && !isLoading) {
        youCanSortElem = <p>{strings.dragPlayersMessage}</p>;
        roomCodeElem = (
            <div>
                <p>
                    {strings.roomCode} <br />
                    <br />
                    <b className="RoomCode" onClick={copyCode}>
                        {roomCode} <span className="iconify" data-icon="typcn-clipboard" data-inline="true"></span>
                    </b>
                </p>
                {copied ? <p>{strings.copiedToClip}</p> : null}
            </div>
        );
    }

    if (canStart) {
        startGameElem = <button className="startGameButton" onClick={startGame}>{strings.startGame}</button>;
    }

    return (
        <div className="createGameContainer">
            <p>{strings.pleseEnterName}</p>
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
                        setErrorMsg(strings.lessNameError);
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
                            ready = <b>{strings.ready}</b>;
                            readyUnitColor = '#73C373';
                        } else {
                            ready = <b>{strings.notReady}</b>;
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
