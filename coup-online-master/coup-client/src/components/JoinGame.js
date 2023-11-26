import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Coup from './game/Coup';
import axios from 'axios';
import { useUser} from './UserContext'
import  LanguageStrings from './utils/strings'

const JoinGame = () => {
    const {user} = useUser();
    const [name, setName] = useState(user.nickname ?? '');
    const [roomCode, setRoomCode] = useState('');
    const [players, setPlayers] = useState([]);
    const [isInRoom, setIsInRoom] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [socket, setSocket] = useState(null);
    const strings = LanguageStrings()

    const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

    const onNameChange = (name) => {
        setName(name);
    };

    const onCodeChange = (roomCode) => {
        setRoomCode(roomCode);
    };

    const joinParty = () => {
        const newSocket = io(`${baseUrl}/${roomCode}`);
        setSocket(newSocket);
        console.log("socket created");
        newSocket.emit('setName', name);

        newSocket.on("joinSuccess", function () {
            console.log("join successful");
            setIsInRoom(true);
        });

        newSocket.on("joinFailed", function (err) {
            console.log("join failed, cause: " + err);
            setErrorMsg(err);
            setIsError(true);
            setIsLoading(false);
            newSocket.disconnect();
        });

        newSocket.on('startGame', () => {
            setIsGameStarted(true);
        });

        newSocket.on('partyUpdate', (updatedPlayers) => {
            console.log(updatedPlayers);
            setPlayers(updatedPlayers);
            if (updatedPlayers.length >= 3 && updatedPlayers.every((player) => player.isReady)) {
                setIsReady(true);
            } else {
                setIsReady(false);
            }
        });

        newSocket.on('disconnected', function () {
            console.log("You've lost connection with the server");
        });
    };

    const attemptJoinParty = () => {
        if (name === '') {
            console.log('Please enter a name');
            setErrorMsg('Please enter a name');
            setIsError(true);
            return;
        }
        if (roomCode === '') {
            console.log('Please enter a room code');
            setErrorMsg('Please enter a room code');
            setIsError(true);
            return;
        }

        setIsLoading(true);
        axios.get(`${baseUrl}/exists/${roomCode}`)
            .then(function (res) {
                console.log(res);
                if (res.data.exists) {
                    setErrorMsg('');
                    setIsError(false);
                    joinParty();
                } else {
                    console.log('Invalid Party Code');
                    setIsLoading(false);
                    setErrorMsg('Invalid Party Code');
                    setIsError(true);
                }
            })
            .catch(function (err) {
                console.log("error in getting exists", err);
                setIsLoading(false);
                setErrorMsg('Server error');
                setIsError(true);
            });
    };

    const reportReady = () => {
        socket.emit('setReady', true);
    };

    useEffect(() => {
        if (isGameStarted) {
            return () => {
                // Cleanup logic if needed
            };
        }
    }, [isGameStarted]);

    if (isGameStarted) {
        return <Coup name={name} socket={socket}></Coup>;
    }

    let error = null;
    let joinReady = null;
    let ready = null;
    if (isError) {
        error = <b>{errorMsg}</b>;
    }
    if (isInRoom) {
        joinReady = <button className="joinButton" onClick={reportReady} disabled={isReady}>{strings.ready}</button>;
    } else {
        joinReady = <button className="joinButton" onClick={attemptJoinParty} disabled={isLoading}>{isLoading ? (strings.joining) : (strings.join)}</button>;
    }
    if (isReady) {
        ready = <b style={{ color: '#5FC15F' }}>{strings.youReady}</b>;
        joinReady = null;
    }

    return (
        <div className="joinGameContainer">
            <p>{strings.yourName}</p>
            <input
                type="text" value={name} disabled={isLoading}
                onChange={(e) => {
                    if (e.target.value.length <= 8) {
                        setErrorMsg('');
                        setIsError(false);
                        onNameChange(e.target.value);
                    } else {
                        setErrorMsg('Name must be less than 9 characters');
                        setIsError(true);
                    }
                }}
            />
            <p>{strings.roomCode}</p>
            <input
                type="text" value={roomCode} disabled={isLoading}
                onChange={(e) => onCodeChange(e.target.value)}
            />
            <br></br>
            {joinReady}
            <br></br>
            {ready}
            <br></br>
            {error}
            <div className="readyUnitContainer">
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
                            <p >{index + 1}. {item.name} {ready}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default JoinGame;
