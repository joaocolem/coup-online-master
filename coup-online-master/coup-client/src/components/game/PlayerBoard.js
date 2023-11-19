import React from 'react';
import PlayerItem from './PlayerItem';
import './PlayerBoardStyles.css';

export default function PlayerBoard({ players, heroName, showHero }) {
    const heroIndex = players.findIndex(player => player.name === heroName);

    if (heroIndex === -1) {
        console.error(`Jogador herói '${heroName}' não encontrado.`);
        return null;
    }

    const playerHero = players[heroIndex];

    const rearrangedPlayers = [
        ...players.slice(heroIndex + 1),
        ...players.slice(0, heroIndex),
    ];

    const positions = [
        { top: '300px', left: '150px' }, 
        { top: '150px', left: '150px' }, 
        { top: '50px',  left: '300px' },  
        { top: '150px', left: '450px' },
        { top: '300px', left: '450px' },
        { top: '400px', left: '300px' },   // Posição 6 (hero)
    ];

    const boardItems = rearrangedPlayers.map((player, index) => (
        <PlayerItem key={index} player={player} position={positions[index]} />
    ));

    const heroItem = showHero ? <PlayerItem player={playerHero} position={positions[5]} /> : null;

    return (
        <div className="player-board">
            {boardItems}
            {heroItem}
        </div>
    );
}

