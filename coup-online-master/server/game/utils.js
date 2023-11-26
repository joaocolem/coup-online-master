const constants = require("../utilities/constants");

function addToDeck(cardName, deck) {
    if (!cardName || !deck) {
        console.error("cardName and deck must not be undefined.");
        return;
    }
    for (let i = 0; i < 3; i++) {
        deck.push(cardName);
    }
}

function shuffleArray(arr) {
    if (!arr) {
        console.error("arr must not be undefined.");
        return arr;
    }

    for (let i = 0; i < arr.length * 2; i++) {
        const one = i % arr.length;
        const two = Math.floor(Math.random() * (arr.length - 1));
        [arr[one], arr[two]] = [arr[two], arr[one]]; // Swap elements
    }
    return arr;
}

function buildNameMap(players, key) {
    const map = {};
    players.forEach((x) => {
        map[x.name] = key === 'socketID' ? x.socketID : key === 'index' ? players.indexOf(x) : undefined;
    });
    return map;
}

function buildPlayers(players) {
    const colors = ['#73C373', '#7AB8D3', '#DD6C75', '#8C6CE6', '#EA9158', '#CB8F8F', '#FFC303'];
    shuffleArray(colors);

    players.forEach((x) => {
        delete x.chosen;
        x.money = 2;
        x.influences = [];
        x.isDead = false;
        x.color = colors.pop();
        delete x.isReady;
    });
    console.log(players);
    return players;
}

function exportPlayers(players) {
    players.forEach((x) => {
        delete x.socketID;
    });
    return players;
}

function buildDeck() {
    const deck = [];
    const cardNames = constants.CardNames.values();
    
    cardNames.forEach((card) => addToDeck(card, deck));

    return shuffleArray(deck);
}

module.exports = {
    buildDeck,
    buildPlayers,
    exportPlayers,
    shuffleArray,
    buildNameSocketMap: (players) => buildNameMap(players, 'socketID'),
    buildNameIndexMap: (players) => buildNameMap(players, 'index')
};
