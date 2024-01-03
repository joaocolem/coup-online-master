const constants = require("../utilities/constants");

class GameUtils {
    static addToDeck(cardName, deck) {
        if (!cardName || !deck) {
            console.error("cardName and deck must not be undefined.");
            return;
        }
        for (let i = 0; i < 3; i++) {
            deck.push(cardName);
        }
    }

    static shuffleArray(arr) {
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

    static buildNameMap(players, key) {
        const map = {};
        players.forEach((x) => {
            map[x.name] = key === 'socketID' ? x.socketID : key === 'index' ? players.indexOf(x) : undefined;
        });
        return map;
    }

    static buildPlayers(players) {
        const colors = [
            '#4A90E2',
            '#9370DB',
            '#8A2BE2',
            '#8B4513',
            '#4169E1',
            '#800000',
            '#2E8B57',
            '#9932CC',
            '#B22222',
            '#008080',
            '#6A5ACD',
            '#DC143C',
            '#556B2F',
            '#483D8B',
            '#A52A2A'
        ];

        this.shuffleArray(colors);

        players.forEach((x) => {
            delete x.chosen;
            x.money = 3;
            x.influences = [];
            x.isDead = false;
            x.color = colors.pop();
            delete x.isReady;
        });
        console.log(players);
        return players;
    }

    static exportPlayers(players) {
        players.forEach((x) => {
            delete x.socketID;
        });
        return players;
    }

    static buildDeck() {
        const deck = [];
        const cardNames = constants.CardNames.values();

        cardNames.forEach((card) => this.addToDeck(card, deck));

        return this.shuffleArray(deck);
    }

    static buildNameSocketMap(players) {
        return this.buildNameMap(players, 'socketID');
    }

    static buildNameIndexMap(players) {
        return this.buildNameMap(players, 'index');
    }
}

module.exports = GameUtils;
