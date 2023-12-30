const express = require('express');
const cors = require('cors');

const utilities = require('./utilities/utilities');
const GameSocket = require('./game/GameSocket')

const app = express();

app.use(cors());

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.REACT_APP_SERVER_PORT;

let namespaces = {};

app.get('/createNamespace', function (_, res) { 
    let newNamespace = '';

    while(newNamespace === '' || (newNamespace in namespaces)) {
        newNamespace = utilities.generateNamespace();
    }
    
    new GameSocket(newNamespace, namespaces, io);
    namespaces[newNamespace] = null;

    res.json({namespace: newNamespace});
})

app.get('/exists/:namespace', function (req, res) {
    const namespace = req.params.namespace;
    res.json({exists: (namespace in namespaces)});
})

server.listen(port, function(){
    console.log(`listening on ${port}`);
});