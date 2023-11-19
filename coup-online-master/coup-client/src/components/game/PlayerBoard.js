import React from 'react';
import PlayerItem from './PlayerItem';
import './PlayerBoardStyles.css';

export default function PlayerBoard({ players, heroName, currentPlayer }) {
    const heroIndex = players.findIndex(player => player.name === heroName);
    if (heroIndex === -1) {

        return null;
    }

    const playerHero = players[heroIndex];

    const rearrangedPlayers = [
        ...players.slice(heroIndex + 1),
        ...players.slice(0, heroIndex),
    ];

    const positions = [
        { top: '300px', left: '450px' }, 
        { top: '150px', left: '450px' }, 
        { top: '50px',  left: '600px' },  
        { top: '150px', left: '750px' },
        { top: '300px', left: '750px' },
        { top: '400px', left: '600px' },   // Posição 6 (hero)
    ];

    const boardItems = rearrangedPlayers.map((player, index) => (
        <PlayerItem key={index} player={player} position={positions[index]} isCurrentPlayer={player.name===currentPlayer}/>
    ));

    const heroItem = <PlayerItem player={playerHero} position={positions[5]} isCurrentPlayer={playerHero.name == currentPlayer}  />;

    return (
        <div className="player-board">
            {boardItems}
            {heroItem}
        </div>
    );
}

