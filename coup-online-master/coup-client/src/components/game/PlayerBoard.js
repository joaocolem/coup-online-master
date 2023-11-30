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

    const larguraDaTela = window.innerWidth;
    const left6 = ((larguraDaTela/2) - 75).toString() + 'px'
    const positions = [
        { top: '300px', left: '38%' }, 
        { top: '150px', left: '38%' }, 
        { top: '50px',  left: '50%' },  
        { top: '150px', left: '62%' },
        { top: '300px', left: '62%' },
        { top: '400px', left: '50%' },   // Posição 6 (hero)
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

