const express = require('express');
const moment = require('moment');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const utilities = require('./utilities/utilities');
const CoupGame = require('./game/coup');

// Server setup
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 8000;
let namespaces = {}; //AKA party rooms

// Middleware
app.use(cors());

// Route handlers
app.get("/", (req, res) => res.send("Express on Vercel"));

app.get('/createNamespace', function (req, res) {
    let newNamespace = '';
    while (newNamespace === '' || (newNamespace in namespaces)) {
        newNamespace = utilities.generateNamespace(); //default length 6
    }
    const newSocket = io.of(`/${newNamespace}`);
    openSocket(newSocket, `/${newNamespace}`);
    namespaces[newNamespace] = null;
    console.log(`${newNamespace} CREATED`);
    res.json({ namespace: newNamespace });
});

app.get('/exists/:namespace', function (req, res) {
    const namespace = req.params.namespace;
    res.json({ exists: (namespace in namespaces) });
});

// Game namespace: oneRoom
function openSocket(gameSocket, namespace) {
    let players = []; // Includes deleted for index purposes
    let partyMembers = []; // Actual members
    let partyLeader = '';
    let started = false;

    gameSocket.on('connection', (socket) => {
        console.log('id: ' + socket.id);
        players.push({
            "player": '',
            "socket_id": `${socket.id}`,
            "isReady": false
        });
        console.log(`Player ${players.length} has connected`);
        socket.join(socket.id);
        console.log('Socket joined ' + socket.id);

        const index = players.length - 1;

        // Update party list
        const updatePartyList = () => {
            partyMembers = players.map(x => {
                return { name: x.player, socketID: x.socket_id, isReady: x.isReady };
            }).filter(x => x.name !== '');
            console.log(partyMembers);
            gameSocket.emit('partyUpdate', partyMembers);
        };

        // Handle name setting
        socket.on('setName', (name) => {
            if (started) {
                gameSocket.to(players[index].socket_id).emit("joinFailed", 'game_already_started');
                return;
            }
            if (!players.map(x => x.player).includes(name)) {
                if (partyMembers.length >= 6) {
                    gameSocket.to(players[index].socket_id).emit("joinFailed", 'party_full');
                } else {
                    if (partyMembers.length === 0) {
                        partyLeader = players[index].socket_id;
                        players[index].isReady = true;
                        gameSocket.to(players[index].socket_id).emit("leader");
                        console.log("PARTY LEADER IS: " + partyLeader);
                    }
                    players[index].player = name;
                    updatePartyList();
                    gameSocket.to(players[index].socket_id).emit("joinSuccess", players[index].socket_id);
                }
            } else {
                gameSocket.to(players[index].socket_id).emit("joinFailed", 'name_taken');
            }
        });

        // Handle readiness
        socket.on('setReady', (isReady) => {
            players[index].isReady = isReady;
            updatePartyList();
            gameSocket.to(players[index].socket_id).emit("readyConfirm");
        });

        // Start game signal
        socket.on('startGameSignal', () => {
            started = true;
            gameSocket.emit('startGame');
            startGame(players, gameSocket, namespace);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('Disconnected: ' + socket.id);
            players.forEach((player, index) => {
                if (player.socket_id === socket.id) {
                    gameSocket.emit('g-addLog', `${player.player} has disconnected`);
                    players[index].player = '';
                    if (socket.id === partyLeader) {
                        console.log('Leader has disconnected');
                        gameSocket.emit('leaderDisconnect', 'leader_disconnected');
                        socket.removeAllListeners();
                        delete io.nsps[namespace];
                        delete namespaces[namespace.substring(1)];
                        players = [];
                        partyMembers = [];
                    }
                }
            });
            updatePartyList();
        });
    });

    // Remove empty namespaces after 10 seconds
    let checkEmptyInterval = setInterval(() => {
        if (Object.keys(gameSocket.sockets).length === 0) {
            delete io.nsps[namespace];
            if (namespaces[namespace] !== null) {
                delete namespaces[namespace.substring(1)];
            }
            clearInterval(checkEmptyInterval);
            console.log(namespace + ' deleted');
        }
    }, 10000);
}

function startGame(players, gameSocket, namespace) {
    namespaces[namespace.substring(1)] = new CoupGame(players, gameSocket);
    namespaces[namespace.substring(1)].start();
}

// Start server
server.listen(process.env.PORT || port, function () {
    console.log(`Server listening on ${process.env.PORT || port}`);
});

module.exports = app;
