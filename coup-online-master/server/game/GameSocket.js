const DataBase = require('../model/base.js');
const CoupGame = require('./coup');

class GameSocket {
    constructor(namespace, arrayNamespace, io) {
        this.io = io;
        this.gameSocket = io.of(`/${namespace}`);;
        this.namespace = namespace;
        this.players = [];
        this.playerIndex = null;
        this.partyMembers = [];
        this.partyLeaderSocketID = null;
        this.started = false;
        this.arrayNamespace = arrayNamespace;
        this.db = new DataBase();

        this.handleSocket();
    }

    handleSocket() {
        this.gameSocket.on('connection', socket => {
            socket.on('setName', name => this.handleSetName(name));
            socket.on('setReady', isReady => this.handleSetReady(isReady));
            socket.on('startGameSignal', players => this.handleStartSignal(players));
            socket.on('disconnect', () => this.handleDesconnect(socket));
            socket.on('register', data => this.handleRegister(data));
            socket.on('request-login', data => this.handleLogin(data));
            socket.on('recuperar-senha', email => this.handleRecuperarSenha(email));
            socket.on('redefinir-senha', data => this.handleRedefinirSenha(data));

            this.updatePlayers(socket);
        });
    }

    updatePlayers(socket) {
        this.players.push({
            "player": '',
            "socket_id": `${socket.id}`,
            "isReady": false
        });
        
        socket.join(socket.id);
        this.playerIndex = this.players.length - 1;
    }

    updatePartyList() {
        this.partyMembers = this.players
            .map(x => ({name: x.player, socketID: x.socket_id, isReady: x.isReady}))
            .filter(x => x.name != '');
        this.gameSocket.emit('partyUpdate', this.partyMembers);
    }

    handleSetName(name) {
        const player = this.players[this.playerIndex];
        const players = this.players.map(x => x.player);

        if(this.started) {
            this.gameSocket.to(player.socket_id).emit("joinFailed", 'game_already_started');
            return;
        }

        if(!players.includes(name)){
            if(this.partyMembers.length >= 6) {
                this.gameSocket
                    .to(player.socket_id)
                    .emit("joinFailed", 'party_full');
                return;
            }

            if(this.partyMembers.length === 0) {
                this.partyLeaderSocketID = player.socket_id;
                player.isReady = true;

                this.gameSocket
                    .to(player.socket_id)
                    .emit("leader");
            }
            player.player = name;
            this.updatePartyList();
            this.gameSocket
                .to(player.socket_id)
                .emit("joinSuccess", player.socket_id);
            
            return;
        }

        this.gameSocket
            .to(player.socket_id)
            .emit("joinFailed", 'name_taken');
    }

    handleSetReady(isReady) {
        const player = this.players[this.playerIndex]

        player.isReady = isReady;        
        this.gameSocket
        .to(player.socket_id)
        .emit("readyConfirm");

        this.updatePartyList();
    }
    
    handleStartSignal(players) {
        this.started = true;
        this.gameSocket.emit('startGame');

        this.startGame(players);
    }

    handleDesconnect(socket) {
        const player = this.players[this.playerIndex];

        this.players.forEach((_player, index) => {
            if(_player.socket_id == socket.id) {
                this.gameSocket.emit('g-addLog', `${JSON.stringify(player.player)} has disconnected`);
                this.gameSocket.emit('g-addLog', 'Please recreate the game.');
                this.gameSocket.emit('g-addLog', 'Sorry for the inconvenience (シ_ _)シ');
                player.player ='';
            }

            if(socket.id === this.partyLeaderSocketID) {
                this.gameSocket.emit('leaderDisconnect', 'leader_disconnected');
                socket.removeAllListeners();
                delete this.io.nsps[namespace];
                delete this.arrayNamespace[this.namespace.substring(1)]
                this.players = [];
                this.partyMembers = []
            }
        });
        
        this.updatePartyList();
    }

    handleRegister(data) {
        db
        .insertInto('users', ['email', 'password', 'nickname'], data)
        .then(() => socket.emit('cadastrado'))
        .catch(err => socket.emit('nao-cadastrado', err));
    }

    handleLogin(data) {
        db
        .selectFrom('users', '*', `email = '${data.email}'`, )
        .then( dbData => {
            if(!dbData) return socket.emit('no-login');

            dbData.password === data.senha ? socket.emit('login-ok', dbData) : socket.emit('login-not-ok');
        })
        .catch(err => {
            console.error(err);
            socket.emit('no-login');
        });
    }

    handleRecuperarSenha(email) {
        db
        .selectFrom('users', '*', `email = '${email}'`)
        .then( data => utilities.sendemail(data))
        .then(() => console.log('Enviado'))
        .catch(err => console.log(err));
    }

    handleRedefinirSenha(data) {
        db
        .update('users', 'password', `user_id = ${data.userId}`, data.password)
        .then(() => socket.emit('senha-redefinida'))
        .catch( err => console.error(err));
    }

    checkEmptyInterval() {
        return new Promise ((resolve,_) => {
            setInterval(() => {
                if(Object.keys(this.gameSocket['sockets']).length == 0) {
                    delete this.io.nsps[this.namespace];
                }
                if(this.arrayNamespace[this.namespace] != null) {
                    delete this.arrayNamespace[this.namespace.substring(1)]
                }
                resolve(`${this.namespace} deleted`);
            }, 10000);
        })
    }

    startGame(players) {
        this.arrayNamespace[this.namespace.substring(1)] = new CoupGame(players, this.gameSocket).start();
    }
}

module.exports = GameSocket;