const constants = require('../utilities/constants');
const Player = require('./Player');




class GameBuilder {
    static buildDeck() {
        const deck = [];
        const cardNames = constants.CardNames.values();

        cardNames.forEach((card) => GameBuilder.addToDeck(card, deck));

        GameBuilder.shuffleArray(deck);
        return deck;
    }

    static buildPlayers(playerData) {
        return playerData.map(({ name, socketID }) => new Player(name, socketID));
    }

    static initializePlayer(player) {
        delete player.chosen;
        player.money = 3;
        player.influences = [];
        player.isDead = false;
        player.color = GameBuilder.colors.pop();
        delete player.isReady;
    }

    static shuffleArray(arr) {
        for (let i = 0; i < arr.length * 2; i++) {
            const one = i % arr.length;
            const two = Math.floor(Math.random() * (arr.length - 1));
            [arr[one], arr[two]] = [arr[two], arr[one]]; // Swap elements
        }
        return arr;
    }

    static addToDeck(cardName, deck) {
        if (!cardName || !deck) {
            console.error("cardName and deck must not be undefined.");
            return;
        }
        for (let i = 0; i < 3; i++) {
            deck.push(cardName);
        }
    }
}

module.exports = { GameBuilder, Player };
